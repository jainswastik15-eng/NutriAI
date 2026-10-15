const LUNCHBOX_BY_REGION={
  "North Indian":[
    {name:"Moong Chilla Rolls",side:"Cucumber sticks",snack:"Guava",drink:"Water",calories:470,protein:21,carbs:56,fat:12,fiber:9,tag:"Mess-free",ingredients:"moong dal,cucumber,guava,oil",minutes:18,budget:"Low"},
    {name:"Rajma Whole-Wheat Wrap",side:"Carrot sticks",snack:"Orange",drink:"Water",calories:510,protein:22,carbs:70,fat:13,fiber:12,tag:"High protein",ingredients:"kidney beans,wheat,carrot,orange,tomato",minutes:25,budget:"Low"},
    {name:"Paneer Veg Roti Roll",side:"Cucumber",snack:"Apple",drink:"Water",calories:520,protein:26,carbs:52,fat:20,fiber:7,tag:"High protein",ingredients:"paneer,milk,wheat,cucumber,apple",minutes:20,budget:"Moderate"},
    {name:"Chole Salad Box",side:"Whole-wheat roti",snack:"Amla/guava",drink:"Water",calories:500,protein:20,carbs:69,fat:12,fiber:12,tag:"Budget friendly",ingredients:"chickpeas,wheat,cucumber,tomato,guava",minutes:22,budget:"Low"}
  ],
  "South Indian":[
    {name:"Mini Idli + Thick Sambar",side:"Cucumber",snack:"Banana",drink:"Water",calories:470,protein:17,carbs:76,fat:8,fiber:9,tag:"No reheating",ingredients:"rice,urad dal,toor dal,cucumber,banana",minutes:20,budget:"Low"},
    {name:"Adai Roll",side:"Carrot sticks",snack:"Orange",drink:"Water",calories:490,protein:21,carbs:66,fat:14,fiber:11,tag:"High protein",ingredients:"lentils,rice,carrot,orange",minutes:30,budget:"Low"},
    {name:"Lemon Rice + Chana Sundal",side:"Cucumber",snack:"Guava",drink:"Water",calories:520,protein:18,carbs:78,fat:13,fiber:10,tag:"Budget friendly",ingredients:"rice,lemon,chickpeas,cucumber,guava",minutes:25,budget:"Low"},
    {name:"Ragi Dosa Roll",side:"Vegetable filling",snack:"Banana",drink:"Water",calories:480,protein:15,carbs:70,fat:13,fiber:10,tag:"Mess-free",ingredients:"ragi,rice,carrot,peas,banana",minutes:30,budget:"Low"}
  ],
  "East Indian":[
    {name:"Sattu Roti Roll",side:"Cucumber",snack:"Orange",drink:"Water",calories:500,protein:20,carbs:71,fat:12,fiber:11,tag:"Budget friendly",ingredients:"roasted chickpea flour,wheat,cucumber,orange",minutes:20,budget:"Low"},
    {name:"Chirer Vegetable Box",side:"Roasted chana",snack:"Guava",drink:"Water",calories:470,protein:17,carbs:73,fat:10,fiber:10,tag:"No reheating",ingredients:"flattened rice,peas,carrot,chickpeas,guava",minutes:15,budget:"Low"},
    {name:"Masoor Dal Roti Roll",side:"Carrot",snack:"Amla/fruit",drink:"Water",calories:500,protein:22,carbs:68,fat:12,fiber:12,tag:"High protein",ingredients:"masoor dal,wheat,carrot,fruit",minutes:25,budget:"Low"},
    {name:"Vegetable Khichuri Box",side:"Cucumber",snack:"Apple",drink:"Water",calories:490,protein:17,carbs:72,fat:10,fiber:9,tag:"Can reheat",ingredients:"moong dal,rice,peas,carrot,cucumber,apple",minutes:30,budget:"Low"}
  ],
  "West Indian":[
    {name:"Methi Thepla Roll",side:"Cucumber",snack:"Guava",drink:"Water",calories:470,protein:14,carbs:65,fat:15,fiber:9,tag:"Mess-free",ingredients:"wheat,fenugreek,cucumber,guava",minutes:20,budget:"Low"},
    {name:"Matki Usal Roti Box",side:"Carrot",snack:"Orange",drink:"Water",calories:520,protein:23,carbs:72,fat:13,fiber:13,tag:"High protein",ingredients:"moth beans,wheat,carrot,orange",minutes:30,budget:"Low"},
    {name:"Vegetable Dhokla Box",side:"Cucumber",snack:"Apple",drink:"Water",calories:470,protein:18,carbs:65,fat:12,fiber:8,tag:"No reheating",ingredients:"chickpea flour,yogurt,milk,cucumber,apple",minutes:30,budget:"Low"},
    {name:"Jowar Bhakri + Dal",side:"Dry vegetable",snack:"Guava",drink:"Water",calories:510,protein:21,carbs:70,fat:13,fiber:12,tag:"Can reheat",ingredients:"sorghum,lentils,carrot,guava",minutes:35,budget:"Low"}
  ],
  "United States":[
    {name:"Black Bean Whole-Grain Wrap",side:"Carrot sticks",snack:"Apple",drink:"Water",calories:500,protein:20,carbs:70,fat:13,fiber:13,tag:"Mess-free",ingredients:"black beans,wheat,carrot,apple",minutes:15,budget:"Low"},
    {name:"Quinoa Chickpea Bowl",side:"Cucumber",snack:"Berries",drink:"Water",calories:520,protein:21,carbs:67,fat:16,fiber:12,tag:"High protein",ingredients:"quinoa,chickpeas,cucumber,berries",minutes:20,budget:"Moderate"},
    {name:"Hummus Veg Sandwich",side:"Carrot",snack:"Banana",drink:"Water",calories:480,protein:17,carbs:66,fat:14,fiber:10,tag:"No reheating",ingredients:"chickpeas,wheat,cucumber,carrot,banana",minutes:10,budget:"Moderate"},
    {name:"Tofu Grain Bowl",side:"Broccoli",snack:"Apple",drink:"Water",calories:510,protein:27,carbs:55,fat:18,fiber:10,tag:"High protein",ingredients:"tofu,soy,quinoa,broccoli,apple",minutes:25,budget:"Premium"}
  ],
  "United Kingdom":[
    {name:"Chickpea Wholemeal Sandwich",side:"Carrot",snack:"Apple",drink:"Water",calories:480,protein:19,carbs:65,fat:14,fiber:11,tag:"No reheating",ingredients:"chickpeas,wheat,carrot,apple",minutes:12,budget:"Low"},
    {name:"Baked Bean Potato Box",side:"Cucumber",snack:"Orange",drink:"Water",calories:500,protein:18,carbs:78,fat:9,fiber:12,tag:"Can reheat",ingredients:"potato,beans,tomato,cucumber,orange",minutes:30,budget:"Low"},
    {name:"Lentil Soup Flask + Bread",side:"Carrot",snack:"Apple",drink:"Water",calories:490,protein:21,carbs:68,fat:11,fiber:13,tag:"High protein",ingredients:"lentils,carrot,wheat,apple",minutes:25,budget:"Low"},
    {name:"White Bean Veg Wrap",side:"Cucumber",snack:"Berries",drink:"Water",calories:490,protein:20,carbs:62,fat:14,fiber:12,tag:"Mess-free",ingredients:"white beans,wheat,cucumber,berries",minutes:15,budget:"Moderate"}
  ],
  "Italy":[
    {name:"Chickpea Tomato Panino",side:"Cucumber",snack:"Apple",drink:"Water",calories:490,protein:19,carbs:64,fat:15,fiber:10,tag:"No reheating",ingredients:"chickpeas,tomato,wheat,cucumber,apple",minutes:12,budget:"Low"},
    {name:"Whole-Wheat Pasta Primavera Box",side:"Carrot",snack:"Orange",drink:"Water",calories:520,protein:20,carbs:75,fat:13,fiber:11,tag:"Can reheat",ingredients:"wheat,pasta,broccoli,tomato,carrot,orange",minutes:25,budget:"Low"},
    {name:"Tuscan White Bean Bowl",side:"Whole-grain bread",snack:"Berries",drink:"Water",calories:500,protein:24,carbs:65,fat:14,fiber:14,tag:"High protein",ingredients:"white beans,spinach,tomato,wheat,berries",minutes:25,budget:"Moderate"},
    {name:"Lentil Bolognese Pasta",side:"Cucumber",snack:"Apple",drink:"Water",calories:530,protein:25,carbs:76,fat:12,fiber:13,tag:"High protein",ingredients:"lentils,tomato,wheat,pasta,cucumber,apple",minutes:30,budget:"Low"}
  ],
  "Japan":[
    {name:"Tofu Rice Bento",side:"Cucumber",snack:"Fruit",drink:"Water",calories:490,protein:22,carbs:67,fat:13,fiber:8,tag:"Mess-free",ingredients:"tofu,soy,rice,cucumber,fruit",minutes:20,budget:"Moderate"},
    {name:"Edamame Rice Bowl",side:"Carrot",snack:"Apple",drink:"Water",calories:500,protein:21,carbs:70,fat:12,fiber:10,tag:"High protein",ingredients:"soy,edamame,rice,carrot,apple",minutes:18,budget:"Moderate"},
    {name:"Vegetable Soba Box",side:"Cucumber",snack:"Orange",drink:"Water",calories:480,protein:17,carbs:67,fat:13,fiber:9,tag:"No reheating",ingredients:"buckwheat,wheat,soy,cucumber,orange",minutes:20,budget:"Moderate"},
    {name:"Ginger Tofu Bento",side:"Cabbage",snack:"Fruit",drink:"Water",calories:500,protein:24,carbs:58,fat:17,fiber:9,tag:"High protein",ingredients:"tofu,soy,rice,cabbage,fruit",minutes:25,budget:"Moderate"}
  ],
  "Mexico":[
    {name:"Black Bean Corn Tacos",side:"Cucumber",snack:"Orange",drink:"Water",calories:490,protein:20,carbs:70,fat:12,fiber:13,tag:"Mess-free",ingredients:"corn,black beans,tomato,cucumber,orange",minutes:15,budget:"Low"},
    {name:"Bean Burrito Bowl",side:"Carrot",snack:"Apple",drink:"Water",calories:520,protein:21,carbs:76,fat:13,fiber:14,tag:"Can reheat",ingredients:"rice,black beans,corn,tomato,carrot,apple",minutes:25,budget:"Low"},
    {name:"Quinoa Fajita Box",side:"Cucumber",snack:"Fruit",drink:"Water",calories:510,protein:21,carbs:64,fat:16,fiber:11,tag:"High protein",ingredients:"quinoa,pepper,black beans,cucumber,fruit",minutes:25,budget:"Moderate"},
    {name:"Pinto Bean Tacos",side:"Lettuce",snack:"Orange",drink:"Water",calories:490,protein:20,carbs:68,fat:13,fiber:12,tag:"Budget friendly",ingredients:"corn,pinto beans,lettuce,tomato,orange",minutes:20,budget:"Low"}
  ]
};
// V32: genuinely different meal catalogs for the school, college and office use cases.
const LUNCHBOX_CONTEXT_EXTRAS={
  School:[
    {name:"Mini vegetable uttapam bites",side:"Cucumber coins",snack:"Banana",drink:"Water",calories:385,protein:13,carbs:60,fat:10,fiber:7,tag:"Mess-free",ingredients:"rice,urad dal,carrot,cucumber,banana",minutes:18,budget:"Low"},
    {name:"Soft moong dal pancake triangles",side:"Carrot sticks",snack:"Apple",drink:"Water",calories:395,protein:18,carbs:53,fat:10,fiber:8,tag:"Mess-free",ingredients:"moong dal,carrot,apple",minutes:15,budget:"Low"},
    {name:"Rainbow chickpea pita pockets",side:"Cucumber",snack:"Orange",drink:"Water",calories:425,protein:16,carbs:64,fat:11,fiber:10,tag:"No reheating",ingredients:"chickpeas,wheat,cucumber,carrot,orange",minutes:12,budget:"Low"},
    {name:"Baked sweet potato bean patties",side:"Tomato-free salad",snack:"Guava",drink:"Water",calories:420,protein:15,carbs:61,fat:12,fiber:11,tag:"Mess-free",ingredients:"sweet potato,black beans,cucumber,guava",minutes:30,budget:"Low"}
  ],
  College:[
    {name:"Spicy-free tofu burrito bowl",side:"Corn salad",snack:"Apple",drink:"Water",calories:575,protein:28,carbs:74,fat:16,fiber:13,tag:"High protein",ingredients:"tofu,soy,rice,black beans,corn,apple",minutes:25,budget:"Moderate"},
    {name:"Chickpea quinoa power jar",side:"Roasted vegetables",snack:"Orange",drink:"Water",calories:560,protein:23,carbs:69,fat:17,fiber:13,tag:"High protein",ingredients:"quinoa,chickpeas,carrot,broccoli,orange",minutes:20,budget:"Moderate"},
    {name:"Masoor dal rice energy box",side:"Carrot",snack:"Banana",drink:"Water",calories:595,protein:23,carbs:91,fat:11,fiber:14,tag:"Budget friendly",ingredients:"masoor dal,rice,carrot,banana",minutes:30,budget:"Low"},
    {name:"Egg vegetable grain wrap",side:"Cucumber",snack:"Apple",drink:"Water",calories:550,protein:29,carbs:61,fat:18,fiber:9,tag:"High protein",ingredients:"egg,wheat,spinach,cucumber,apple",minutes:20,budget:"Moderate",diet:"Non-Vegetarian"}
  ],
  Office:[
    {name:"Mediterranean lentil desk salad",side:"Wholegrain toast",snack:"Berries",drink:"Water",calories:485,protein:23,carbs:60,fat:14,fiber:15,tag:"No reheating",ingredients:"lentils,cucumber,olive oil,wheat,berries",minutes:15,budget:"Moderate"},
    {name:"Thermos vegetable barley soup",side:"Bean toast",snack:"Apple",drink:"Water",calories:470,protein:21,carbs:69,fat:11,fiber:13,tag:"Can reheat",ingredients:"barley,carrot,white beans,wheat,apple",minutes:30,budget:"Low"},
    {name:"Tofu broccoli workday bowl",side:"Brown rice",snack:"Orange",drink:"Water",calories:520,protein:30,carbs:62,fat:16,fiber:11,tag:"High protein",ingredients:"tofu,soy,broccoli,brown rice,orange",minutes:25,budget:"Moderate"},
    {name:"Black bean office grain salad",side:"Carrot",snack:"Guava",drink:"Water",calories:480,protein:22,carbs:67,fat:12,fiber:15,tag:"No reheating",ingredients:"black beans,quinoa,carrot,guava",minutes:20,budget:"Moderate"}
  ]
};
function lunchboxContextFit(x,p){
  if(state.lunchboxFor==="School")return /mini|bites|triangles|pockets|patties|roll|idli|dhokla|thepla|sandwich|uttapam/i.test(x.name)?20:-10;
  if(state.lunchboxFor==="College")return x.protein>=20?16:((x.calories||0)>=480?10:-6);
  return /salad|soup|bowl|flask|desk|workday|office|grain/i.test(x.name)?18:-8;
}
function lunchboxDietAdapt(item,p){
  const x={...item};
  if(p.diet==="Vegan"){
    x.name=x.name.replace(/Paneer/gi,"Tofu").replace(/Yogurt/gi,"Plant Yogurt");
    x.ingredients=x.ingredients.replace(/paneer/gi,"tofu").replace(/yogurt|milk/gi,"soy");
  }
  if(p.diet==="Non-Vegetarian" && /wrap|roll|sandwich/i.test(x.name) && !/egg|chicken|fish/i.test(x.name)){
    // One explicit non-vegetarian variation makes the preference affect ranking without forcing meat into every box.
    if(profileModeScore(x,p)>0 && (state.lunchboxVariant||0)%2===1){
      x.name="Egg + "+x.name;
      x.ingredients="egg,"+x.ingredients;
      x.calories+=70;x.protein+=6;x.fat+=5;
    }
  }
  return x;
}
function setLunchboxOption(kind,val){state[kind]=val;state.lunchboxGenerated=false;state.lunchboxPacked="";render()}
function generateLunchbox(){state.lunchboxGenerated=true;render()}
function regenerateLunchbox(){state.lunchboxVariant=(state.lunchboxVariant+1)%6;state.lunchboxGenerated=true;state.lunchboxPacked="";render()}
function lunchboxResults(p){
  const key=effectiveRegionLabel(p)==="Pan-Indian"?NUTRIAI_INDIAN_REGIONS[(state.lunchboxVariant||0)%NUTRIAI_INDIAN_REGIONS.length]:effectiveRegionLabel(p);
  let regionItems=(LUNCHBOX_BY_REGION[key]||LUNCHBOX_BY_REGION["North Indian"]);
  let contextItems=LUNCHBOX_CONTEXT_EXTRAS[state.lunchboxFor]||[];
  // Different contexts have their own catalog, supplemented by regional recipes.
  let items=[...contextItems,...regionItems].filter(x=>!x.diet||x.diet===p.diet).map(x=>lunchboxDietAdapt(x,p));
  items=items.filter(x=>!hasListedAllergen(x,p.allergies));
  const maxBudget=NUTRIAI_BUDGET_ORDER[p.budget]??1;
  items=items.filter(x=>(NUTRIAI_BUDGET_ORDER[x.budget]??0)<=maxBudget);
  const target=Number(state.lunchboxTime||10);
  items=items.map(x=>{
    let score=profileModeScore(x,p);
    score-=Math.abs(x.minutes-target)*1.2;
    score+=lunchboxContextFit(x,p);
    if(x.minutes>target+8)score-=14;
    if(x.tag===state.lunchboxPref)score+=12;
    if(state.lunchboxPref==="High protein"&&x.protein>=20)score+=8;
    if(state.lunchboxPref==="Budget friendly"&&x.budget==="Low")score+=8;
    if(state.lunchboxPref==="Mess-free"&&/wrap|roll|sandwich|bento|taco/i.test(x.name))score+=6;
    return {...x,score:Math.round(score)};
  }).sort((a,b)=>b.score-a.score);
  const v=state.lunchboxVariant||0;
  const context=items.filter(x=>contextItems.some(y=>y.name===x.name));
  const selected=context.length>=2?[...context,...items.filter(x=>!context.includes(x))]:items;
  const chosen=selected.length?Array.from({length:Math.min(3,selected.length)},(_,i)=>selected[(v+i)%selected.length]):[];
  return chosen.map(x=>[x.name,x.side,x.snack,x.drink,x.calories,x.protein,x.tag,x.ingredients,x.minutes,x.budget,x.fiber,x.carbs,x.fat,x.score]);
}
function packLunchbox(i){const r=lunchboxResults(state.profile)[i];state.selectedLunchbox=r?{name:r[0],ingredients:r[7]}:null;state.lunchboxPacked=r?`Packed ${r[0]} — personalized for ${effectiveRegionLabel(state.profile)}, ${state.profile.diet}, ${state.profile.goal} and your selected restrictions.`:"";render()}
function lunchboxAddGrocery(i){
  const r=lunchboxResults(state.profile)[i];if(!r)return;
  state.groceryExtras=state.groceryExtras||[];
  state.groceryExtras.push({name:r[0],ingredients:r[7]});
  state.lunchboxPacked="Added ingredients for "+r[0]+" to Grocery. Open Grocery to see them.";render();
}
