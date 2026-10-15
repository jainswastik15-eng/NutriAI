/* NutriAI V31 - combined local explainable meal matching. No API calls or paid services.
   Nutrients, prices and cooking times are approximate educational estimates.
   Allergens: conservative listed-ingredient exclusion, NOT a safety certification. */
const NUTRIAI_CUISINES = {
  "North Indian": {
    breakfasts:["Moong dal chilla with coriander|moong dal,cilantro,oil|240|13|32|6|6|15|Low","Vegetable besan chilla|chickpea flour,onion,tomato,oil|270|12|33|9|6|18|Low","Paneer bhurji with roti|paneer,milk,wheat,onion,tomato|380|21|37|15|5|25|Moderate"],
    lunches:["Rajma with brown rice|kidney beans,brown rice,tomato,onion|440|18|68|10|12|35|Low","Chole with whole-wheat roti|chickpeas,wheat,tomato,onion|430|19|63|10|11|30|Low","Palak paneer with roti|paneer,milk,spinach,wheat|460|23|41|21|8|35|Moderate"],
    dinners:["Moong dal vegetable khichdi|moong dal,rice,carrot,peas|370|16|59|7|9|25|Low","Mixed dal with phulka and salad|lentils,wheat,cucumber,tomato|410|20|61|9|10|30|Low","Tofu bhurji with roti|tofu,soy,wheat,tomato,onion|390|24|43|13|7|22|Moderate"]
  },
  "South Indian": {
    breakfasts:["Idli with vegetable sambar|rice,urad dal,toor dal,carrot|300|12|56|4|7|20|Low","Ragi dosa with tomato chutney|ragi,rice,tomato,oil|320|10|52|8|7|25|Low","Vegetable upma|semolina,wheat,carrot,peas|340|11|52|10|6|18|Low"],
    lunches:["Sambar rice with poriyal|rice,toor dal,carrot,beans,coconut|440|16|70|10|11|35|Low","Lemon rice with chana sundal|rice,lemon,chickpeas,mustard|430|16|68|10|9|25|Low","Vegetable millet pongal|millet,moong dal,pepper,carrot|400|17|59|10|9|30|Low"],
    dinners:["Vegetable uttapam with sambar|rice,urad dal,tomato,toor dal|380|15|61|8|8|25|Low","Rasam with red rice and dal|rice,tomato,toor dal,tamarind|360|13|60|6|7|25|Low","Adai dosa with vegetable chutney|lentils,rice,carrot,tomato|410|19|55|11|10|30|Low"]
  },
  "East Indian": {
    breakfasts:["Chirer pulao with vegetables|flattened rice,peas,carrot,mustard|320|9|56|8|5|20|Low","Sattu drink and vegetable toast|roasted chickpea flour,wheat,tomato|330|17|51|7|8|10|Low","Vegetable suji cheela|semolina,wheat,onion,carrot|330|12|48|10|6|20|Low"],
    lunches:["Bengali-style masoor dal with rice|masoor dal,rice,turmeric,spinach|410|18|68|7|10|30|Low","Mixed vegetable ghonto with dal|pumpkin,potato,beans,moong dal,rice|420|17|66|9|10|35|Low","Chana dal with rice and greens|chana dal,rice,spinach|430|18|67|10|10|30|Low"],
    dinners:["Light vegetable khichuri|moong dal,rice,peas,carrot|390|16|63|7|8|30|Low","Lau ghonto with dal and rice|bottle gourd,masoor dal,rice|380|16|60|7|9|30|Low","Sattu roti with mixed vegetables|roasted chickpea flour,wheat,carrot|400|17|60|10|10|25|Low"]
  },
  "West Indian": {
    breakfasts:["Kanda poha without peanuts|flattened rice,onion,turmeric,peas|300|9|53|7|5|15|Low","Vegetable dhokla|chickpea flour,yogurt,milk,mustard|300|14|43|8|6|30|Low","Methi thepla with tomato chutney|wheat,fenugreek,tomato,oil|330|11|47|11|7|25|Low"],
    lunches:["Gujarati dal with roti and sabzi|toor dal,wheat,beans,carrot|430|18|65|9|10|35|Low","Matki usal with bhakri|moth beans,millet,onion,tomato|440|21|64|10|12|30|Low","Vegetable varan bhaat|toor dal,rice,carrot|420|17|68|8|8|25|Low"],
    dinners:["Jowar bhakri with mixed dal|sorghum,lentils,spinach|400|19|58|10|10|30|Low","Vegetable handvo|rice,lentils,bottle gourd,oil|390|17|55|11|8|40|Low","Bajra khichdi with vegetables|pearl millet,moong dal,carrot|400|16|60|9|9|35|Low"]
  },
  "United States": {
    breakfasts:["Overnight oats with berries|oats,milk,berries|330|13|50|9|8|8|Moderate","Scrambled tofu breakfast wrap|tofu,soy,wheat,spinach|390|23|40|15|8|15|Moderate","Peanut butter banana toast|peanuts,wheat,banana|360|12|47|15|7|7|Low"],
    lunches:["Quinoa chickpea power bowl|quinoa,chickpeas,spinach,tomato|440|19|60|13|11|20|Moderate","Black bean rice bowl|black beans,rice,corn,tomato|430|18|70|9|12|20|Low","Grilled vegetable hummus wrap|wheat,chickpeas,pepper,cucumber|420|16|58|13|10|15|Moderate"],
    dinners:["Baked sweet potato with black beans|sweet potato,black beans,tomato|410|17|66|9|12|30|Low","Vegetable chili with brown rice|kidney beans,brown rice,tomato,pepper|440|19|70|9|13|35|Low","Tofu stir fry with quinoa|tofu,soy,quinoa,broccoli|450|27|45|18|9|25|Premium"]
  },
  "United Kingdom": {
    breakfasts:["Porridge with apple|oats,milk,apple|320|12|52|8|7|12|Low","Beans on wholemeal toast|beans,wheat,tomato|340|16|55|7|10|10|Low","Mushroom spinach toast|wheat,mushroom,spinach|320|13|42|10|7|15|Low"],
    lunches:["Jacket potato with baked beans|potato,beans,tomato|420|17|72|7|11|35|Low","Lentil vegetable soup and bread|lentils,carrot,wheat|400|19|61|9|12|25|Low","Chickpea salad sandwich|chickpeas,wheat,cucumber|420|18|57|13|9|15|Low"],
    dinners:["Vegetable shepherd's pie with lentils|lentils,potato,carrot,peas|450|20|63|12|11|40|Low","Pea and barley risotto|barley,wheat,peas,mushroom|430|17|65|10|10|35|Moderate","Roasted vegetables with white beans|white beans,carrot,potato|420|19|61|10|12|35|Low"]
  },
  "Italy": {
    breakfasts:["Tomato bruschetta with beans|wheat,tomato,white beans|330|14|50|9|9|12|Low","Fruit and oat breakfast bowl|oats,milk,banana,berries|320|12|49|9|7|10|Moderate","Spinach mushroom frittata-style tofu|tofu,soy,spinach,mushroom|340|22|21|17|6|20|Moderate"],
    lunches:["Whole-wheat pasta primavera|wheat,pasta,broccoli,tomato|450|18|70|11|10|25|Low","Minestrone with beans|kidney beans,tomato,carrot,pasta,wheat|410|18|63|9|12|30|Low","Chickpea tomato salad with bread|chickpeas,tomato,wheat,olive oil|430|18|55|15|10|15|Moderate"],
    dinners:["Lentil bolognese with pasta|lentils,tomato,wheat,pasta|450|23|69|9|12|30|Low","Vegetable risotto with peas|rice,peas,mushroom|420|14|67|11|7|35|Moderate","Tuscan white bean stew|white beans,spinach,tomato|410|22|51|11|13|30|Low"]
  },
  "Japan": {
    breakfasts:["Rice with tofu and cucumber|rice,tofu,soy,cucumber|330|17|48|8|5|12|Low","Vegetable rice porridge|rice,carrot,spinach|300|9|58|4|5|20|Low","Miso soup with rice and tofu|soy,miso,tofu,rice,seaweed|330|16|51|7|5|15|Moderate"],
    lunches:["Tofu vegetable donburi|tofu,soy,rice,carrot,broccoli|440|22|62|12|8|25|Moderate","Soba noodle vegetable bowl|buckwheat,wheat,soy,carrot|420|16|63|10|8|20|Moderate","Edamame rice bowl|soy,edamame,rice,cucumber|430|20|61|11|9|18|Moderate"],
    dinners:["Vegetable tofu stir-fry with rice|tofu,soy,rice,cabbage|430|23|58|12|8|25|Moderate","Mushroom rice with edamame|rice,mushroom,soy,edamame|410|18|64|9|7|25|Moderate","Ginger vegetable hotpot|tofu,soy,carrot,cabbage,rice|390|19|53|10|8|30|Moderate"]
  },
  "Mexico": {
    breakfasts:["Black bean breakfast tacos|corn,black beans,tomato|350|16|56|8|10|15|Low","Avocado bean toast|wheat,avocado,black beans|390|14|48|16|10|10|Moderate","Vegetable corn tortilla scramble|corn,pepper,tomato,black beans|360|15|55|9|9|18|Low"],
    lunches:["Vegetarian burrito bowl|rice,black beans,corn,tomato|450|19|74|9|12|25|Low","Pinto bean vegetable tacos|corn,pinto beans,lettuce,tomato|430|19|64|11|11|20|Low","Quinoa fajita bowl|quinoa,pepper,black beans|450|20|61|14|11|25|Moderate"],
    dinners:["Bean enchilada-style bake|corn,black beans,tomato|430|20|63|11|11|35|Low","Vegetable pozole-style soup|corn,hominy,beans,carrot|390|16|64|8|10|30|Low","Stuffed peppers with beans and rice|pepper,black beans,rice|420|18|65|10|11|35|Low"]
  }
};

