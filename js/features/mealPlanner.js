function base44MealPools(p){
  const profileForBase44 = {
    dietary_preference: p.diet,
    health_goal: p.goal,
    region: p.region,
    existing_conditions: p.conditions || [],
    budget_preference: p.budget
  };

  try {
    return getBase44Meals(profileForBase44);
  } catch (err) {
    console.warn("Base44 meal database error; using V13 fallback.", err);
    return null;
  }
}

function pickBase44Meal(list, index){
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[((index % list.length) + list.length) % list.length];
}

function base44MealAsV13(label, meal){
  if (!meal) return null;
  return [
    label,
    meal.name,
    String(meal.calories),
    meal.protein,
    meal.carbs,
    meal.fat,
    meal.portion,
    meal.personalizationNote || meal.reason || "",
    Number(meal.diseaseFitScore || 0),
    Number(meal.mealScore || 70),
    Number(meal.minutes || 20),
    meal.skillLevel || mealSkillLevel(meal)
  ];
}

function weekData(p){
  const db = getPersonalizedMealPools(p);

  // If anything is wrong with the embedded database, keep the original V13-style fallback.
  if (!db) {
    return [
      ["Vegetable Oats Upma","Brown rice + dal palak + cucumber salad","Paneer stir-fry with capsicum + broccoli","Roasted makhana"],
      ["Poha + curd + guava","2 rotis + rajma + salad","Palak paneer + 1 roti","Roasted chana"],
      ["Besan chilla + curd","Millet khichdi + raita","Tofu vegetable curry","Fruit + nuts"],
      ["Idli + sambar","2 rotis + dal + seasonal sabzi","Paneer tikka salad","Buttermilk"],
      ["Vegetable oats + milk","Chole + brown rice + salad","Moong dal chilla + curd","Makhana"],
      ["Dalia + fruit","2 rotis + mixed dal + veg","Vegetable khichdi + raita","Guava + almonds"],
      ["Paneer stuffed chilla","Rajma + 2 rotis + salad","Soup + paneer/tofu wrap","Fruit + curd"]
    ];
  }

  const shift = state.weekVariant || 0;
  return Array.from({length:7}, (_, i) => {
    const breakfast = pickBase44Meal(db.breakfasts, i + shift);
    const lunch = pickBase44Meal(db.lunches, i + shift + 1);
    const dinner = pickBase44Meal(db.dinners, i + shift + 2);
    const snack = pickBase44Meal(db.snacks, i + shift + 3);

    return [
      breakfast?.name || "Balanced breakfast",
      lunch?.name || "Balanced lunch",
      dinner?.name || "Balanced dinner",
      snack?.name || "Balanced snack"
    ];
  });
}
function weeklyDayMeals(p,dayIndex){
  const db=getPersonalizedMealPools(p);
  if(!db)return null;
  const shift=state.weekVariant||0;
  const breakfast=pickBase44Meal(db.breakfasts,dayIndex+shift);
  const lunch=pickBase44Meal(db.lunches,dayIndex+shift+1);
  const dinner=pickBase44Meal(db.dinners,dayIndex+shift+2);
  const snack=pickBase44Meal(db.snacks,dayIndex+shift+3);
  return {breakfast,lunch,dinner,snack};
}
function weeklyMealLine(label,item,fallbackCalories){
  if(!item)return `<b>${label}:</b> Balanced ${label.toLowerCase()} (${fallbackCalories} kcal).`;
  const kcal=Number(item.calories||fallbackCalories);
  const reason=String(item.personalizationNote||item.reason||"Selected to fit your combined profile.").trim();
  return `<b>${label}:</b> ${item.name} (${kcal} kcal). <span class="weekly-meal-why">${reason}</span>`;
}
function weeklyExercisePlan(p,dayIndex){
  const cond=(p.conditions||[]).map(x=>String(x).toLowerCase()).join(" ");
  const teen=Number(p.age)<18;
  const goal=p.goal||"General Wellness";
  const lowImpact=/arthritis|joint|knee|back pain/.test(cond);
  const bp=/hypertension|high bp|blood pressure/.test(cond);
  const asthma=/asthma/.test(cond);
  const baseLow=[
    ["Swimming","30 min"],["Cycling (low resistance)","25 min"],["Chair yoga","20 min"],["Walking","40 min"]
  ];
  const weightLoss=[
    [["Brisk walking","35 min"],["Bodyweight circuit","20 min"],["Mobility & stretching","12 min"],["Easy cycling","25 min"]],
    [["Cycling","30 min"],["Low-impact intervals","18 min"],["Yoga flow","20 min"],["Walking","25 min"]],
    [["Brisk walk","40 min"],["Squat-to-chair circuit","18 min"],["Core stability","12 min"],["Stretching","10 min"]],
    [["Dance / aerobic movement","30 min"],["Walking","25 min"],["Mobility","12 min"],["Breathing practice","8 min"]],
    [["Cycling","35 min"],["Bodyweight strength","20 min"],["Walking","20 min"],["Stretching","10 min"]],
    [["Long easy walk","45 min"],["Yoga","20 min"],["Light bodyweight circuit","15 min"],["Mobility","10 min"]],
    [["Recovery walk","30 min"],["Gentle yoga","25 min"],["Mobility","12 min"],["Relaxed breathing","8 min"]]
  ];
  const muscle=[
    [["Squat progression","3 × 10"],["Push-up progression","3 × 8"],["Glute bridge","3 × 12"],["Easy walk","20 min"]],
    [["Split squat / supported lunge","3 × 8"],["Band or backpack row","3 × 10"],["Core stability","3 rounds"],["Mobility","12 min"]],
    [["Recovery walk","25 min"],["Yoga / mobility","20 min"],["Light core","10 min"],["Stretching","10 min"]],
    [["Squat progression","3 × 12"],["Incline push-up","3 × 10"],["Hip hinge practice","3 × 10"],["Walking","15 min"]],
    [["Step-ups","3 × 10"],["Row variation","3 × 10"],["Glute bridge","3 × 15"],["Core stability","10 min"]],
    [["Full-body bodyweight circuit","25 min"],["Walking","20 min"],["Mobility","12 min"],["Stretching","10 min"]],
    [["Recovery walk","30 min"],["Gentle yoga","20 min"],["Mobility","15 min"],["Breathing","8 min"]]
  ];
  const wellness=[
    [["Walking","30 min"],["Mobility","12 min"],["Bodyweight strength","15 min"],["Breathing","8 min"]],
    [["Cycling","25 min"],["Yoga","20 min"],["Core stability","10 min"],["Walking","15 min"]],
    [["Brisk walking","30 min"],["Strength circuit","18 min"],["Stretching","10 min"],["Breathing","8 min"]],
    [["Dance / active recreation","30 min"],["Mobility","12 min"],["Walking","20 min"],["Yoga","15 min"]],
    [["Cycling","30 min"],["Bodyweight strength","20 min"],["Core stability","10 min"],["Stretching","10 min"]],
    [["Outdoor activity","40 min"],["Yoga","20 min"],["Mobility","10 min"],["Breathing","8 min"]],
    [["Recovery walk","30 min"],["Gentle yoga","20 min"],["Stretching","12 min"],["Relaxed breathing","8 min"]]
  ];
  let exercises;
  if(lowImpact)exercises=baseLow;
  else if(goal==="Muscle Building"||goal==="Weight Gain")exercises=muscle[dayIndex%7];
  else if(goal==="Weight Loss")exercises=weightLoss[dayIndex%7];
  else exercises=wellness[dayIndex%7];
  if(teen && !lowImpact){
    exercises=exercises.map(([name,dur])=>[name.replace(/Bodyweight circuit|Strength circuit/g,"Age-appropriate bodyweight circuit"),dur]);
  }
  const duration=lowImpact?"30–45 minutes daily":goal==="Muscle Building"?"25–40 minutes":"30–45 minutes daily";
  const frequency=goal==="Muscle Building"?"3–5 days a week":"5–6 days a week";
  let note=goal==="Weight Loss"?"Cardio and regular movement can support energy balance when paired with adequate nutrition.":goal==="Muscle Building"?"Progress strength gradually and allow recovery between harder sessions.":"A mix of aerobic movement, strength, mobility and recovery supports general fitness.";
  if(lowImpact)note="Low-impact movement is prioritized because a joint/arthritis concern is selected. Stop if pain worsens and follow professional advice.";
  if(bp)note+=" Keep intensity moderate unless your clinician has cleared harder exercise.";
  if(asthma)note+=" Use a gradual warm-up and follow your prescribed asthma action plan.";
  return {exercises,duration,frequency,note};
}
function weeklyExercises(p){
  return weeklyExercisePlan(p,state.weekDay||0).exercises.map(x=>`${x[0]} — ${x[1]}`);
}

