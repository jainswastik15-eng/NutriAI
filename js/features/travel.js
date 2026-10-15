function setTravelOption(kind,val){state[kind]=val;state.travelGenerated=false;render()}
function generateTravelMode(){state.travelGenerated=true;render()}
function regenerateTravel(){state.travelVariant=(state.travelVariant+1)%6;state.travelGenerated=true;render()}
function travelStorageLabel(meal){
  return /milk|yogurt|paneer|tofu|rice|cut fruit|berries/i.test(meal.ingredients||"")?"Best kept cool":"No refrigeration for a short trip";
}
function travelPriorityScore(meal){
  let score=0;
  if(state.travelPriority==="High Protein")score+=(meal.protein||0)*1.2;
  if(state.travelPriority==="Budget Friendly"&&meal.budget==="Low")score+=12;
  if(state.travelPriority==="Light & Easy"&&meal.calories<=220)score+=8;
  if(state.travelPriority==="No Refrigeration Needed"&&!/milk|yogurt|paneer|tofu|rice|berries/i.test(meal.ingredients||""))score+=12;
  if(state.travelPriority==="Mess Free"&&!/salad|soup/i.test(meal.name||""))score+=7;
  if(state.travelPriority==="Hydration Focus"&&/fruit|cucumber|orange|apple|guava/i.test(`${meal.name} ${meal.ingredients}`))score+=7;
  return score;
}
const TRAVEL_CONTEXT_FOODS={
 "Road Trip":["Roasted chickpeas","Wholegrain vegetable wrap","Apple + roasted chana"],
 "Flight":["Wholegrain crackers","Whole apple","Dry roasted chickpeas"],
 "Train Journey":["Thepla + dry vegetable","Chickpea roti roll","Whole banana"],
 "Bus Journey":["Roasted gram pouch","Banana","Dry millet crackers"],
 "School Trip":["Mini moong chilla","Apple slices (kept cool)","Roasted chickpeas"],
 "Office Travel":["Wholegrain hummus sandwich","Quinoa bean salad (kept cool)","Roasted chickpeas"],
 "Vacation":["Fruit + nuts (if safe)","Bean grain bowl","Vegetable wrap"],
 "Long Commute":["Banana","Roasted chana","Wholegrain sandwich"]
};
const TRAVEL_CONTEXT_INGREDIENTS={
 "Roasted chickpeas":"chickpeas","Wholegrain vegetable wrap":"wheat,carrot,cucumber","Apple + roasted chana":"apple,chickpeas",
 "Wholegrain crackers":"wheat","Whole apple":"apple","Dry roasted chickpeas":"chickpeas",
 "Thepla + dry vegetable":"wheat,fenugreek,carrot","Chickpea roti roll":"chickpeas,wheat,cucumber","Whole banana":"banana",
 "Roasted gram pouch":"chickpeas","Banana":"banana","Dry millet crackers":"millet",
 "Mini moong chilla":"moong dal","Apple slices (kept cool)":"apple","Wholegrain hummus sandwich":"wheat,chickpeas,cucumber",
 "Quinoa bean salad (kept cool)":"quinoa,beans,cucumber","Fruit + nuts (if safe)":"fruit,almond",
 "Bean grain bowl":"beans,rice","Vegetable wrap":"wheat,carrot","Roasted chana":"chickpeas","Wholegrain sandwich":"wheat,cucumber"
};
function travelContextCandidates(p){
 const names=TRAVEL_CONTEXT_FOODS[state.travelType]||TRAVEL_CONTEXT_FOODS["Road Trip"];
 return names.map((name,i)=>({name,ingredients:TRAVEL_CONTEXT_INGREDIENTS[name]||name,calories:150+i*65,protein:6+i*5,budget:i===0?"Low":"Moderate",region:effectiveRegionLabel(p),personalizationNote:`${state.travelType} travel option`,score:85-i*5}));
}
function travelSnacks(p){
  let items=[...travelContextCandidates(p),...snackCandidates(p)].filter(x=>!hasListedAllergen(x,p.allergies))
    .map(x=>({...x,score:profileModeScore(x,p)+travelPriorityScore(x)+(travelContextCandidates(p).some(y=>y.name===x.name)?35:0)}))
    .filter(x=>x.score>-900).sort((a,b)=>b.score-a.score);
  if(state.travelFoodAccess==="Limited food options"||state.travelPriority==="No Refrigeration Needed")
    items=items.filter(x=>!/yogurt|milk|paneer|tofu|cooked rice|cut fruit/i.test(x.ingredients||""));
  if(!items.length)return [];
  const v=state.travelVariant||0;
  return Array.from({length:Math.min(3,items.length)},(_,i)=>items[(v+i)%items.length]).map(x=>[
    x.name,x.calories,x.protein,travelStorageLabel(x),
    `${x.region} option • ${x.budget} budget • ${x.personalizationNote||"fits your profile"}`
  ]);
}
function travelPlan(p){
  const flight=state.travelType==="Flight";
  const road=state.travelType==="Road Trip";
  const long=/8–12|Full Day|Multiple/.test(state.travelDuration);
  const main=currentPersonalizedMealObjects(p)[1]||currentPersonalizedMealObjects(p)[2];
  const mealName=main?main.name:"a balanced meal from your plan";
  const travelKit=(TRAVEL_CONTEXT_FOODS[state.travelType]||TRAVEL_CONTEXT_FOODS["Road Trip"]).filter(x=>!hasListedAllergen({ingredients:TRAVEL_CONTEXT_INGREDIENTS[x]},p.allergies)).slice(0,2).join(" + ");
  const allergyNote=allergenTokens(p.allergies).length?` Verify labels and avoid ${allergenTokens(p.allergies).join(", ")}, including cross-contact.`:"";
  const conditionNote=(p.conditions||[]).some(x=>/diabet|pcos|pcod/i.test(x))?" Keep meal timing reasonably consistent and carry an appropriate backup snack based on your care plan.":"";
  const budgetNote=p.budget==="Low"?" Homemade packed food is prioritized to reduce travel cost.":p.budget==="Premium"?" You can use suitable café/airport options when they match your diet and allergies.":" Mix packed food with simple purchased options as needed.";
  return {
    before:`Have ${mealName} or another normal balanced meal before departure so you are not relying only on snacks.`,
    timeline:long?`For your ${state.travelType.toLowerCase()}, pack ${travelKit||"a verified allergy-safe option"}, a main meal and water; plan stops for safe food storage.`:`For your ${state.travelType.toLowerCase()}, consider ${travelKit||"an allergy-safe option"} and water based on meal timing.`,
    hydration:p.activity==="Very Active"?"Carry water where permitted and drink regularly according to thirst; higher activity may increase fluid needs.":"Carry water where permitted and drink regularly according to thirst. Avoid relying on sugary drinks.",
    special:flight
      ?`Airport quick picks should match your ${p.diet.toLowerCase()} preference: fruit, a suitable sandwich/wrap/bowl, and water.${allergyNote}`
      :road
        ?`Road-trip kit: a suitable wrap/box, fruit, one profile-matched snack, water, tissues and normal rest breaks.${allergyNote}`
        :`Choose portable foods that match your ${effectiveRegionLabel(p)} preferences where available, and be careful with foods that require refrigeration.${allergyNote}`,
    safety:`Foods containing dairy, tofu, cooked rice, cut fruit or other perishable ingredients may need safe temperature control on longer journeys.${conditionNote}${budgetNote}`,
    personalization:`${combinedPersonalizationText(p)} • ${state.travelType} • ${state.travelFoodAccess} • ${state.travelPriority}`
  };
}