const NUTRIAI_ALLERGEN_ALIASES={
  peanut:["peanut","peanuts","groundnut"],peanuts:["peanut","peanuts","groundnut"],
  nuts:["peanut","almond","walnut","cashew","pistachio","hazelnut"],
  "tree nuts":["almond","walnut","cashew","pistachio","hazelnut"],
  milk:["milk","paneer","curd","yogurt","cheese","butter","ghee","whey"],
  dairy:["milk","paneer","curd","yogurt","cheese","butter","ghee","whey"],
  lactose:["milk","paneer","curd","yogurt","cheese","butter","ghee","whey"],
  gluten:["wheat","semolina","barley","pasta","bread","roti","oats"],
  wheat:["wheat","semolina","pasta","bread","roti"],
  soy:["soy","tofu","edamame","miso"],soya:["soy","tofu","edamame","miso"],
  egg:["egg","eggs"],eggs:["egg","eggs"],
  sesame:["sesame","tahini"],fish:["fish","salmon","tuna"],
  shellfish:["shrimp","prawn","crab","shellfish"],
  coconut:["coconut"],chickpea:["chickpea","chickpeas","chickpea flour","besan"],
  lentils:["lentils","masoor dal","moong dal","toor dal","urad dal","chana dal"],
  rice:["rice"],corn:["corn","hominy"],oats:["oats"]
};
const NUTRIAI_BUDGET_ORDER={Low:0,Moderate:1,Premium:2};
const NUTRIAI_SKILL_ORDER={Beginner:0,Intermediate:1,Advanced:2};
const NUTRIAI_TIME_PREFS={
  lt10:{min:0,max:10,target:8,label:"Under 10 min"},
  "10to20":{min:10,max:20,target:15,label:"10–20 min"},
  "20to40":{min:21,max:40,target:30,label:"20–40 min"},
  gt40:{min:41,max:999,target:50,label:"40+ min"}
};
const NUTRIAI_INDIAN_REGIONS=["North Indian","South Indian","East Indian","West Indian"];
const NUTRIAI_SNACKS_BY_REGION={
  "North Indian":[
    "Roasted chana with guava|chickpeas,guava|190|9|34|3|8|5|Low",
    "Moong chaat cup|moong dal,cucumber,tomato|210|12|34|4|8|10|Low",
    "Paneer cucumber bites|paneer,milk,cucumber|200|15|8|11|2|8|Moderate"
  ],
  "South Indian":[
    "Mini idli with dry podi|rice,urad dal|190|7|36|3|4|10|Low",
    "Chana sundal cup|chickpeas,coconut,mustard|210|10|31|7|8|12|Low",
    "Banana with pumpkin seeds|banana,pumpkin seeds|190|6|28|7|5|3|Low"
  ],
  "East Indian":[
    "Sattu drink with fruit|roasted chickpea flour,banana|220|11|39|4|7|5|Low",
    "Chirer vegetable cup|flattened rice,peas,carrot|210|6|37|5|4|10|Low",
    "Roasted chana with orange|chickpeas,orange|190|8|35|3|7|5|Low"
  ],
  "West Indian":[
    "Dhokla snack box|chickpea flour,yogurt,milk|220|10|34|5|5|15|Low",
    "Roasted makhana cup|makhana,oil|160|5|27|4|3|8|Low",
    "Poha vegetable cup|flattened rice,peas,onion|230|7|42|5|5|12|Low"
  ],
  "United States":[
    "Apple with sunflower seeds|apple,sunflower seeds|190|5|28|8|6|3|Low",
    "Hummus vegetable cup|chickpeas,cucumber,carrot,olive oil|190|7|24|8|7|8|Moderate",
    "Greek-style yogurt with berries|yogurt,milk,berries|180|12|21|5|4|3|Moderate"
  ],
  "United Kingdom":[
    "Apple with oat bites|apple,oats|190|5|34|5|6|8|Low",
    "Beans on mini wholemeal toast|beans,wheat,tomato|220|10|38|4|7|10|Low",
    "Carrot hummus pot|carrot,chickpeas,olive oil|180|6|22|8|6|8|Moderate"
  ],
  "Italy":[
    "Tomato bean bruschetta bite|wheat,tomato,white beans|210|9|34|5|7|10|Low",
    "Fruit oat cup|oats,milk,berries|190|7|31|5|5|5|Moderate",
    "Chickpea cucumber salad cup|chickpeas,cucumber,olive oil|200|8|25|8|7|8|Moderate"
  ],
  "Japan":[
    "Edamame cucumber cup|soy,edamame,cucumber|180|13|17|7|7|7|Moderate",
    "Rice tofu snack bowl|rice,tofu,soy,cucumber|220|11|32|5|4|10|Low",
    "Fruit rice cracker plate|rice,apple|170|3|38|1|3|3|Low"
  ],
  "Mexico":[
    "Black bean corn cup|black beans,corn,tomato|210|9|38|4|8|10|Low",
    "Avocado bean tortilla bite|corn,avocado,black beans|230|8|31|9|8|10|Moderate",
    "Fruit with pumpkin seeds|orange,pumpkin seeds|190|6|25|8|5|3|Low"
  ]
};

