const CRAVING_DATA={
  "Sweet":[
    ["Banana Yogurt Bowl",320,18,"Sweet, creamy and fruit-based.","10 min"],
    ["Apple Cinnamon Oats",300,12,"Naturally sweet with fiber and warm cinnamon.","12 min"],
    ["Fruit + Curd Cup",220,11,"A light sweet option with fruit and protein.","5 min"],
    ["Date-Nut Milk Bowl",280,10,"Sweetness from dates with nuts for texture.","5 min"],
    ["Banana Peanut Toast",340,14,"Sweet and filling with a protein boost.","7 min"]
  ],
  "Salty":[
    ["Roasted Chana Chaat",240,14,"Savory, crunchy and portable.","8 min"],
    ["Masala Corn Cup",230,8,"Warm, salty and easy to prepare.","10 min"],
    ["Paneer Cucumber Bites",270,20,"Savory and high in protein.","10 min"],
    ["Veg Poha Cup",300,10,"Light savory comfort food.","15 min"],
    ["Hummus Veg Plate",260,12,"Salty, creamy and fiber-rich.","8 min"]
  ],
  "Spicy":[
    ["Spicy Paneer Wrap",390,24,"Spicy flavor with a protein-rich filling.","15 min"],
    ["Chilli Tofu Bowl",360,25,"Bold flavor and plant protein.","18 min"],
    ["Masala Moong Chilla",320,18,"Spicy, filling and easy to customize.","15 min"],
    ["Rajma Salsa Bowl",370,18,"Spicy beans with fresh vegetables.","15 min"],
    ["Spiced Corn Chaat",250,8,"Tangy, spicy and quick.","8 min"]
  ],
  "Crunchy":[
    ["Roasted Makhana Mix",190,6,"Light, crisp and easy to carry.","8 min"],
    ["Roasted Chana + Peanuts",260,13,"Crunchy with useful protein.","3 min"],
    ["Apple + Nut Mix",250,7,"Fresh crunch plus healthy fats.","4 min"],
    ["Cucumber Carrot Hummus",230,9,"Crunchy vegetables with a creamy dip.","7 min"],
    ["Baked Roti Chips + Dip",280,10,"Crisp texture without deep frying.","12 min"]
  ],
  "Creamy":[
    ["Paneer Yogurt Bowl",330,24,"Creamy texture with strong protein.","10 min"],
    ["Banana Curd Smooth Bowl",280,15,"Cool and creamy with fruit.","7 min"],
    ["Hummus Veg Wrap",350,14,"Creamy filling with vegetables.","10 min"],
    ["Tofu Sesame Bowl",340,22,"Creamy dressing with plant protein.","15 min"],
    ["Oats Curd Savory Bowl",300,14,"Soft, creamy and filling.","10 min"]
  ],
  "Refreshing":[
    ["Fruit Curd Bowl",250,13,"Cool, hydrating and fruit-forward.","5 min"],
    ["Cucumber Paneer Salad",290,22,"Fresh vegetables with protein.","8 min"],
    ["Watermelon Mint Bowl",180,4,"Light and refreshing.","4 min"],
    ["Lemon Chickpea Salad",310,15,"Fresh, tangy and filling.","8 min"],
    ["Buttermilk + Roasted Chana",230,12,"Refreshing drink plus crunchy protein.","3 min"]
  ],
  "Chocolate":[
    ["Cocoa Banana Oats",330,13,"Chocolate flavor with oats and banana.","10 min"],
    ["Cocoa Yogurt Fruit Bowl",270,16,"Chocolate-style taste with protein.","5 min"],
    ["Cocoa Peanut Banana Toast",360,14,"Rich chocolate-peanut flavor.","7 min"],
    ["Date Cocoa Bites",240,6,"Small sweet bites made from dates and cocoa.","10 min"],
    ["Cocoa Milk Oats",310,14,"Warm, chocolate-flavored breakfast-style snack.","10 min"]
  ],
  "Fast Food":[
    ["Paneer Veg Wrap",410,25,"Fast-food feel in a balanced wrap.","15 min"],
    ["Homestyle Veg Burger",390,18,"Burger-style meal with vegetables and protein.","18 min"],
    ["Tofu Tikka Roll",400,24,"Portable, savory and satisfying.","15 min"],
    ["Masala Sandwich + Curd",380,17,"Quick café-style combination.","12 min"],
    ["Chickpea Stuffed Pita",410,19,"Handheld meal with fiber and protein.","15 min"]
  ],
  "Very Hungry":[
    ["Dal Rice Veg Bowl",520,23,"A larger balanced bowl with protein and carbs.","20 min"],
    ["Paneer Roti Plate",540,30,"High-protein and filling.","20 min"],
    ["Rajma Rice Salad Bowl",510,21,"Fiber-rich and satisfying.","20 min"],
    ["Tofu Millet Bowl",500,27,"Plant protein plus whole-grain carbs.","22 min"],
    ["Chole Roti Curd Plate",530,24,"Balanced and filling for a bigger appetite.","20 min"]
  ]
};

function cravingDietAdjust(name,p){
  if(p.diet==="Vegan"){
    return name.replace(/Yogurt|Curd/gi,"Soy Yogurt").replace(/Paneer/gi,"Tofu").replace(/Milk/gi,"Plant Milk");
  }
  if(p.diet==="Non-Vegetarian" && /Paneer Veg Wrap/.test(name)) return "Chicken Veg Wrap";
  return name;
}
function cravingSuggestions(p){
  const list=CRAVING_DATA[state.cravingChoice]||CRAVING_DATA["Sweet"];
  const v=state.cravingVariant||0;
  return [0,1,2].map(function(i){
    const x=list[(i+v)%list.length];
    return [cravingDietAdjust(x[0],p),x[1],x[2],x[3],x[4]];
  });
}
function setCravingChoice(v){state.cravingChoice=v;state.cravingSelected="";state.cravingAdded="";render()}
function anotherCraving(){state.cravingVariant=(state.cravingVariant+1)%5;state.cravingSelected="";state.cravingAdded="";render()}
function chooseCraving(i){
  const s=cravingSuggestions(state.profile)[i];
  state.cravingSelected=s?s[0]:"";
  render();
}
function addCravingToday(i){
  const s=cravingSuggestions(state.profile)[i];
  state.cravingAdded=s?s[0]:"";
  render();
}