function healthGuidanceMap(){
  return {
    "Diabetes":["Choose higher-fiber carbs such as oats, ragi and whole grains","Pair carbohydrate foods with protein or vegetables","Limit sugary drinks and highly refined snacks","Follow medical advice for blood glucose and medication management"],
    "Hypertension / High BP":["Prefer fresh foods and reduce heavily salted packaged foods","Use herbs, spices and lemon for flavor","Include fruits, vegetables and pulses regularly","Follow clinician advice if you have sodium or fluid restrictions"],
    "High Cholesterol":["Prioritize oats, legumes, vegetables, nuts and seeds","Use unsaturated oils in moderation","Limit deep-fried foods and trans fats","Discuss abnormal lipid results with a qualified clinician"],
    "Anemia":["Include iron-rich foods such as lentils, greens and sesame","Pair plant iron with vitamin-C-rich foods","Avoid tea/coffee immediately with iron-rich meals","Persistent anemia needs testing and professional treatment"],
    "Thyroid":["Eat a balanced diet with adequate protein and micronutrients","Take prescribed thyroid medication exactly as directed","Avoid extreme elimination diets without medical guidance","Ask your clinician about iodine if you have a diagnosed thyroid disorder"],
    "General Wellness":["Build balanced plates with vegetables, protein and whole grains","Drink water regularly","Maintain consistent meals and sleep","Limit highly processed foods and sugary drinks"]
  };
}
function setHealthCondition(v){state.healthCondition=v;render()}
function deficiencyRisks(p){
  const profile=nutritionEngineProfile(p);
  const risks=engineGetDeficiencyRisks(profile);
  return risks.slice(0,5).map(function(r){
    return [r.nutrient,r.risk+" Risk",r.reason,r.foods];
  });
}
function smartSwaps(){
  return engineGetFoodSwaps().map(function(s){
    return [s.unhealthy,s.healthy,s.reason,s.nutrientGain];
  });
}
const deficiencyQuestions=[
  ["How often do you feel tired or fatigued, even after adequate sleep?",["Almost every day","2-3 times a week","Rarely"]],
  ["How many servings of dairy or fortified alternatives do you consume daily?",["None","1 serving","2+ servings"]],
  ["How many servings of fresh fruits do you eat daily?",["None","1 serving","2+ servings"]],
  ["How often do you eat leafy green vegetables (palak, methi, broccoli)?",["Rarely (1-2x/week)","Sometimes (3-4x/week)","Daily"]],
  ["How many protein-rich meals (dal, eggs, chicken, paneer, tofu) do you have daily?",["0-1 serving","2 servings","3+ servings"]],
  ["Do you get regular safe sunlight exposure?",["Rarely or never","Sometimes","Yes, regularly"]],
  ["Do you experience frequent muscle cramps, bone pain, or unexplained weakness?",["Yes, frequently","Occasionally","Rarely or never"]],
  ["Do you notice significant hair fall, brittle nails, or very dry skin?",["Yes, noticeably","Mild issues","No, they're fine"]],
  ["How much water do you drink in a typical day?",["Less than 1.5L","1.5-2L","2L or more"]],
  ["How often do you eat whole grains or millets (oats, ragi, bajra, brown rice)?",["Rarely","Sometimes (3-4x/week)","Daily"]]
];
function setDefAnswer(q,a){state.defAnswers[q]=a;render()}
function deficiencyScore(){
  const a=state.defAnswers;
  const issues={
    "Iron / B12":(a[0]===0?2:a[0]===1?1:0)+(a[4]===0?2:a[4]===1?1:0)+(a[7]===0?1:0),
    "Vitamin D / Calcium":(a[1]===0?2:a[1]===1?1:0)+(a[5]===0?2:a[5]===1?1:0)+(a[6]===0?2:a[6]===1?1:0),
    "Fiber / Micronutrients":(a[2]===0?2:a[2]===1?1:0)+(a[3]===0?2:a[3]===1?1:0)+(a[9]===0?2:a[9]===1?1:0),
    "Hydration":(a[8]===0?2:a[8]===1?1:0)
  };
  return issues;
}
function deficiencyResultHtml(){
  const issues=deficiencyScore();
  return Object.entries(issues).map(([k,s])=>{
    const warn=s>=3;
    const msg=warn
      ?"Your answers suggest this area may deserve attention. This is not a diagnosis; consider improving food variety and discussing persistent symptoms or concerns with a qualified professional."
      :"Your answers do not strongly flag this area, but only testing can confirm a nutrient deficiency.";
    return `<div class="result-box ${warn?"warn":"ok"}"><h3>${warn?"⚠":"✓"} ${k}</h3><p>${msg}</p></div>`;
  }).join("");
}