function mealFeedbackStore(){try{return JSON.parse(safeStorage.getItem("nutriMealFeedback")||"{}")||{}}catch(e){return {}}}
function mealFeedbackFor(name){return Number(mealFeedbackStore()[name]?.vote||0)}
function rateMeal(name,vote){
  const feedback=mealFeedbackStore();
  feedback[name]={vote:mealFeedbackFor(name)===vote?0:vote,at:Date.now()};
  safeStorage.setItem("nutriMealFeedback",JSON.stringify(feedback));
  render();
}
function allergenTokens(text){return String(text||"").toLowerCase().split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean)}
function hasListedAllergen(meal,allergies){
  const ingredients=String(meal.ingredients||"").toLowerCase().split(",").map(x=>x.trim());
  return allergenTokens(allergies).some(allergy=>{
    const tokens=NUTRIAI_ALLERGEN_ALIASES[allergy]||[allergy];
    return tokens.some(t=>ingredients.some(i=>i===t || i.includes(t) || (t.includes(i)&&i.length>3)));
  });
}
function parseCuisineMeal(line,region,slot){
  const [name,ingredients,cal,protein,carbs,fat,fiber,minutes,budget]=line.split("|");
  return {name,ingredients,calories:+cal,protein:+protein,carbs:+carbs,fat:+fat,fiber:+fiber,minutes:+minutes,budget,region,slot,portion:"1 balanced serving (estimated)"};
}
function vegetarianToVegan(meal){
  const dairy=/\b(milk|paneer|curd|yogurt|cheese|butter|ghee|whey)\b/i;
  if(!dairy.test(meal.ingredients))return meal;
  // Do not silently substitute ingredients in recipes: skip dairy-containing recipes.
  return null;
}
function meatAlternatives(region,slot){
  const suffix=slot==="breakfasts"?"breakfasts":slot==="lunches"?"lunches":"dinners";
  const data={
    "North Indian":{breakfasts:"Egg bhurji with roti|egg,wheat,onion,tomato|370|23|36|14|5|15|Moderate",lunches:"Chicken tikka with roti and salad|chicken,wheat,cucumber,tomato|470|35|43|15|8|35|Moderate",dinners:"Chicken curry with brown rice|chicken,rice,tomato,onion|450|32|53|13|7|35|Moderate"},
    "South Indian":{breakfasts:"Egg dosa with tomato chutney|egg,rice,urad dal,tomato|370|20|47|11|5|20|Moderate",lunches:"Fish curry with rice and vegetables|fish,rice,tomato,carrot|460|32|55|12|7|35|Moderate",dinners:"Chicken vegetable stew with appam|chicken,rice,coconut,carrot|450|30|52|13|7|35|Moderate"},
    "East Indian":{breakfasts:"Boiled eggs with vegetable chire|egg,flattened rice,carrot|370|21|46|11|5|18|Moderate",lunches:"Bengali fish curry with rice|fish,rice,tomato,turmeric|450|32|57|10|7|35|Moderate",dinners:"Chicken jhol with rice|chicken,rice,potato,tomato|460|33|55|12|6|35|Moderate"},
    "West Indian":{breakfasts:"Egg bhurji with vegetable poha|egg,flattened rice,peas|390|23|48|12|6|18|Moderate",lunches:"Chicken sukka with jowar bhakri|chicken,sorghum,onion,tomato|470|35|47|15|8|35|Moderate",dinners:"Fish curry with millet roti|fish,millet,tomato,onion|450|31|49|13|7|35|Moderate"},
    "United States":{breakfasts:"Egg and spinach wholegrain toast|egg,wheat,spinach|380|23|37|15|6|12|Moderate",lunches:"Grilled chicken quinoa bowl|chicken,quinoa,spinach,tomato|490|39|48|15|9|25|Premium",dinners:"Baked salmon with sweet potato|salmon,fish,sweet potato,broccoli|480|36|42|18|9|30|Premium"},
    "United Kingdom":{breakfasts:"Scrambled eggs on wholemeal toast|egg,wheat,milk|380|23|39|15|6|12|Moderate",lunches:"Chicken jacket potato|chicken,potato,spinach|470|36|54|11|8|35|Moderate",dinners:"Baked cod with peas and potatoes|fish,cod,potato,peas|450|34|51|11|8|35|Premium"},
    "Italy":{breakfasts:"Egg frittata with wholegrain toast|egg,wheat,spinach|390|25|38|16|6|20|Moderate",lunches:"Chicken whole-wheat pasta|chicken,wheat,pasta,tomato|490|36|58|12|8|30|Moderate",dinners:"Grilled fish with vegetable risotto|fish,rice,peas,mushroom|470|35|53|13|7|35|Premium"},
    "Japan":{breakfasts:"Egg rice bowl with cucumber|egg,rice,cucumber|370|20|53|9|5|15|Moderate",lunches:"Grilled salmon rice bowl|salmon,fish,rice,cucumber|480|35|57|14|6|25|Premium",dinners:"Chicken teriyaki-style rice bowl|chicken,soy,rice,broccoli|470|36|57|12|8|30|Moderate"},
    "Mexico":{breakfasts:"Egg and black bean tacos|egg,corn,black beans|390|24|48|12|9|15|Moderate",lunches:"Chicken fajita rice bowl|chicken,rice,pepper,black beans|490|37|60|12|10|25|Moderate",dinners:"Fish tacos with beans|fish,corn,black beans,tomato|470|34|53|14|9|30|Premium"}
  };
  return data[region]&&data[region][suffix]?parseCuisineMeal(data[region][suffix],region,slot):null;
}
function effectiveCuisineKeys(p){
  if(p.region==="International")return [p.country||"United States"];
  if(p.region==="Pan-Indian")return NUTRIAI_INDIAN_REGIONS.slice();
  return [p.region||"North Indian"];
}
function effectiveRegionLabel(p){return p.region==="International"?(p.country||"United States"):(p.region||"Pan-Indian")}
function mealSkillLevel(meal){
  const count=String(meal.ingredients||"").split(",").filter(Boolean).length;
  if(meal.minutes>30 || (meal.minutes>=25 && count>=5) || count>=6)return "Advanced";
  if(meal.minutes<=15 && count<=4)return "Beginner";
  return "Intermediate";
}
function mealFitsTime(meal,key){
  const pref=NUTRIAI_TIME_PREFS[key]||NUTRIAI_TIME_PREFS["10to20"];
  return meal.minutes>=pref.min && meal.minutes<=pref.max;
}
function timePreferencePoints(meal,key){
  const pref=NUTRIAI_TIME_PREFS[key]||NUTRIAI_TIME_PREFS["10to20"];
  if(mealFitsTime(meal,key))return 12;
  const d=Math.abs(meal.minutes-pref.target);
  if(d<=5)return -3;
  if(d<=10)return -9;
  if(d<=15)return -14;
  return -18;
}
function conditionNames(p){return (p.conditions||[]).filter(x=>x&&x!=="None").map(x=>String(x).toLowerCase())}
function combinedPersonalizationText(p){
  const region=effectiveRegionLabel(p);
  const allergy=allergenTokens(p.allergies).length?`allergy exclusions (${allergenTokens(p.allergies).join(", ")})`:"no entered allergies";
  const conditions=(p.conditions||[]).filter(x=>x&&x!=="None");
  const cond=conditions.length?conditions.join(" + "):"general wellness";
  return `${region} • ${p.diet} • ${p.activity} • ${p.goal} • ${cond} • ${p.budget} budget • ${NUTRIAI_TIME_PREFS[state.cookingTime]?.label||"10–20 min"} • ${state.cookingSkill} • ${allergy}`;
}
function scoreNutriMeal(meal,p){
  let score=57;const notes=[];const name=meal.name.toLowerCase();
  const conditions=conditionNames(p);let diseaseDelta=0;
  const skill=mealSkillLevel(meal);
  const selectedSkill=state.cookingSkill||"Intermediate";
  const selectedBudget=NUTRIAI_BUDGET_ORDER[p.budget]??1;
  const mealBudget=NUTRIAI_BUDGET_ORDER[meal.budget]??1;

  score+=7;notes.push(`${meal.region} cuisine`);
  score+=6;notes.push(`${p.diet} compatible`);
  if(p.diet==="Non-Vegetarian"&&/egg|chicken|fish|salmon|cod/i.test(meal.ingredients)){score+=11;notes.push("non-vegetarian preference match")}

  if(p.goal==="Weight Loss"){
    if(meal.fiber>=8){score+=7;notes.push("higher fiber")}
    if(meal.protein>=18){score+=6;notes.push("protein for satiety")}
    if(meal.calories>470)score-=10;
  }else if(p.goal==="Muscle Building"){
    if(meal.protein>=25){score+=12;notes.push("higher protein for muscle goal")}
    else if(meal.protein>=18){score+=6;notes.push("protein supportive")}
  }else if(p.goal==="Weight Gain"){
    if(meal.calories>=420){score+=8;notes.push("higher energy for weight-gain goal")}
    if(meal.protein>=18)score+=5;
  }else if(meal.fiber>=7){score+=5;notes.push("fiber-forward wellness choice")}

  if(p.activity==="Sedentary"){
    if(meal.calories<=430){score+=5;notes.push("portion fits lower activity")}
    if(meal.fiber>=7)score+=3;
  }else if(p.activity==="Lightly Active"){
    if(meal.protein>=16)score+=4;
  }else if(p.activity==="Moderately Active"){
    if(meal.protein>=18){score+=5;notes.push("supports moderate activity")}
    if(meal.carbs>=40&&meal.carbs<=70)score+=3;
  }else if(p.activity==="Very Active"){
    if(meal.protein>=20){score+=7;notes.push("supports high activity")}
    if(meal.carbs>=45){score+=5;notes.push("activity fuel")}
  }

  if(conditions.some(c=>c.includes("diabet")||c.includes("pcos")||c.includes("pcod"))){
    if(meal.fiber>=8){score+=9;diseaseDelta+=9;notes.push("fiber-forward for glucose balance")}
    if(meal.protein>=17){score+=5;diseaseDelta+=5}
    if(meal.carbs>65){score-=12;diseaseDelta-=12}
  }
  if(conditions.some(c=>c.includes("cholesterol"))){
    if(meal.fiber>=8){score+=8;diseaseDelta+=8;notes.push("fiber-forward heart-health choice")}
    if(meal.fat>17){score-=6;diseaseDelta-=6}
  }
  if(conditions.some(c=>c.includes("hypertension")||c.includes("high bp")||c.includes("blood pressure"))){
    notes.push("prepare with limited added salt")
    if(/miso|sauce|pickle|papad/.test(name)){score-=12;diseaseDelta-=12}
  }
  if(conditions.some(c=>c.includes("anemia")||c.includes("anaemia"))){
    if(/lentil|dal|bean|spinach|chickpea|egg|fish|chicken/.test(meal.ingredients)){score+=7;diseaseDelta+=7;notes.push("potential iron foods")}
  }
  if(conditions.some(c=>c.includes("gerd")||c.includes("acidity"))){
    if(/tomato|lemon|pepper|chili|tamarind/.test(meal.ingredients)){score-=6;diseaseDelta-=6;notes.push("check personal reflux triggers")}
  }
  if(conditions.some(c=>c.includes("thyroid")))notes.push("no blanket thyroid food exclusions")
  if(conditions.some(c=>c.includes("kidney")||c.includes("liver")))notes.push("clinician-guided condition targets required")

  const tPts=timePreferencePoints(meal,state.cookingTime);
  score+=tPts;
  notes.push(mealFitsTime(meal,state.cookingTime)?"fits selected cooking time":"closest available time fit");

  const skillDiff=Math.abs((NUTRIAI_SKILL_ORDER[skill]??1)-(NUTRIAI_SKILL_ORDER[selectedSkill]??1));
  if(skill===selectedSkill){score+=8;notes.push(`${selectedSkill.toLowerCase()} skill fit`)}
  else if(skillDiff===1)score+=1;
  else score-=8;

  if(mealBudget>selectedBudget){score-=25}
  else if(meal.budget===p.budget){score+=7;notes.push(`${p.budget.toLowerCase()} budget match`)}
  else {score+=3;notes.push("within budget")}

  const feedback=mealFeedbackFor(meal.name);
  if(feedback===1){score+=15;notes.push("liked previously")}
  if(feedback===-1){score-=35;notes.push("disliked previously")}

  score=Math.max(10,Math.min(99,Math.round(score)));
  return {...meal,skillLevel:skill,mealScore:score,diseaseFitScore:diseaseDelta,personalizationNote:notes.slice(0,7).join(" • ")||"Selected from your combined profile"};
}
function candidateMealsForSlot(p,slot){
  const keys=effectiveCuisineKeys(p);
  let meals=[];
  keys.forEach(region=>{
    const cuisine=NUTRIAI_CUISINES[region]||NUTRIAI_CUISINES["North Indian"];
    meals.push(...(cuisine[slot]||[]).map(x=>parseCuisineMeal(x,region,slot)));
    if(p.diet==="Non-Vegetarian"){
      const nv=meatAlternatives(region,slot);if(nv)meals.push(nv);
    }
  });
  if(p.diet==="Vegan")meals=meals.map(vegetarianToVegan).filter(Boolean);
  meals=meals.filter(x=>!hasListedAllergen(x,p.allergies));

  const budgetMax=NUTRIAI_BUDGET_ORDER[p.budget]??1;
  const budgetFits=meals.filter(x=>(NUTRIAI_BUDGET_ORDER[x.budget]??1)<=budgetMax);
  if(budgetFits.length)meals=budgetFits;

  const changedSkill=(state.cookingSkill||"Intermediate")!=="Intermediate";
  const changedTime=(state.cookingTime||"10to20")!=="10to20";
  // Default 10–20 min + Intermediate keeps the full safe/budget-compatible pool so
  // diet, activity, goal and health factors can still influence the winner.
  // When the user explicitly changes time or skill, that preference becomes a stronger constraint.
  if(changedSkill||changedTime){
    const timeAndSkill=meals.filter(x=>mealFitsTime(x,state.cookingTime)&&mealSkillLevel(x)===state.cookingSkill);
    if(timeAndSkill.length)meals=timeAndSkill;
    else{
      const timeFits=meals.filter(x=>mealFitsTime(x,state.cookingTime));
      const skillFits=meals.filter(x=>mealSkillLevel(x)===state.cookingSkill);
      if(changedSkill&&skillFits.length)meals=skillFits;
      else if(changedTime&&timeFits.length)meals=timeFits;
      else if(changedTime&&state.cookingTime==="lt10"&&meals.length){const m=Math.min(...meals.map(x=>x.minutes));meals=meals.filter(x=>x.minutes===m)}
      else if(changedTime&&state.cookingTime==="gt40"&&meals.length){const m=Math.max(...meals.map(x=>x.minutes));meals=meals.filter(x=>x.minutes===m)}
      else if(skillFits.length)meals=skillFits;
    }
  }
  return meals;
}
function snackCandidates(p){
  const keys=effectiveCuisineKeys(p);
  let snacks=[];
  keys.forEach(region=>{
    const lines=NUTRIAI_SNACKS_BY_REGION[region]||NUTRIAI_SNACKS_BY_REGION["North Indian"];
    snacks.push(...lines.map(x=>parseCuisineMeal(x,region,"snacks")));
  });
  if(p.diet==="Vegan")snacks=snacks.map(vegetarianToVegan).filter(Boolean);
  snacks=snacks.filter(x=>!hasListedAllergen(x,p.allergies));
  const budgetMax=NUTRIAI_BUDGET_ORDER[p.budget]??1;
  const budgetFits=snacks.filter(x=>(NUTRIAI_BUDGET_ORDER[x.budget]??1)<=budgetMax);
  return budgetFits.length?budgetFits:snacks;
}
function getPersonalizedMealPools(p){
  const pools={};
  for(const slot of ["breakfasts","lunches","dinners"]){
    pools[slot]=candidateMealsForSlot(p,slot).map(x=>scoreNutriMeal(x,p)).sort((a,b)=>b.mealScore-a.mealScore);
  }
  pools.snacks=snackCandidates(p).map(x=>scoreNutriMeal(x,p)).sort((a,b)=>b.mealScore-a.mealScore);
  return pools;
}
function currentPersonalizedMealObjects(p){
  const pools=getPersonalizedMealPools(p);
  const variants=state.mealSlotVariants||{};
  const globalV=Number(state.mealVariant||0);
  const pick=(list,key)=>{
    if(!list||!list.length)return null;
    const v=Number.isFinite(variants[key])?variants[key]:globalV;
    return list[((v%list.length)+list.length)%list.length];
  };
  return [pick(pools.breakfasts,"breakfasts"),pick(pools.lunches,"lunches"),pick(pools.dinners,"dinners")].filter(Boolean);
}
function currentMealIngredients(p){
  const seen=new Set(),out=[];
  currentPersonalizedMealObjects(p).forEach(meal=>String(meal.ingredients||"").split(",").map(x=>x.trim()).filter(Boolean).forEach(x=>{
    const key=x.toLowerCase();if(!seen.has(key)){seen.add(key);out.push(x)}
  }));
  return out;
}
function groceryDisplayName(raw){
  const special={
    "tofu":"Tofu","soy":"Soy","edamame":"Edamame","quinoa":"Quinoa","oats":"Oats","ragi":"Ragi","amla":"Amla",
    "urad dal":"Urad dal","toor dal":"Toor dal","moong dal":"Moong dal","masoor dal":"Masoor dal","chana dal":"Chana dal",
    "olive oil":"Olive oil","brown rice":"Brown rice","black beans":"Black beans","white beans":"White beans",
    "kidney beans":"Kidney beans","flattened rice":"Flattened rice","sweet potato":"Sweet potato","chickpea flour":"Chickpea flour",
    "roasted chickpea flour":"Roasted chickpea flour","pumpkin seeds":"Pumpkin seeds","sunflower seeds":"Sunflower seeds"
  };
  const key=String(raw||"").trim().toLowerCase();
  if(special[key])return special[key];
  return key.replace(/\b\w/g,c=>c.toUpperCase());
}
function groceryCategory(raw){
  const x=String(raw||"").toLowerCase();
  if(/rice|wheat|oat|quinoa|barley|millet|ragi|sorghum|buckwheat|pasta|corn|flattened rice|bread|makhana/.test(x))return "🌾 Grains & Cereals";
  if(/dal|lentil|chickpea|chana|bean|rajma|moth bean|pea|edamame/.test(x))return "▤ Pulses & Lentils";
  if(/spinach|broccoli|carrot|cucumber|tomato|onion|pepper|capsicum|potato|sweet potato|mushroom|cabbage|lettuce|fenugreek|vegetable/.test(x))return "🥬 Vegetables";
  if(/apple|banana|orange|guava|amla|berry|berries|fruit|grapefruit|lemon|kiwi|strawberry/.test(x))return "🍎 Fruits";
  if(/milk|curd|yogurt|paneer|cheese/.test(x))return "🥛 Dairy / Alternatives";
  if(/tofu|tempeh|egg|chicken|fish|salmon|cod/.test(x))return "🍗 Proteins";
  if(/garlic|ginger|turmeric|cinnamon|cilantro|coriander|mustard|spice|herb/.test(x))return "🌿 Spices & Herbs";
  if(/oil|avocado|ghee|butter/.test(x))return "▤ Oils & Fats";
  if(/walnut|almond|seed|peanut|cashew|pistachio/.test(x))return "🥜 Seeds & Nuts";
  return "📦 Others";
}
function groceryData(p){
  const categories={
    "🌾 Grains & Cereals":[],"▤ Pulses & Lentils":[],"🥬 Vegetables":[],"🍎 Fruits":[],
    "🥛 Dairy / Alternatives":[],"🍗 Proteins":[],"🌿 Spices & Herbs":[],"▤ Oils & Fats":[],"🥜 Seeds & Nuts":[],"📦 Others":[]
  };
  const sources=[];
  currentPersonalizedMealObjects(p).forEach(m=>sources.push(m));
  const snackPool=(getPersonalizedMealPools(p)?.snacks||[]).slice(0,2);
  snackPool.forEach(m=>sources.push(m));
  (state.groceryExtras||[]).forEach(x=>sources.push(x));
  const seen=new Set();
  sources.forEach(source=>{
    String(source?.ingredients||"").split(",").map(x=>x.trim()).filter(Boolean).forEach(raw=>{
      if(hasListedAllergen({ingredients:raw},p.allergies))return;
      const key=raw.toLowerCase();
      if(seen.has(key))return;
      seen.add(key);
      const cat=groceryCategory(raw);
      categories[cat].push(groceryDisplayName(raw));
    });
  });
  const out={};
  Object.entries(categories).forEach(([cat,items])=>{if(items.length)out[cat]=items.sort((a,b)=>a.localeCompare(b));});
  return out;
}
function groceryFlat(p){return Object.values(groceryData(p)).flat();}
function toggleGrocery(item){
  state.groceryChecked=state.groceryChecked||{};
  state.groceryChecked[item]=!state.groceryChecked[item];
  render();
}
function refreshGrocery(){
  const valid=new Set(groceryFlat(state.profile));
  const next={};
  Object.entries(state.groceryChecked||{}).forEach(([item,checked])=>{if(valid.has(item)&&checked)next[item]=true;});
  state.groceryChecked=next;
  state.groceryVariant=(state.groceryVariant||0)+1;
  render();
}
function profileModeScore(item,p){
  const ingredients=String(item.ingredients||"");
  if(hasListedAllergen({ingredients},p.allergies))return -999;
  let score=50;
  const conditions=conditionNames(p);
  const budgetMax=NUTRIAI_BUDGET_ORDER[p.budget]??1;
  const itemBudget=NUTRIAI_BUDGET_ORDER[item.budget||"Low"]??0;
  if(itemBudget>budgetMax)return -999;
  score+=itemBudget==budgetMax?6:3;
  if(p.goal==="Weight Loss"){score+=(item.protein||0)>=15?6:0;score+=(item.fiber||0)>=6?6:0;score-=(item.calories||0)>500?8:0}
  if(p.goal==="Muscle Building")score+=(item.protein||0)>=22?10:(item.protein||0)>=15?5:0;
  if(p.goal==="Weight Gain"){score+=(item.calories||0)>=400?7:0;score+=(item.protein||0)>=18?5:0}
  if(p.activity==="Very Active"){score+=(item.protein||0)>=18?6:0;score+=(item.carbs||0)>=35?4:0}
  if(p.activity==="Moderately Active")score+=(item.protein||0)>=15?4:0;
  if(p.activity==="Sedentary"&&(item.calories||0)>500)score-=7;
  if(conditions.some(c=>c.includes("diabet")||c.includes("pcos")||c.includes("pcod"))){score+=(item.fiber||0)>=6?7:0;if((item.carbs||0)>70)score-=8}
  if(conditions.some(c=>c.includes("cholesterol"))){score+=(item.fiber||0)>=6?5:0;if((item.fat||0)>20)score-=5}
  if(conditions.some(c=>c.includes("anemia"))&&/lentil|dal|bean|spinach|chickpea|egg|fish|chicken/i.test(ingredients))score+=6;
  if(conditions.some(c=>c.includes("gerd")||c.includes("acidity"))&&/tomato|lemon|pepper|chili|tamarind/i.test(ingredients))score-=5;
  return score;
}
function combinedProfileBadges(p){
  const conditions=(p.conditions||[]).filter(x=>x&&x!=="None");
  return [effectiveRegionLabel(p),p.diet,p.activity,p.goal,conditions.length?conditions.join(" + "):"General Wellness",`${p.budget} budget`,allergenTokens(p.allergies).length?`Allergy-aware: ${allergenTokens(p.allergies).join(", ")}`:"No entered allergies"];
}
function mealFeedbackProgressHtml(){
  const entries=Object.entries(mealFeedbackStore()).filter(([,v])=>v&&v.vote&&v.at).sort((a,b)=>a[1].at-b[1].at).slice(-12);
  if(!entries.length)return '<section class="graph-card feedback-progress"><h3>👍 Meal Feedback</h3><p>Like or dislike meals in Diet Plan to start tracking your preferences.</p></section>';
  const w=680,h=170,pad=32;
  const x=i=>pad+(entries.length===1?(w-2*pad)/2:i*(w-2*pad)/(entries.length-1));
  const y=v=>v===1?40:130;
  const pts=entries.map(([name,v],i)=>`${x(i)},${y(v.vote)}`).join(" ");
  return `<section class="graph-card feedback-progress"><h3>👍 Meal Feedback Trend</h3><p>${entries.filter(([,v])=>v.vote===1).length} liked • ${entries.filter(([,v])=>v.vote===-1).length} disliked (recent ratings)</p><svg viewBox="0 0 ${w} ${h}" class="progress-svg" role="img" aria-label="Meal preference feedback trend"><line x1="32" y1="40" x2="648" y2="40" stroke="#c8e6d3" stroke-dasharray="4 4"/><line x1="32" y1="130" x2="648" y2="130" stroke="#f2d0d0" stroke-dasharray="4 4"/><text x="4" y="45" font-size="11">👍</text><text x="4" y="135" font-size="11">👎</text><polyline points="${pts}" fill="none" stroke="#278d62" stroke-width="3"/>${entries.map(([name,v],i)=>`<circle cx="${x(i)}" cy="${y(v.vote)}" r="6" fill="${v.vote===1?'#278d62':'#bd5353'}"><title>${name}: ${v.vote===1?'liked':'disliked'}</title></circle>`).join("")}</svg></section>`;
}
