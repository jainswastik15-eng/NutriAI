const LUNCHBOX_OPTIONS=[
  ["Paneer Veg Wrap","Apple","Roasted chana","Water",520,24,"No reheating"],
  ["Veg Pulao + Curd","Cucumber sticks","Orange","Water",500,18,"Can reheat"],
  ["Moong Chilla Rolls","Guava","Makhana","Water",460,22,"High protein"],
  ["Chickpea Sandwich","Carrot sticks","Banana","Water",490,19,"Mess-free"],
  ["Tofu Roti Roll","Apple","Roasted peanuts","Water",510,25,"High protein"],
  ["Idli + Dry Chutney","Fruit cup","Roasted chana","Water",440,16,"Budget friendly"],
  ["Rajma Wrap","Cucumber","Orange","Water",500,21,"Mess-free"],
  ["Besan Chilla Box","Banana","Makhana","Water",470,20,"Budget friendly"]
];
function lunchboxDietName(name,p){
  if(p.diet==="Vegan")return name.replace(/Paneer/gi,"Tofu").replace(/Curd/gi,"Soy Yogurt");
  if(p.diet==="Non-Vegetarian" && name==="Paneer Veg Wrap")return "Egg & Veg Wrap";
  return name;
}
function setLunchboxOption(kind,val){
  state[kind]=val;
  state.lunchboxGenerated=false;
  state.lunchboxPacked="";
  render();
}
function generateLunchbox(){state.lunchboxGenerated=true;render()}
function regenerateLunchbox(){state.lunchboxVariant=(state.lunchboxVariant+1)%LUNCHBOX_OPTIONS.length;state.lunchboxGenerated=true;state.lunchboxPacked="";render()}
function lunchboxResults(p){
  const v=state.lunchboxVariant||0;
  return [0,1,2].map(function(i){
    const x=LUNCHBOX_OPTIONS[(v+i)%LUNCHBOX_OPTIONS.length].slice();
    x[0]=lunchboxDietName(x[0],p);
    return x;
  });
}
function packLunchbox(i){
  const r=lunchboxResults(state.profile)[i];
  state.lunchboxPacked=r?r[0]:"";
  render();
}
function lunchboxAddGrocery(i){
  const r=lunchboxResults(state.profile)[i];
  if(!r)return;
  state.lunchboxPacked="Added ingredients for "+r[0]+" to your suggested grocery list.";
  render();
}
