const SPORTS_FOCUS={
  "Cricket":"steady energy, hydration and recovery between long periods of play",
  "Football":"carbohydrate availability, hydration and post-training recovery",
  "Running":"comfortable pre-run fuel, hydration and recovery",
  "Cycling":"steady carbohydrate intake and hydration",
  "Swimming":"pre-session energy and protein-rich recovery",
  "Basketball":"quick energy, hydration and muscle recovery",
  "Badminton":"light pre-session fuel, hydration and recovery",
  "Gym / Strength Training":"protein distribution, balanced carbohydrates and recovery"
};
function setSportsOption(kind,val){state[kind]=val;state.sportsGenerated=false;render()}
function generateSportsMode(){state.sportsGenerated=true;render()}
function sportsConditionNote(p){
  const c=(p.conditions||[]).map(x=>String(x).toLowerCase());
  if(c.some(x=>x.includes("heart")||x.includes("hypertension")||x.includes("blood pressure")))return "Keep intensity clinician-approved if you have cardiovascular or blood-pressure concerns.";
  if(c.some(x=>x.includes("arthritis")||x.includes("joint")))return "Use joint-friendly training and stop if movement causes significant pain.";
  if(c.some(x=>x.includes("asthma")))return "Keep prescribed rescue medication and your clinician's asthma plan available during exercise.";
  if(c.some(x=>x.includes("diabet")))return "Follow your diabetes care plan for glucose monitoring, medication and carbohydrate timing around exercise.";
  if(c.some(x=>x.includes("kidney")||x.includes("liver")))return "Exercise and nutrition targets should follow your treating clinician's advice.";
  return "Increase training gradually and stop for chest pain, faintness or severe breathlessness.";
}
const SPORTS_FOODS={
 "Cricket":["Banana + roasted chana","Chickpea wholegrain wrap"],
 "Football":["Banana + wholegrain toast","Rice + lentil recovery bowl"],
 "Running":["Plain banana + water","Oatmeal + fruit recovery bowl"],
 "Cycling":["Dates + banana + water","Potato + chickpea recovery box"],
 "Swimming":["Toast + fruit","Tofu rice and vegetable bowl"],
 "Basketball":["Fruit + wholegrain crackers","Black bean rice bowl"],
 "Badminton":["Apple + toast","Moong dal and roti bowl"],
 "Gym / Strength Training":["Roasted chickpeas + fruit","Tofu quinoa protein bowl"]
};
const SPORTS_FOOD_INGREDIENTS={
 "Banana + roasted chana":"banana,roasted chickpeas","Chickpea wholegrain wrap":"chickpeas,wheat,cucumber",
 "Banana + wholegrain toast":"banana,wheat","Rice + lentil recovery bowl":"rice,lentils,carrot",
 "Plain banana + water":"banana","Oatmeal + fruit recovery bowl":"oats,fruit",
 "Dates + banana + water":"dates,banana","Potato + chickpea recovery box":"potato,chickpeas,carrot",
 "Toast + fruit":"wheat,fruit","Tofu rice and vegetable bowl":"tofu,soy,rice,broccoli",
 "Fruit + wholegrain crackers":"fruit,wheat","Black bean rice bowl":"black beans,rice,carrot",
 "Apple + toast":"apple,wheat","Moong dal and roti bowl":"moong dal,wheat,spinach",
 "Roasted chickpeas + fruit":"chickpeas,fruit","Tofu quinoa protein bowl":"tofu,soy,quinoa,broccoli"
};
function sportsFoodChoice(name,p,alternatives){
  const options=[name,...alternatives];
  const found=options.find(x=>!hasListedAllergen({ingredients:SPORTS_FOOD_INGREDIENTS[x]||x},p.allergies) &&
    (p.diet!=="Vegan"||!/milk|paneer|yogurt|egg|chicken|fish/i.test(SPORTS_FOOD_INGREDIENTS[x]||x)));
  return found||"No safe match in the sports catalog — check your allergies and consult a qualified dietitian";
}
function sportsModePlan(p){
  const pools=getPersonalizedMealPools(p);
  const preMeal=(pools.snacks&&pools.snacks[0])||null;
  const postMeal=(pools.lunches&&pools.lunches[0])||(pools.dinners&&pools.dinners[0])||null;
  const intensity=state.sportIntensity;
  const hard=intensity==="Hard";
  const mins=Number(state.sportDuration||60);
  const activity=p.activity||"Moderately Active";
  const sportFoods=SPORTS_FOODS[state.sportType]||SPORTS_FOODS.Cricket;
  const sportIndex=hard||mins>=90?1:0;
  const pre=sportsFoodChoice(sportFoods[0],p,[preMeal?.name||"",...Object.keys(SPORTS_FOOD_INGREDIENTS)]);
  const post=sportsFoodChoice(sportFoods[1],p,[postMeal?.name||"",...Object.keys(SPORTS_FOOD_INGREDIENTS)]);
  const sessionNote=`${state.sportType} • ${intensity} intensity • ${mins} minutes • ${state.sportTiming.toLowerCase()} session`;
  const preTiming=state.sportTiming==="Morning"?"Before an early session, choose something light and familiar.":state.sportTiming==="Evening"?"Allow time between dinner and the session.":"Avoid a very heavy meal immediately before training.";
  const timing=state.sportTiming;
  let hydration=mins>=90?"Carry water and take regular sips; longer or hotter sessions may need additional fluids according to thirst and conditions.":"Drink water before and after, and sip during activity as needed.";
  if(activity==="Very Active"||hard)hydration+=" Your overall fluid needs may be higher because your activity level is high.";
  if((p.conditions||[]).some(x=>/kidney|heart/i.test(x)))hydration+=" If you have a prescribed fluid restriction, follow that instead of generic hydration advice.";
  const recovery=p.goal==="Muscle Building"
    ? `After ${state.sportType.toLowerCase()}, prioritize a protein-rich meal such as ${post}, plus adequate total calories across the day.`
    : p.goal==="Weight Loss"
      ? `After ${state.sportType.toLowerCase()}, use a normal balanced meal such as ${post}; avoid "earning" or skipping meals around exercise.`
      : `After ${state.sportType.toLowerCase()}, include a normal meal such as ${post} with protein, carbohydrates and vegetables.`;
  const when=hard||mins>=60?"Eat a normal meal 2–3 hours before, or a lighter snack 45–90 minutes before.":"A light snack 45–90 minutes before is usually practical.";
  return {
    focus:SPORTS_FOCUS[state.sportType]||SPORTS_FOCUS["Cricket"],
    pre,post,when:when+" "+preTiming+" "+sessionNote+".",hydration,recovery,
    note:Number(p.age)<18?"For under-18 users, focus on growth, hydration and recovery—not calorie restriction.":sportsConditionNote(p),
    personalization:`${effectiveRegionLabel(p)} foods • ${p.diet} • ${p.activity} • ${p.goal} • ${p.budget} budget${allergenTokens(p.allergies).length?` • allergy-aware`:""}`,
    timing
  };
}
