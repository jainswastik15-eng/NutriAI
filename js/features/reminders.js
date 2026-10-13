const REMINDER_DEFAULTS={
  email:"",
  reminder_time:"18:00",
  timezone:(function(){
    try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"Asia/Kolkata"}
    catch(e){return "Asia/Kolkata"}
  })(),
  frequency:"daily",
  custom_days:[1,2,3,4,5,6,7],
  reminder_types:{
    daily_plan:true,
    hydration:true,
    sports:false,
    weekly_report:false
  },
  enabled:true,
  consent:false
};

let nutriSupabaseClient=null;

function reminderCloneDefaults(){
  return JSON.parse(JSON.stringify(REMINDER_DEFAULTS));
}
function reminderLoadLocal(){
  if(state.reminderSettings)return state.reminderSettings;
  let settings=reminderCloneDefaults();
  try{
    const saved=safeStorage.getItem("nutriReminderSettings");
    if(saved){
      const parsed=JSON.parse(saved);
      settings={
        ...settings,
        ...parsed,
        reminder_types:{...settings.reminder_types,...(parsed.reminder_types||{})},
        custom_days:Array.isArray(parsed.custom_days)?parsed.custom_days:settings.custom_days
      };
    }
  }catch(e){}
  state.reminderSettings=settings;
  return settings;
}
function reminderSaveLocal(){
  const s=reminderLoadLocal();
  safeStorage.setItem("nutriReminderSettings",JSON.stringify(s));
}
function reminderBackendConfigured(){
  const cfg=window.NUTRIAI_SUPABASE||{};
  return Boolean(
    cfg.url &&
    cfg.publishableKey &&
    !String(cfg.url).includes("YOUR_PROJECT_REF") &&
    !String(cfg.publishableKey).includes("REPLACE_ME")
  );
}
function reminderGetClient(){
  if(nutriSupabaseClient)return nutriSupabaseClient;
  if(!reminderBackendConfigured())throw new Error("Supabase is not configured yet.");
  if(!window.supabase||typeof window.supabase.createClient!=="function"){
    throw new Error("Supabase browser library did not load. Check your internet connection.");
  }
  const cfg=window.NUTRIAI_SUPABASE;
  nutriSupabaseClient=window.supabase.createClient(cfg.url,cfg.publishableKey,{
    auth:{
      persistSession:true,
      autoRefreshToken:true,
      detectSessionInUrl:false
    }
  });
  return nutriSupabaseClient;
}
async function reminderEnsureUser(){
  const client=reminderGetClient();
  const sessionResult=await client.auth.getSession();
  if(sessionResult.error)throw sessionResult.error;
  if(sessionResult.data&&sessionResult.data.session&&sessionResult.data.session.user){
    return sessionResult.data.session.user;
  }
  const signIn=await client.auth.signInAnonymously();
  if(signIn.error)throw signIn.error;
  if(!signIn.data||!signIn.data.user)throw new Error("Anonymous sign-in did not return a user.");
  return signIn.data.user;
}
function reminderSetStatus(message,error){
  state.reminderStatus=error?"":message;
  state.reminderError=error?message:"";
}
function reminderField(key,value){
  const s=reminderLoadLocal();
  if(key==="enabled"||key==="consent")value=Boolean(value);
  s[key]=value;
  reminderSaveLocal();
}
function reminderToggleDay(day){
  const s=reminderLoadLocal();
  const n=Number(day);
  const set=new Set((s.custom_days||[]).map(Number));
  if(set.has(n))set.delete(n); else set.add(n);
  s.custom_days=[...set].sort((a,b)=>a-b);
  reminderSaveLocal();
  render();
}
function reminderToggleType(type){
  const s=reminderLoadLocal();
  s.reminder_types=s.reminder_types||{};
  s.reminder_types[type]=!s.reminder_types[type];
  reminderSaveLocal();
  render();
}
function reminderValidate(){
  const s=reminderLoadLocal();
  const email=String(s.email||"").trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return "Enter a valid email address.";
  }
  if(!/^\d{2}:\d{2}$/.test(String(s.reminder_time||""))){
    return "Choose a reminder time.";
  }
  if(s.frequency==="custom"&&(!s.custom_days||!s.custom_days.length)){
    return "Choose at least one custom reminder day.";
  }
  if(!Object.values(s.reminder_types||{}).some(Boolean)){
    return "Choose at least one reminder type.";
  }
  if(!s.consent){
    return "Please agree to receive NutriAI reminder emails.";
  }
  return "";
}
async function reminderLoadRemote(){
  reminderLoadLocal();
  if(state.reminderLoaded||state.reminderLoading)return;
  state.reminderLoading=true;
  reminderSetStatus("","");
  try{
    if(!reminderBackendConfigured()){
      state.reminderLoaded=true;
      reminderSetStatus("Reminder form is ready, but email delivery is not connected yet. Configure Supabase using GITHUB_EMAIL_SETUP.md.",true);
      return;
    }
    const client=reminderGetClient();
    const user=await reminderEnsureUser();
    const result=await client
      .from("reminders")
      .select("*")
      .eq("user_id",user.id)
      .maybeSingle();

    if(result.error)throw result.error;
    if(result.data){
      const local=reminderLoadLocal();
      state.reminderSettings={
        ...local,
        ...result.data,
        reminder_types:{...local.reminder_types,...(result.data.reminder_types||{})},
        custom_days:Array.isArray(result.data.custom_days)?result.data.custom_days:local.custom_days
      };
      reminderSaveLocal();
      reminderSetStatus(result.data.enabled?"Email reminders are connected and enabled.":"Reminder settings loaded. Email reminders are currently disabled.",false);
    }else{
      reminderSetStatus("Connected to Supabase. Enter your email and save your reminder settings.",false);
    }
  }catch(e){
    reminderSetStatus("Could not connect reminder settings: "+(e.message||e),true);
  }finally{
    state.reminderLoading=false;
    state.reminderLoaded=true;
    if(state.tab==="Reminders")render();
  }
}
async function saveReminderSettings(){
  const error=reminderValidate();
  if(error){
    reminderSetStatus(error,true);
    render();
    return;
  }

  const s=reminderLoadLocal();
  s.email=String(s.email||"").trim();
  s.enabled=true;
  reminderSaveLocal();

  if(!reminderBackendConfigured()){
    reminderSetStatus("Saved on this device only. Email delivery is not active until Supabase is configured.",true);
    render();
    return;
  }

  state.reminderBusy=true;
  reminderSetStatus("Saving reminder settings...",false);
  render();

  try{
    const client=reminderGetClient();
    const user=await reminderEnsureUser();
    const record={
      user_id:user.id,
      email:s.email,
      profile_name:(state.profile&&state.profile.name)||"",
      reminder_time:s.reminder_time,
      timezone:s.timezone||REMINDER_DEFAULTS.timezone,
      frequency:s.frequency,
      custom_days:s.custom_days,
      reminder_types:s.reminder_types,
      enabled:true,
      consent:true,
      updated_at:new Date().toISOString()
    };
    const result=await client
      .from("reminders")
      .upsert(record,{onConflict:"user_id"});
    if(result.error)throw result.error;

    s.enabled=true;
    reminderSaveLocal();
    reminderSetStatus("✓ Email reminders enabled for "+s.email+".",false);
  }catch(e){
    reminderSetStatus("Could not save reminder settings: "+(e.message||e),true);
  }finally{
    state.reminderBusy=false;
    render();
  }
}
async function disableReminderSettings(){
  const s=reminderLoadLocal();
  s.enabled=false;
  reminderSaveLocal();

  if(!reminderBackendConfigured()){
    reminderSetStatus("Reminders disabled on this device.",false);
    render();
    return;
  }

  state.reminderBusy=true;
  render();
  try{
    const client=reminderGetClient();
    const user=await reminderEnsureUser();
    const result=await client
      .from("reminders")
      .update({enabled:false,updated_at:new Date().toISOString()})
      .eq("user_id",user.id);
    if(result.error)throw result.error;
    reminderSetStatus("Email reminders disabled.",false);
  }catch(e){
    reminderSetStatus("Could not disable reminders: "+(e.message||e),true);
  }finally{
    state.reminderBusy=false;
    render();
  }
}
async function requestTestReminder(){
  const error=reminderValidate();
  if(error){
    reminderSetStatus(error,true);
    render();
    return;
  }
  if(!reminderBackendConfigured()){
    reminderSetStatus("Connect Supabase first. A test email cannot be sent from a static browser page alone.",true);
    render();
    return;
  }

  // Save first so GitHub Actions always sees the latest destination/settings.
  state.reminderBusy=true;
  reminderSetStatus("Preparing test reminder...",false);
  render();
  try{
    const s=reminderLoadLocal();
    const client=reminderGetClient();
    const user=await reminderEnsureUser();
    const now=new Date().toISOString();
    const record={
      user_id:user.id,
      email:String(s.email||"").trim(),
      profile_name:(state.profile&&state.profile.name)||"",
      reminder_time:s.reminder_time,
      timezone:s.timezone||REMINDER_DEFAULTS.timezone,
      frequency:s.frequency,
      custom_days:s.custom_days,
      reminder_types:s.reminder_types,
      enabled:true,
      consent:true,
      test_requested_at:now,
      updated_at:now
    };
    const result=await client.from("reminders").upsert(record,{onConflict:"user_id"});
    if(result.error)throw result.error;
    s.enabled=true;
    reminderSaveLocal();
    reminderSetStatus("✓ Test requested. GitHub Actions will send it on the next scheduler run (normally within a few minutes). You can also run the workflow manually in GitHub Actions.",false);
  }catch(e){
    reminderSetStatus("Could not request a test email: "+(e.message||e),true);
  }finally{
    state.reminderBusy=false;
    render();
  }
}
function renderReminderTab(p){
  const s=reminderLoadLocal();
  if(!state.reminderLoaded&&!state.reminderLoading){
    setTimeout(reminderLoadRemote,0);
  }
  const configured=reminderBackendConfigured();
  const days=[
    [1,"Mon"],[2,"Tue"],[3,"Wed"],[4,"Thu"],[5,"Fri"],[6,"Sat"],[7,"Sun"]
  ];
  const typeLabels={
    daily_plan:["🥗","Daily plan","Check your planned meals"],
    hydration:["💧","Hydration","Remember to keep up with fluids"],
    sports:["🏃","Sports","Training/recovery reminder"],
    weekly_report:["📊","Weekly report","Weekly NutriAI check-in"]
  };
  const busy=state.reminderBusy?"disabled":"";
  const statusClass=state.reminderError?"reminder-status error":"reminder-status success";

  return `
  <section class="reminder-page">
    <div class="reminder-hero">
      <div class="reminder-hero-icon">🔔</div>
      <div>
        <h2>NutriAI Email Reminders</h2>
        <p>Choose the inbox and schedule where you want NutriAI wellness reminders.</p>
      </div>
      <div class="backend-badge ${configured?"connected":"setup"}">${configured?"● Connected":"⚙ Setup required"}</div>
    </div>

    <div class="reminder-grid">
      <section class="reminder-card">
        <h3>📧 Delivery</h3>
        <label class="reminder-field">Email address
          <input type="email" value="${escapeNutriText(s.email||"")}" placeholder="yourname@gmail.com"
            oninput="reminderField('email',this.value)">
        </label>

        <div class="reminder-two">
          <label class="reminder-field">Reminder time
            <input type="time" value="${escapeNutriText(s.reminder_time||"18:00")}"
              onchange="reminderField('reminder_time',this.value)">
          </label>
          <label class="reminder-field">Frequency
            <select onchange="reminderField('frequency',this.value);render()">
              <option value="daily" ${s.frequency==="daily"?"selected":""}>Daily</option>
              <option value="weekdays" ${s.frequency==="weekdays"?"selected":""}>Weekdays</option>
              <option value="custom" ${s.frequency==="custom"?"selected":""}>Custom days</option>
            </select>
          </label>
        </div>

        ${s.frequency==="custom"?`
        <div class="reminder-field">
          <span>Custom days</span>
          <div class="reminder-days">
            ${days.map(d=>`<button type="button" class="${(s.custom_days||[]).includes(d[0])?"active":""}" onclick="reminderToggleDay(${d[0]})">${d[1]}</button>`).join("")}
          </div>
        </div>`:""}

        <div class="timezone-row">
          <span>🌍 Detected timezone</span>
          <b>${escapeNutriText(s.timezone||REMINDER_DEFAULTS.timezone)}</b>
        </div>
      </section>

      <section class="reminder-card">
        <h3>What should NutriAI remind you about?</h3>
        <div class="reminder-types">
          ${Object.keys(typeLabels).map(key=>{
            const x=typeLabels[key];
            return `<button type="button" class="reminder-type ${(s.reminder_types||{})[key]?"active":""}" onclick="reminderToggleType('${key}')">
              <span class="reminder-type-icon">${x[0]}</span>
              <span><b>${x[1]}</b><small>${x[2]}</small></span>
              <span class="reminder-check">${(s.reminder_types||{})[key]?"✓":""}</span>
            </button>`;
          }).join("")}
        </div>
      </section>
    </div>

    <section class="reminder-card reminder-consent-card">
      <label class="consent-row">
        <input type="checkbox" ${s.consent?"checked":""} onchange="reminderField('consent',this.checked)">
        <span>I agree to receive the NutriAI reminder emails I configure here. I can disable them at any time.</span>
      </label>
    </section>

    ${state.reminderStatus||state.reminderError?`<div class="${statusClass}">${escapeNutriText(state.reminderError||state.reminderStatus)}</div>`:""}

    <div class="reminder-actions">
      <button class="primary" ${busy} onclick="saveReminderSettings()">${state.reminderBusy?"Saving...":"🔔 Enable / Save Reminders"}</button>
      <button class="secondary" ${busy} onclick="requestTestReminder()">✉ Send Test Reminder</button>
      <button class="secondary danger-soft" ${busy} onclick="disableReminderSettings()">Disable</button>
    </div>

    <div class="reminder-info">
      <b>How this works</b>
      <span>NutriAI stores your reminder settings in your Supabase database under a private anonymous-user ID. GitHub Actions checks due reminders and sends email using the sender account stored in GitHub Secrets.</span>
      <span>The browser never receives your Gmail App Password or Supabase secret key.</span>
    </div>

    ${!configured?`
    <div class="reminder-setup-callout">
      <b>One-time backend setup needed</b>
      <span>This folder already contains the database SQL, GitHub workflow and email script. Follow <code>GITHUB_EMAIL_SETUP.md</code>, then add your Supabase URL and publishable key to <code>js/config/supabaseConfig.js</code>.</span>
    </div>`:""}
  </section>`;
}
