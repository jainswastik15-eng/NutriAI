function calc(p){
  const age=Number(p.age), height=Number(p.height), weight=Number(p.weight);
  const bmi=engineCalculateBMI(weight,height);
  const bmr=engineCalculateBMR(weight,height,age,p.gender);
  const activityMap={"Sedentary":1.2,"Lightly Active":1.375,"Moderately Active":1.55,"Very Active":1.725};
  const isMinor=age<18;

  const calories=isMinor
    ? Math.round(bmr*(activityMap[p.activity]||1.2))
    : engineCalculateDailyCalories(bmr,p.activity,p.goal);

  const water=engineCalculateWaterIntake(weight,p.activity);
  const macros=engineCalculateMacros(calories,isMinor?"General Wellness":p.goal);

  const engineP={
    age:age,
    gender:p.gender,
    height_cm:height,
    weight_kg:weight,
    activity_level:p.activity,
    dietary_preference:p.diet,
    health_goal:p.goal,
    existing_conditions:(p.conditions||[]).filter(function(x){return x&&x!=="None"}),
    bmi:bmi,
    bmi_category:isMinor?"Age-specific interpretation required":engineGetBMICategory(bmi)
  };

  let score;
  if(isMinor){
    score=75;
    if(p.activity==="Very Active")score+=10;
    else if(p.activity==="Moderately Active")score+=7;
    else if(p.activity==="Lightly Active")score+=4;
    if(engineP.existing_conditions.length)score-=Math.min(10,engineP.existing_conditions.length*2);
    score=Math.max(50,Math.min(95,score));
  }else{
    score=engineCalculateWellnessScore(engineP);
  }

  return {
    bmi:bmi.toFixed(1),
    bmiCategory:isMinor?"Age-specific":engineGetBMICategory(bmi),
    cal:calories,
    pro:macros.protein,
    wat:water.toFixed(1),
    score:score,
    macros:macros,
    bmr:Math.round(bmr),
    engine:true,
    minorGuard:isMinor
  };
}
function build(){let p={name:$("name").value,age:$("age").value,gender:$("gender").value,height:$("height").value,weight:$("weight").value,activity:state.activity,diet:state.diet,goal:state.goal,budget:$("budget").value,region:$("region").value,country:$("region").value==="International"?$("country").value:"",conditions:[...state.conditions],allergies:$("allergies").value};p.m=calc(p);state.profile=p;safeStorage.setItem("nutriProfile",JSON.stringify(p));dash();show("dashboard")}
function dash(){let p=state.profile||JSON.parse(safeStorage.getItem("nutriProfile")||"null");if(!p)return;p.m=calc(p);state.profile=p;safeStorage.setItem("nutriProfile",JSON.stringify(p));$("dname").textContent=p.name;$("tag1").textContent=`${p.age} years • ${p.gender}`;$("tag2").textContent=`${p.height}cm • ${p.weight}kg`;$("tag3").textContent=p.diet;$("tag4").textContent=p.goal;$("cal").textContent=p.m.cal+" kcal";$("wat").textContent=p.m.wat+" L";$("pro").textContent=p.m.pro+"g";$("scoreVal").textContent=p.m.score;$("ring").style.setProperty("--score",p.m.score+"%");$("scoreLab").textContent=p.m.score>=80?"⚡ Good":p.m.score>=65?"⚡ Fair":"⚡ Needs Attention";renderTabs();render()}
function renderTabs(){$("tabs").innerHTML=tabs.map(t=>`<button class="tab ${state.tab===t?"active":""}" onclick="setTab('${t}')" title="${t}"><span class="tab-icon">${tabIcon(t)}</span><span class="tab-label">${t}</span></button>`).join("")}
function setTab(t){state.tab=t;renderTabs();render()}
function basic(title,body){return `<section class="content"><div class="head"><span>✨</span><div><h2>${title}</h2><p>NutriAI project demo</p></div></div><div class="space">${body}</div></section>`}
function food(n,d,s){return `<div class="food"><div><strong>${n}</strong><p>${d}</p></div><span class="serve">${s}</span></div>`}
function bmiText(b){return b<18.5?"Below usual adult range.":b<25?"Within usual adult range.":b<30?"Above usual adult range.":"High range."}

function setWeekDay(i){state.weekDay=(i+7)%7;render()}
function shiftWeekDay(d){state.weekDay=(state.weekDay+d+7)%7;render()}
function regenerateWeek(btn){
  if(state.weekRegenerating)return;
  state.weekRegenerating=true;
  if(btn){btn.disabled=true;btn.textContent="⏳ Generating...";}
  setTimeout(()=>{state.weekVariant=(state.weekVariant+1)%3;state.weekRegenerating=false;render()},550);
}
