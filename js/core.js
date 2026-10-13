const state={step:1,activity:"Very Active",diet:"Vegetarian",goal:"Weight Loss",conditions:[],tab:"Diet Plan",profile:null,cookingTime:"10to20",cookingSkill:"Intermediate",mealVariant:0,regenerating:false,weekDay:0,weekVariant:0,weekRegenerating:false,healthCondition:"",defAnswers:Array(10).fill(null),recipeText:"",scanData:null,scanAnalyzed:false,groceryChecked:{},groceryVariant:0,progressOpen:false,progressMetric:"wellness",progressLogs:[],ingredients:[],ingredientDraft:"",ingredientMeals:null,restaurantChoice:"",restaurantType:"",restaurantText:"",restaurantGenerated:false,festival:"",ecoA:"",ecoB:"",ecoResult:null,fitnessVariant:0,fitnessRegenerating:false,compareA:"",compareB:"",compareResult:null,lang:"en",familyMembers:[],coachOpen:true,coachMessages:[],coachMealIndex:0,coachLastTopic:"",cravingChoice:"Sweet",cravingVariant:0,cravingSelected:"",cravingAdded:"",lunchboxFor:"School",lunchboxTime:"10",lunchboxPref:"Mess-free",lunchboxVariant:0,lunchboxGenerated:false,lunchboxPacked:"",sportType:"Cricket",sportIntensity:"Moderate",sportDuration:"60",sportTiming:"Afternoon",sportsGenerated:false,travelType:"Road Trip",travelDuration:"4–8 hours",travelTime:"Morning",travelFoodAccess:"Carrying food from home",travelPriority:"Mess Free",travelVariant:0,travelGenerated:false,reminderSettings:null,reminderLoaded:false,reminderLoading:false,reminderBusy:false,reminderStatus:"",reminderError:""};
const conds=["Diabetes","Hypertension / High BP","Thyroid","PCOS/PCOD","High Cholesterol","Anemia","Acidity/GERD","Asthma","Arthritis","Kidney Issues","Liver Issues","None"];
const tabs=["Diet Plan","Weekly","Health","Tools","Grocery","Family","Progress","Ingredients","Restaurant","Festival","Eco","Fitness","Compare","Cravings","Lunchbox","Sports","Travel","Reminders"];

// Base44-style outline icons for the dashboard tabs.
const TAB_ICONS={
  "Diet Plan":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v8M4 2v5a3 3 0 0 0 6 0V2M7 10v12M15 2v20M15 2c3 1 5 4 5 7v3h-5"/></svg>`,
  "Weekly":`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  "Health":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v5a6 6 0 0 0 12 0V3"/><path d="M6 3H4M18 3h2"/><path d="M12 14v2a5 5 0 0 0 5 5h1"/><circle cx="20" cy="18" r="2"/></svg>`,
  "Tools":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/></svg>`,
  "Grocery":`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/></svg>`,
  "Family":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  "Progress":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-8 4 16 2-8h6"/></svg>`,
  "Ingredients":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 13h12l-1 8H7l-1-8ZM7 13a5 5 0 0 1 10 0M9 6a3 3 0 0 1 6 0"/><path d="M8 17h8"/></svg>`,
  "Restaurant":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v8M4 2v5a3 3 0 0 0 6 0V2M7 10v12M17 2v20M14 2c0 4 1 7 3 8"/></svg>`,
  "Festival":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 5-13 8 8-13 5Z"/><path d="M13 5 15 3M17 9l4-1M15 13l3 3M8 3l1-2M20 4l2-1"/></svg>`,
  "Eco":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9 6c5-3 10-2 12-2 0 2 1 7-2 12-2 3-5 5-8 4Z"/><path d="M6 21c2-6 6-10 12-13"/></svg>`,
  "Fitness":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>`,
  "Compare":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M5 7h14M7 7l-4 7h8L7 7ZM17 7l-4 7h8l-4-7Z"/><path d="M5 21h14"/></svg>`,
  "Cravings":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 7.5 4 4M16.5 16.5 20 20"/><path d="M8.5 5.5a4.2 4.2 0 0 1 6 0l4 4a4.2 4.2 0 0 1-6 6l-1.2-1.2"/><path d="M15.5 18.5a4.2 4.2 0 0 1-6 0l-4-4a4.2 4.2 0 0 1 6-6l1.2 1.2"/></svg>`,
  "Lunchbox":`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M8 12v3M16 12v3"/></svg>`,
  "Sports":`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="5" r="2"/><path d="m9 8 3 3 3-1 2 2-4 2-2-2-2 4-4 3M10 9 7 12l-3-1"/></svg>`,
  "Travel":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M11 13 22 2"/></svg>`,
  "Reminders":`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4M12 2v1"/></svg>`
};
function tabIcon(name){return TAB_ICONS[name]||"";}
const $=x=>document.getElementById(x);

// NutriAI safe storage: the app keeps working even when a browser/preview blocks localStorage.
const safeStorage={
  getItem:function(key){try{return window.localStorage.getItem(key)}catch(e){return null}},
  setItem:function(key,value){try{window.localStorage.setItem(key,value);return true}catch(e){return false}},
  removeItem:function(key){try{window.localStorage.removeItem(key);return true}catch(e){return false}}
};
function show(x){
  ["landing","onboard","dashboard"].forEach(i=>$(i).classList.toggle("hidden",i!==x));
  $("topBtn").textContent=x==="dashboard"?"New Profile":x==="onboard"?"← Back":"Get Started →";
  $("topBtn").onclick=x==="dashboard"?()=>{if(confirm("Start a new profile? This will reset the saved profile.")){safeStorage.removeItem("nutriProfile");location.reload()}}:x==="onboard"?()=>show("landing"):start;
  const cw=$("coachWidget");
  if(cw){
    cw.classList.toggle("hidden",x!=="dashboard");
    if(x==="dashboard"){coachInit();coachRender()}
  }
  scrollTo(0,0)
}
function goLandingSection(id,event){
  if(event)event.preventDefault();
  show("landing");
  setTimeout(function(){
    const el=document.getElementById(id);
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
  },30);
}