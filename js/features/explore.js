function escapeNutriText(s){
  return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}
function setIngredientDraft(value){
  state.ingredientDraft=value;
  const btn=document.getElementById("ingredientGenerateBtn");
  if(btn){
    const ready=state.ingredients.length>0 || value.trim().length>0;
    btn.disabled=!ready;
    btn.classList.toggle("ready",ready);
  }
}
function pushIngredientText(raw){
  String(raw||"").split(",").map(function(x){return x.trim()}).filter(Boolean).forEach(function(item){
    if(!state.ingredients.some(function(x){return x.toLowerCase()===item.toLowerCase()})){
      state.ingredients.push(item);
    }
  });
}
function addIngredient(v){
  const input=document.getElementById("ingredientInput");
  const raw=(v!==undefined?v:(input?input.value:state.ingredientDraft)).trim();
  if(!raw)return;
  pushIngredientText(raw);
  state.ingredientDraft="";
  state.ingredientMeals=null;
  render();
}
function removeIngredient(v){
  state.ingredients=state.ingredients.filter(function(x){return x!==v});
  state.ingredientMeals=null;
  render();
}
function generateIngredientMeals(){
  if(state.ingredientDraft.trim()){
    pushIngredientText(state.ingredientDraft);
    state.ingredientDraft="";
  }
  if(!state.ingredients.length){toast("Add or type at least one ingredient.");return;}

  const p=state.profile;
  const db=base44MealPools(p)||{breakfasts:[],lunches:[],dinners:[],snacks:[]};
  const query=state.ingredients.map(function(x){return x.toLowerCase()});
  const groups=[
    ["Breakfast",db.breakfasts||[]],
    ["Lunch",db.lunches||[]],
    ["Dinner",db.dinners||[]],
    ["Snack",db.snacks||[]]
  ];

  state.ingredientMeals=groups.map(function(group,index){
    const label=group[0], pool=group[1];
    let best=null, bestScore=-1;

    pool.forEach(function(meal){
      const hay=(String(meal.name||"")+" "+(meal.nutrients||[]).join(" ")).toLowerCase();
      let score=0;
      query.forEach(function(q){if(hay.indexOf(q)!==-1)score++});
      if(score>bestScore){best=meal;bestScore=score}
    });

    if(!best && pool.length)best=pool[index%pool.length];

    if(!best){
      const nameMap={
        Breakfast:"Kitchen Ingredient Breakfast Bowl",
        Lunch:"Balanced Ingredient Lunch Bowl",
        Dinner:"Light Ingredient Dinner",
        Snack:"Simple Ingredient Snack"
      };
      best={
        name:nameMap[label],
        calories:"—",protein:"—",carbs:"—",fat:"—",fiber:"—",
        portion:"Use a comfortable serving",
        nutrients:[],
        reason:"A simple meal idea built from the ingredients you entered."
      };
    }

    return {
      label:label,
      meal:best,
      score:Math.max(0,bestScore)
    };
  });
  render();
}