function bmiInterpretation(p){
  const b=+p.m.bmi;
  if(+p.age<18) return "Age-specific interpretation needed";
  return b<18.5?"Underweight range":b<25?"Normal Weight":b<30?"Overweight range":"High BMI range";
}
function macroValues(p){
  const e=p.m&&p.m.macros?p.m.macros:engineCalculateMacros(Number(p.m.cal),Number(p.age)<18?"General Wellness":p.goal);
  const protein=Number(e.protein);
  const carbs=Number(e.carbs);
  const fat=Number(e.fat);
  const total=protein*4+carbs*4+fat*9 || 1;
  return {
    protein:protein,
    carbs:carbs,
    fat:fat,
    fiber:Number(e.fiber||25),
    pPct:Math.round(protein*4/total*100),
    cPct:Math.round(carbs*4/total*100)
  };
}
function normalizeDiseaseCondition(c){
  const s=String(c||"").toLowerCase();
  if(s.includes("diabet"))return "Diabetes";
  if(s.includes("hypertension")||s.includes("blood pressure")||s.includes("high bp"))return "Hypertension / High BP";
  if(s.includes("cholesterol"))return "High Cholesterol";
  if(s.includes("anemia")||s.includes("anaemia"))return "Anemia";
  if(s.includes("thyroid"))return "Thyroid";
  if(s.includes("pcos")||s.includes("pcod"))return "PCOS/PCOD";
  if(s.includes("gerd")||s.includes("acidity")||s.includes("gastritis")||s.includes("reflux"))return "Acidity/GERD";
  if(s.includes("kidney"))return "Kidney Issues";
  if(s.includes("liver"))return "Liver Issues";
  return c;
}
function diseaseInfo(p){
  const profileMap={
    "Diabetes":{
      title:"Diabetes-Aware Eating Pattern",
      foods:["Oats","Ragi","Moong","Besan","Vegetables","Dal","Nuts"],
      eat:["Prefer higher-fiber carbohydrate choices","Pair carbohydrate foods with protein and vegetables","Keep portions and meal timing consistent","Choose unsweetened drinks more often"],
      avoid:["Limit sugary drinks and sweets","Limit highly refined carbohydrate-heavy meals","Avoid changing diabetes medication based on this app","Use glucose targets given by your healthcare team"]
    },
    "Hypertension / High BP":{
      title:"Blood-Pressure-Aware Eating Pattern",
      foods:["Vegetables","Fruit","Dal","Oats","Beans","Nuts","Curd / alternatives"],
      eat:["Choose fresh, minimally processed foods more often","Use herbs, spices and lemon for flavor","Include vegetables, fruits and pulses regularly","Follow clinician advice if you have a sodium or fluid restriction"],
      avoid:["Limit heavily salted packaged foods","Limit frequent pickles, papad and salty snacks","Do not assume a meal is low-sodium without nutrition data","Follow prescribed blood-pressure treatment"]
    },
    "High Cholesterol":{
      title:"Cholesterol-Aware Fiber-Focused Pattern",
      foods:["Oats","Barley","Dal","Beans","Nuts","Seeds","Vegetables"],
      eat:["Prioritize soluble-fiber-rich foods","Include legumes and vegetables regularly","Choose nuts/seeds in sensible portions","Prefer unsaturated fats where practical"],
      avoid:["Limit frequent deep-fried foods","Limit foods high in trans fat","Do not rely on supplements as treatment","Discuss abnormal lipid results with a clinician"]
    },
    "Anemia":{
      title:"Iron-Supportive Eating Pattern",
      foods:["Lentils","Rajma","Chana","Spinach","Sesame","Amla","Guava"],
      eat:["Include iron-containing foods regularly","Pair plant iron foods with vitamin-C-containing foods","Include adequate protein","Keep meals varied across the week"],
      avoid:["Avoid tea/coffee immediately with iron-rich meals if iron absorption is a concern","Do not self-treat significant anemia with diet alone","Do not start iron supplements without professional advice","Seek testing for persistent symptoms"]
    },
    "Thyroid":{
      title:"Thyroid-Supportive Balanced Eating",
      foods:["Dal","Eggs / alternatives","Curd / alternatives","Nuts","Seeds","Whole grains","Vegetables"],
      eat:["Prioritize regular balanced meals with adequate protein","Include a varied diet rather than extreme restriction","Take prescribed thyroid medicine exactly as directed","Ask your clinician about iodine needs if you have a diagnosed thyroid disorder"],
      avoid:["Avoid extreme elimination diets without medical advice","Do not use iodine supplements unless advised","Do not change medication timing based on this app","Specific thyroid conditions may require different guidance"]
    },
    "PCOS/PCOD":{
      title:"PCOS-Aware High-Fiber, Protein-Supported Pattern",
      foods:["Oats","Ragi","Moong","Besan","Dal","Vegetables","Nuts"],
      eat:["Include protein with meals","Prefer higher-fiber carbohydrates","Build meals around vegetables and minimally processed foods","Keep meal timing reasonably consistent"],
      avoid:["Limit sugary drinks and frequent highly refined snacks","Avoid extreme carbohydrate elimination","Do not use this app as a substitute for clinical PCOS care","Choose sustainable habits rather than crash diets"]
    },
    "Acidity/GERD":{
      title:"Reflux-Aware Gentle Meal Pattern",
      foods:["Oats","Idli","Moong","Dal","Banana","Vegetables","Plain grains"],
      eat:["Prefer smaller balanced meals if large meals worsen symptoms","Keep a personal trigger-food log","Allow time between dinner and lying down","Choose simpler preparations when symptoms are active"],
      avoid:["Limit foods that you personally identify as triggers","Avoid very heavy late-night meals if they worsen symptoms","Do not assume the same trigger foods affect everyone","Persistent reflux symptoms need medical assessment"]
    },
    "Kidney Issues":{
      title:"Kidney Condition — Clinician-Guided Nutrition Needed",
      foods:["Individualized plan required"],
      eat:["Follow the sodium, potassium, protein and fluid targets given by your kidney-care team","Use this app only for general meal organization"],
      avoid:["Do not use generic kidney meal rules","Do not restrict potassium, protein or fluids without clinician guidance","Kidney nutrition changes by diagnosis and lab results"]
    },
    "Liver Issues":{
      title:"Liver Condition — Clinician-Guided Nutrition Needed",
      foods:["Balanced meals","Adequate protein as advised","Vegetables","Whole foods"],
      eat:["Use regular balanced meals and follow your clinician's advice","Avoid alcohol if your healthcare team has advised this"],
      avoid:["Do not use supplements marketed as liver detoxes","Do not make major protein or calorie changes without professional guidance"]
    },
    "General Wellness":{
      title:"Balanced Wellness Plan",
      foods:["Dal","Vegetables","Fruit","Whole grains","Nuts","Seeds","Protein foods"],
      eat:["Build balanced plates","Eat a variety of colorful foods","Include protein at each meal","Drink water regularly"],
      avoid:["Limit highly processed foods","Limit sugary drinks","Avoid extreme diets","Avoid skipping meals regularly"]
    }
  };

  const active=[...new Set((p.conditions||[])
    .filter(x=>x&&x!=="None")
    .map(normalizeDiseaseCondition))];

  if(!active.length)return {...profileMap["General Wellness"],conditions:["General Wellness"]};

  // Kidney/liver conditions require individualized lab-based advice. Do not pretend
  // the local meal database can safely personalize those conditions.
  const specialized=active.find(c=>c==="Kidney Issues"||c==="Liver Issues");
  if(specialized)return {...profileMap[specialized],conditions:active};

  const entries=active.map(c=>profileMap[c]).filter(Boolean);
  if(!entries.length)return {...profileMap["General Wellness"],conditions:active};

  const uniq=(arr)=>[...new Set(arr)];
  return {
    title: active.length===1 ? entries[0].title : `Combined focus: ${active.join(" + ")}`,
    foods: uniq(entries.flatMap(x=>x.foods)).slice(0,10),
    eat: uniq(entries.flatMap(x=>x.eat)).slice(0,7),
    avoid: uniq(entries.flatMap(x=>x.avoid)).slice(0,7),
    conditions: active
  };
}
function diseasePersonalizationText(p){
  const d=diseaseInfo(p);
  const conditions=d.conditions||["General Wellness"];
  if(conditions.includes("Kidney Issues")||conditions.includes("Liver Issues")){
    return "This condition needs clinician-guided nutrition targets; NutriAI is not applying automatic disease meal filtering.";
  }
  if(conditions[0]==="General Wellness"){
    return "Combined ranking uses your region/country, dietary preference, activity level, goal, allergies, budget, cooking time and cooking skill.";
  }
  return `Condition-aware ranking for ${conditions.join(", ")} is combined with region, diet, activity, goal, allergies, budget, cooking time and skill.`;
}
function cookingMeta(){
  const map={
    "lt10":{prep:3,cook:5,total:8,label:"Under 10 min"},
    "10to20":{prep:5,cook:10,total:15,label:"10–20 min"},
    "20to40":{prep:10,cook:20,total:30,label:"20–40 min"},
    "gt40":{prep:15,cook:30,total:45,label:"40+ min"}
  };
  return {...map[state.cookingTime],skill:state.cookingSkill};
}
function setPlanner(kind,value){
  state[kind]=value;
  render();
}
function mealSet(p){
  const db = getPersonalizedMealPools(p);

  if (db) {
    const breakfast = base44MealAsV13("Breakfast", pickBase44Meal(db.breakfasts, mealSlotVariant("Breakfast")));
    const lunch = base44MealAsV13("Lunch", pickBase44Meal(db.lunches, mealSlotVariant("Lunch")));
    const dinner = base44MealAsV13("Dinner", pickBase44Meal(db.dinners, mealSlotVariant("Dinner")));

    return [breakfast, lunch, dinner].filter(Boolean);
  }

  // No unsafe generic fallback: allergy and diet exclusions must remain active.
  if(db) return [];
  // Original V13 fallback only if the curated catalog is unavailable.
  if(p.diet==="Non-Vegetarian"){
    return [
      ["Breakfast","Egg & vegetable poha","330",22,40,9,"2 eggs + 1 bowl poha"],
      ["Lunch","Chicken dal roti bowl","430",35,42,12,"100g chicken + dal + 2 rotis"],
      ["Dinner","Grilled fish with vegetables","350",32,24,14,"120g fish + vegetables"]
    ];
  }
  if(p.diet==="Vegan"){
    return [
      ["Breakfast","Sprouted Moong Chilla","310",18,35,9,"2 medium chillas"],
      ["Lunch","Tofu Broccoli Stir-fry","360",25,32,15,"200g tofu + vegetables"],
      ["Dinner","Dal Vegetable Curry","330",20,44,8,"1 bowl dal + vegetables"]
    ];
  }
  return [
    ["Breakfast","Sprouted Moong Dal Chilla","310",18,35,9,"2 medium size chillas"],
    ["Lunch","Paneer and Broccoli Stir-fry with Curd","360",28,12,20,"150g paneer + 1 cup veggies"],
    ["Dinner","Tofu Vegetable Curry (No Rice)","320",25,15,16,"200g tofu + 1 cup veggies"]
  ];
}
function mealSlotVariant(label){
  const key=mealSlotKey(label);
  state.mealSlotVariants=state.mealSlotVariants||{};
  const own=state.mealSlotVariants[key];
  return Number.isFinite(own)?own:Number(state.mealVariant||0);
}
function regenerateMeals(btn){
  if(state.regenerating) return;
  state.regenerating=true;
  if(btn){
    btn.disabled=true;
    btn.textContent="⏳ Generating...";
  }
  setTimeout(()=>{
    state.mealVariant=(state.mealVariant+1)%12;
    state.mealSlotVariants={};
    state.regenerating=false;
    render();
  },350);
}
function mealSlotKey(label){
  const s=String(label||"").toLowerCase();
  if(s.includes("breakfast"))return "breakfasts";
  if(s.includes("lunch"))return "lunches";
  if(s.includes("dinner"))return "dinners";
  return "breakfasts";
}
function regenerateSingleMeal(label){
  const key=mealSlotKey(label);
  const pools=getPersonalizedMealPools(state.profile)||{};
  const list=pools[key]||[];
  if(!list.length)return;
  state.mealSlotVariants=state.mealSlotVariants||{};
  state.mealSlotVariants[key]=(mealSlotVariant(label)+1)%list.length;
  render();
}
function mealAlternativesFor(label, primaryName, p){
  const pools=getPersonalizedMealPools(p)||{};
  const key=mealSlotKey(label);
  const list=pools[key]||[];
  if(!list.length)return [];
  const base=mealSlotVariant(label);
  const picked=[];
  const seen=new Set([primaryName]);
  for(let offset=1;offset<=list.length && picked.length<2;offset++){
    const item=list[(base+offset)%list.length];
    if(item && !seen.has(item.name)){
      seen.add(item.name);
      picked.push(item);
    }
  }
  return picked;
}
function mealAlternativeCard(item,index){
  const skill=item.skillLevel||mealSkillLevel(item);
  const skillIcon=skill==="Beginner"?"🌱":skill==="Advanced"?"🏆":"👨‍🍳";
  const note=(item.personalizationNote||item.reason||"Good alternative based on your profile.").trim();
  const portion=item.portion||"1 serving";
  const calories=item.calories||0;
  const minutes=item.minutes||15;
  const fiber=(item.fiber??0);
  const vote=mealFeedbackFor(item.name);
  const safeName=encodeURIComponent(item.name);
  return `<div class="alt-card">
    <div class="alt-card-label"><span class="alt-label-icon"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.1 9a8 8 0 0 1 13.5-2L20 12M4 12l1.4 5a8 8 0 0 0 13.5-2"/></svg></span><span>Alternative ${index+1}</span></div>
    <div class="alt-card-name">${item.name}</div>
    <div class="alt-card-meta">📏 ${portion} • ${calories} kcal • ⏰ ${minutes} mins • ${skillIcon} ${skill}</div>
    <div class="alt-card-macros"><span class="alt-macro p">P: ${item.protein}g</span><span class="alt-macro c">C: ${item.carbs}g</span><span class="alt-macro f">F: ${item.fat}g</span><span class="alt-macro fi">🌾 ${fiber}g</span></div>
    <p class="alt-card-note">${note}</p>
    <div class="alt-feedback">
      <button class="vote ${vote===1?"active-like":""}" onclick="rateMeal(decodeURIComponent('${safeName}'),1)" aria-label="Like alternative"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H3V10h4Z"/><path d="M7 19h10.2a2 2 0 0 0 1.9-1.4l1.6-5A2 2 0 0 0 18.8 10H14l.7-3.5A3 3 0 0 0 11.8 3L7 10Z"/></svg><span>Like</span></button>
      <button class="vote ${vote===-1?"active-dislike":""}" onclick="rateMeal(decodeURIComponent('${safeName}'),-1)" aria-label="Dislike alternative"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14V3H3v11h4Z"/><path d="M7 5h10.2a2 2 0 0 1 1.9 1.4l1.6 5a2 2 0 0 1-1.9 2.6H14l.7 3.5a3 3 0 0 1-2.9 3.5L7 14Z"/></svg><span>Dislike</span></button>
    </div>
  </div>`;
}
function mealCardDetailed(m){
  const cm=cookingMeta();
  const actualTime=Number(m[10]||cm.total);
  const actualSkill=m[11]||cm.skill;
  const skillIcon=actualSkill==="Beginner"?"🌱":actualSkill==="Advanced"?"🏆":"👨‍🍳";
  const dtext=diseasePersonalizationText(state.profile);
  const mealReason=m[7]
    ? `${m[7].charAt(0).toUpperCase()+m[7].slice(1)}.`
    : "Balanced protein, fiber and micronutrients selected from your profile.";
  const fit=Number(m[8]||0);
  const mealScore=Math.max(0,Math.min(100,Number(m[9]||70)));
  const vote=mealFeedbackFor(m[1]);
  const safeName=encodeURIComponent(m[1]);
  const safeLabel=String(m[0]).replaceAll("'","\\'");
  const fitLabel=fit>=10?"Strong condition match":fit>=5?"Good condition match":fit>0?"Condition-aware match":"Profile match";
  const alternatives=mealAlternativesFor(m[0],m[1],state.profile);
  return `<div class="meal"><div class="meal-head">${m[0]} <span style="float:right;font-size:10px;font-weight:600;opacity:.8">${fitLabel}</span></div><div class="meal-body"><span class="rec">⭐ Meal match: ${mealScore}/100</span><span class="kcal">🔥 ${m[2]}<small style="display:block;color:#9aa3b1;font-weight:400">kcal</small></span><div class="meal-name">${m[1]}</div><div style="color:#28875f;font-size:12px">📏 ${m[6]}</div><div class="meta"><span class="badge">🍳 Estimated cooking: ${actualTime} mins</span><span class="badge">⏰ ${mealFitsTime({minutes:actualTime},state.cookingTime)?"Matches selected time":"Closest time match"}</span><span class="badge">${skillIcon} ${actualSkill}</span></div><div class="meta"><span class="badge macro-p">💪 P: ${m[3]}g</span><span class="badge macro-c">⚪ C: ${m[4]}g</span><span class="badge macro-f">🥑 F: ${m[5]}g</span></div><div class="meal-feedback"><button class="vote ${vote===1?"active-like":""}" onclick="rateMeal(decodeURIComponent('${safeName}'),1)" aria-label="Like meal"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H3V10h4Z"/><path d="M7 19h10.2a2 2 0 0 0 1.9-1.4l1.6-5A2 2 0 0 0 18.8 10H14l.7-3.5A3 3 0 0 0 11.8 3L7 10Z"/></svg><span>Like</span></button><button class="vote ${vote===-1?"active-dislike":""}" onclick="rateMeal(decodeURIComponent('${safeName}'),-1)" aria-label="Dislike meal"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14V3H3v11h4Z"/><path d="M7 5h10.2a2 2 0 0 1 1.9 1.4l1.6 5a2 2 0 0 1-1.9 2.6H14l.7 3.5a3 3 0 0 1-2.9 3.5L7 14Z"/></svg><span>Dislike</span></button></div><button class="single-regen" onclick="regenerateSingleMeal('${safeLabel}')"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.1 9a8 8 0 0 1 13.5-2L20 12M4 12l1.4 5a8 8 0 0 0 13.5-2"/></svg><span>Regenerate Meal</span></button><div class="why"><b>Why for you:</b> ${mealReason}<br><span style="color:#6f7a8c">${dtext}</span></div>${alternatives.length?`<div class="meal-alternatives">${alternatives.map((item,index)=>mealAlternativeCard(item,index)).join("")}</div>`:""}</div></div>`;
}

