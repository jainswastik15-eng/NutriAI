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
const FESTIVALS_BY_PROFILE={
  "Pan-Indian":[["Diwali","🪔","Festival of Lights"],["Holi","🎨","Festival of Colors"],["Navratri","🕉️","Nine Nights"],["Eid","🌙","Eid Celebration"],["Christmas","🎄","Christmas Feast"]],
  "North Indian":[["Diwali","🪔","Festival of Lights"],["Holi","🎨","Festival of Colors"],["Navratri","🕉️","Nine Nights"],["Baisakhi","🌻","Punjab Harvest"],["Lohri","🔥","Winter Harvest"]],
  "South Indian":[["Pongal","🌾","Tamil Harvest"],["Onam","🌺","Kerala Celebration"],["Ugadi","🌿","New Year Festival"],["Deepavali","🪔","Festival of Lights"],["Vishu","🌼","Kerala New Year"]],
  "East Indian":[["Durga Puja","🌺","Autumn Celebration"],["Chhath Puja","☀️","Sun Festival"],["Rath Yatra","🛕","Chariot Festival"],["Poila Boishakh","🌿","Bengali New Year"],["Diwali","🪔","Festival of Lights"]],
  "West Indian":[["Ganesh Chaturthi","🐘","Ganesh Festival"],["Navratri","💃","Nine Nights"],["Gudi Padwa","🌿","Maharashtrian New Year"],["Diwali","🪔","Festival of Lights"],["Uttarayan","🪁","Kite Festival"]],
  "United States":[["Thanksgiving","🦃","Thanksgiving Meal"],["Christmas","🎄","Christmas Feast"],["Independence Day","🎆","Summer Celebration"],["Halloween","🎃","Halloween Treats"],["New Year","✨","New Year Celebration"]],
  "United Kingdom":[["Christmas","🎄","Christmas Feast"],["Easter","🐣","Easter Celebration"],["Bonfire Night","🎆","Bonfire Night"],["New Year","✨","New Year Celebration"],["Summer Bank Holiday","🌤️","Holiday Gathering"]],
  "Italy":[["Christmas","🎄","Natale"],["Easter","🐣","Pasqua"],["Ferragosto","☀️","Summer Holiday"],["Carnival","🎭","Carnevale"],["New Year","✨","Capodanno"]],
  "Japan":[["New Year","🎍","Shōgatsu"],["Hanami","🌸","Cherry Blossom Season"],["Obon","🏮","Obon Festival"],["Tanabata","🎋","Star Festival"],["Setsubun","👹","Seasonal Festival"]],
  "Mexico":[["Day of the Dead","💀","Día de Muertos"],["Independence Day","🎆","Fiestas Patrias"],["Christmas","🎄","Navidad"],["Three Kings Day","👑","Día de Reyes"],["Cinco de Mayo","🎉","Cultural Celebration"]]
};
function festivalProfileKey(p){return p.region==="International"?(p.country||"United States"):(p.region||"Pan-Indian")}
function festivalOptionsForProfile(p){return FESTIVALS_BY_PROFILE[festivalProfileKey(p)]||FESTIVALS_BY_PROFILE["Pan-Indian"]}
function selectFestival(v){state.festival=v;render()}
function festivalAdvice(v,p){
  const specific={
    "Diwali":["Keep sweets as planned portions instead of grazing all day.","Pair festive snacks with a normal protein-rich meal.","Choose roasted or baked snacks more often when practical."],
    "Deepavali":["Enjoy sweets in small planned portions.","Balance rice-based festive foods with dal, vegetables and protein.","Keep fried snacks occasional rather than continuous."],
    "Holi":["Stay hydrated through the day.","Use less-added-sugar versions of festive drinks when practical.","Balance festive foods with fruit, curd or a plant alternative and protein."],
    "Navratri":["Build fasting meals around vegetables plus a protein source.","Use kuttu/singhara-style foods without relying only on fried items.","Keep hydration regular during fasting periods."],
    "Baisakhi":["Pair breads or rice with dal, vegetables and curd or alternatives.","Choose grilled/tandoori dishes more often than fried starters.","Keep sweet drinks occasional."],
    "Lohri":["Portion sesame and jaggery sweets because they are energy dense.","Include a balanced main meal instead of only snacks.","Use roasted foods and nuts/seeds only if they fit your allergy profile."],
    "Pongal":["Use lentils and vegetables with rice-based dishes for a more balanced plate.","Keep added ghee moderate if that fits your goal.","Include fresh fruit and curd or a plant alternative where appropriate."],
    "Onam":["Enjoy the sadya variety while keeping portions comfortable.","Prioritize vegetables, lentils and less-fried dishes first.","Treat sweets as part of the celebration, not an all-day snack."],
    "Ugadi":["Balance festive rice dishes with dal, vegetables and protein.","Keep sweets portioned.","Use your normal hydration routine through the day."],
    "Vishu":["Enjoy the feast variety while keeping portions comfortable.","Prioritize vegetable and lentil dishes.","Keep rich desserts to a planned portion."],
    "Durga Puja":["Choose one or two favorite festive foods rather than sampling everything repeatedly.","Add vegetables and protein to the main meal.","Keep hydration regular during long outings."],
    "Chhath Puja":["Plan balanced meals around fasting periods.","Rehydrate steadily after fasting.","Keep sweets and fried offerings to comfortable portions."],
    "Rath Yatra":["Choose simple balanced meals around travel or crowds.","Carry water and a safe snack if needed.","Keep portion sizes comfortable in hot weather."],
    "Poila Boishakh":["Balance rice and festive dishes with dal, vegetables and protein.","Keep sweets as a planned portion.","Choose grilled or lightly cooked options when available."],
    "Ganesh Chaturthi":["Enjoy modak in a planned portion.","Balance the rest of the meal with vegetables and protein.","Choose steamed options more often than fried versions where practical."],
    "Gudi Padwa":["Pair festive foods with a balanced main meal.","Keep sweets portioned.","Include vegetables, pulses and hydration through the day."],
    "Uttarayan":["Use portable balanced snacks for long outdoor celebrations.","Stay hydrated.","Keep fried snacks and sweets to planned portions."],
    "Thanksgiving":["Start with vegetables and protein before larger starch portions.","Choose one favorite dessert portion.","Use leftovers in balanced meals rather than continuous snacking."],
    "Independence Day":["Plan grilled or baked options with vegetables.","Keep sugary drinks occasional.","Use safe food storage for outdoor meals."],
    "Halloween":["Choose a small planned amount of candy.","Eat a normal meal before treats.","Keep sweets away from continuous grazing."],
    "Christmas":["Balance rich festive meals with vegetables and protein.","Choose a favorite dessert rather than multiple large portions.","Keep regular meals instead of skipping food to compensate."],
    "Easter":["Keep chocolate and desserts to planned portions.","Build the main meal around vegetables and protein.","Use leftovers safely and mindfully."],
    "Bonfire Night":["Choose a warm balanced meal before snacks.","Keep sweet drinks and desserts moderate.","Stay hydrated even in cool weather."],
    "Ferragosto":["Keep outdoor meals balanced with vegetables and protein.","Use safe refrigeration in hot weather.","Keep desserts and sugary drinks moderate."],
    "Carnival":["Enjoy a favorite treat in a planned portion.","Keep normal meals around celebrations.","Balance richer foods with vegetables and protein."],
    "New Year":["Keep celebration foods in planned portions.","Alternate sweet drinks with water or unsweetened options.","Return to normal meals the next day instead of extreme restriction."],
    "Hanami":["Pack a balanced bento-style meal with vegetables and protein.","Keep sweets and refined snacks to planned portions.","Use safe food storage outdoors."],
    "Obon":["Choose balanced family meals with vegetables and protein.","Keep sweets moderate.","Stay hydrated during travel and gatherings."],
    "Tanabata":["Pair noodle or rice dishes with vegetables and protein.","Keep sugary festival snacks occasional.","Hydrate regularly in warm weather."],
    "Setsubun":["Keep bean portions comfortable and balance the rest of the meal.","Choose simple vegetable and protein dishes.","Follow your allergy restrictions carefully."],
    "Day of the Dead":["Enjoy traditional sweets and breads in planned portions.","Balance celebration meals with beans, vegetables and protein.","Keep hydration regular."],
    "Three Kings Day":["Enjoy rosca in a planned portion.","Pair it with a balanced meal rather than replacing meals with sweets.","Keep sugary drinks moderate."],
    "Cinco de Mayo":["Choose bean, vegetable and grilled protein dishes.","Keep fried foods and sugary drinks moderate.","Use sensible portions for chips and dips."]
  };
  const tips=(specific[v]||["Keep portions comfortable and build the rest of the day around balanced meals.","Prioritize vegetables, protein and hydration.","Enjoy traditional foods without trying to make celebration eating perfect."]).slice();
  if(p.diet==="Vegan")tips.push("Choose plant-based versions and verify dairy/egg ingredients in festive foods.");
  if(allergenTokens(p.allergies).length)tips.push(`Avoid entered allergens (${allergenTokens(p.allergies).join(", ")}) and verify recipes, labels and cross-contact.`);
  if((p.conditions||[]).some(x=>/diabet|pcos|pcod/i.test(x)))tips.push("Pair carbohydrate-rich festive foods with protein/fiber and keep portions consistent with your care plan.");
  if((p.conditions||[]).some(x=>/hypertension|high bp|blood pressure/i.test(x)))tips.push("Limit heavily salted packaged snacks and added salt where practical.");
  if(p.budget==="Low")tips.push("Use homemade versions and seasonal ingredients to keep the celebration budget-friendly.");
  return tips.slice(0,6);
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