function setRestaurant(v,type){
  state.restaurantChoice=v;
  state.restaurantType=type;
  state.restaurantText="";
  state.restaurantGenerated=false;
  render();
}
function setRestaurantText(value){
  state.restaurantText=value;
  state.restaurantGenerated=false;
  const btn=document.getElementById("restaurantGenerateBtn");
  if(btn){
    const chosen=value.trim() || state.restaurantChoice;
    btn.disabled=!chosen;
    btn.classList.toggle("ready",!!chosen);
    btn.textContent="✨ Get Healthy Options for "+(chosen||"your restaurant");
  }
}
function restaurantName(){
  return (state.restaurantText||"").trim() || state.restaurantChoice || "";
}
function restaurantGuide(p){
  const chosen=restaurantName();
  const lower=chosen.toLowerCase();
  let best, alternative, watch;

  if(lower.indexOf("domino")!==-1 || lower.indexOf("pizza")!==-1 || lower.indexOf("italian")!==-1){
    best="Vegetable pizza in a smaller portion, with extra vegetables if available";
    alternative="Pair 1–2 slices with a salad or another vegetable side rather than ordering extra sides.";
    watch="Large portions, stuffed crust, extra cheese, sugary drinks and dessert can quickly increase calories, sodium and added sugar.";
  }else if(lower.indexOf("subway")!==-1){
    best="Vegetable/protein sub with plenty of vegetables and sauce on the side";
    alternative="Choose whole-grain bread when available and add a protein source that fits your diet.";
    watch="Large portions, creamy sauces, processed meats and sweetened drinks.";
  }else if(lower.indexOf("starbucks")!==-1 || lower.indexOf("coffee")!==-1){
    best="Unsweetened or lightly sweetened drink plus a protein-containing snack";
    alternative="Choose plain coffee/tea or a lower-added-sugar beverage and check snack portion size.";
    watch="Syrups, whipped toppings and large blended drinks can contain substantial added sugar.";
  }else if(lower.indexOf("mcdonald")!==-1 || lower.indexOf("burger king")!==-1 || lower.indexOf("kfc")!==-1){
    best="Smaller main with vegetables or salad where available";
    alternative="Choose grilled or less-fried options when available and keep sauces on the side.";
    watch="Large fried meals, oversized sides, sugary drinks and extra sauces.";
  }else if(lower.indexOf("south indian")!==-1){
    best="Idli with sambar, or dosa with sambar and vegetable sides";
    alternative="Use sambar and vegetables to add protein/fiber and keep fried sides occasional.";
    watch="Large portions of fried items and heavily sweetened beverages.";
  }else if(lower.indexOf("north indian")!==-1 || lower.indexOf("haldiram")!==-1 || lower.indexOf("mughlai")!==-1){
    best="Dal + vegetable sabzi + roti, or a grilled/tandoori option";
    alternative="Add salad/curd if suitable and request less oil when possible.";
    watch="Deep-fried starters, very creamy gravies and oversized bread/rice portions.";
  }else{
    best=(p.diet==="Non-Vegetarian"?"Grilled protein":"Vegetable + plant/dairy protein")+" with vegetables and a moderate grain portion";
    alternative="Choose vegetables first, add a protein source, and keep sauces/dressings moderate.";
    watch="Very large portions, heavily fried foods and sugary drinks.";
  }

  return {
    best:best,
    alternative:alternative,
    watch:watch,
    drink:"Water or an unsweetened drink is the simplest default choice.",
    tip:p.goal==="Weight Loss"
      ?"Start with a moderate portion and eat slowly before deciding whether you need more."
      :"Build a balanced plate and adjust portion size to your hunger and activity.",
    disclaimer:"Restaurant menus, recipes and nutrition vary by outlet. Check the current menu for allergens and exact nutrition information."
  };
}
function restaurantOptions(p){
  const g=restaurantGuide(p);
  return {name:restaurantName()||"your selection",base:[
    ["Best balanced pick",g.best],
    ["Smarter alternative",g.alternative],
    ["Drink",g.drink],
    ["Portion tip",g.tip]
  ]};
}
function restaurantGenerate(){
  if(!restaurantName()){toast("Choose or type a restaurant first.");return;}
  state.restaurantGenerated=true;
  render();
}
function selectFestival(v){state.festival=v;render()}
function festivalAdvice(v,p){
  const m={
    "Diwali":["Enjoy sweets in small portions and avoid grazing all day.","Pair festive snacks with a regular protein-rich meal.","Choose roasted/baked snacks more often than deep-fried ones."],
    "Holi":["Stay hydrated through the day.","Choose homemade thandai with less added sugar if desired.","Balance festive foods with fruit, curd, vegetables and protein."],
    "Navratri":["Use singhara/kuttu/ragi-style foods with vegetables rather than only fried fasting foods.","Include curd, paneer, milk or plant proteins where appropriate.","Keep hydration regular during fasting periods."],
    "Eid":["Enjoy celebratory foods mindfully and spread richer dishes across meals.","Add salad, fruit and grilled dishes alongside biryani/kebabs.","Keep sweet drinks and desserts to moderate portions."],
    "Christmas":["Balance rich festive meals with vegetables and leaner protein options.","Choose fruit-based desserts sometimes.","Avoid skipping meals to compensate for celebration foods."],
    "Pongal":["Use lentils and vegetables with rice-based dishes for a more balanced plate.","Keep added ghee moderate if that fits your goals.","Include fresh fruit and curd where appropriate."],
    "Onam":["Enjoy the sadya variety but keep portions comfortable.","Prioritize vegetables, lentils and less-fried dishes first.","Treat sweets as part of the celebration, not an all-day snack."],
    "Baisakhi":["Pair festive breads/rice dishes with dal, vegetables and curd.","Choose grilled/tandoori preparations more often than fried starters.","Keep sugary beverages occasional."]
  };
  return m[v]||["Select a festival to see personalized guidance."];
}
const ecoEstimates={
  "Chicken Biryani":3.2,
  "Veg Dal Rice":0.9,
  "Paneer Butter Masala":2.1,
  "Tofu Stir Fry":0.8,
  "Beef Burger":5.0,
  "Salad Bowl":0.5
};
function ecoPreset(v,which){if(which==="a")state.ecoA=v;else state.ecoB=v;state.ecoResult=null;render()}
function calculateEco(){
  const a=(document.getElementById("ecoA")?.value||state.ecoA).trim();
  const b=(document.getElementById("ecoB")?.value||state.ecoB).trim();
  if(!a){alert("Enter Meal A.");return;}
  state.ecoA=a;state.ecoB=b;
  const score=name=>{
    if(ecoEstimates[name]!==undefined)return ecoEstimates[name];
    const n=name.toLowerCase();
    if(n.includes("beef"))return 5;
    if(n.includes("chicken"))return 3;
    if(n.includes("paneer")||n.includes("cheese"))return 2.2;
    if(n.includes("tofu")||n.includes("dal")||n.includes("lentil"))return .9;
    if(n.includes("salad")||n.includes("vegetable"))return .6;
    return 1.5;
  };
  state.ecoResult={a:{name:a,val:score(a)},b:b?{name:b,val:score(b)}:null};
  render();
}
