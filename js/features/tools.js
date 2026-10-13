function setRecipePreset(v){
  state.recipeText=v;
  render();
}
function recipeFromIngredients(raw,p){
  const items=raw.split(",").map(x=>x.trim()).filter(Boolean);
  const lower=items.map(x=>x.toLowerCase());
  let title="Balanced Nutri Bowl";
  if(lower.some(x=>x.includes("paneer"))) title="Quick Paneer Veg Stir-Fry";
  else if(lower.some(x=>x.includes("moong")||x.includes("dal"))) title="Moong Dal Power Bowl";
  else if(lower.some(x=>x.includes("oats"))) title="Fruit & Oats Energy Bowl";
  else if(lower.some(x=>x.includes("ragi"))) title="Ragi Breakfast Bowl";
  else if(lower.some(x=>x.includes("rice"))) title="Vegetable Rice & Dal Bowl";
  const prot = lower.some(x=>/paneer|tofu|egg|chicken|dal|moong|curd/.test(x)) ? "moderate-high" : "moderate";
  const base = items.length ? items.join(", ") : "your selected ingredients";
  return {
    title,
    ingredients: base,
    steps:[
      "Wash and prepare the ingredients.",
      "Cook the main grain or pulse until tender.",
      "Add vegetables and your protein source with mild spices.",
      "Finish with herbs, lemon, or plain curd where appropriate."
    ],
    nutrition:`Approximate profile: ${prot} protein, vegetables/fiber focused, and suitable as a ${p.goal.toLowerCase()}-oriented meal when portions match your needs.`
  };
}
function generateRecipe(){
  const inp=document.getElementById("recipeInput");
  const raw=(inp?inp.value:state.recipeText).trim();
  if(!raw){alert("Enter a few ingredients first.");return;}
  state.recipeText=raw;
  render();
  setTimeout(()=>document.getElementById("recipeResult")?.scrollIntoView({behavior:"smooth",block:"nearest"}),50);
}
function handleScanFile(input){
  const f=input.files && input.files[0];
  if(!f) return;
  if(!f.type.startsWith("image/")){alert("Please choose an image file.");return;}
  const r=new FileReader();
  r.onload=()=>{
    state.scanData={name:f.name,url:r.result,size:Math.round(f.size/1024)};
    state.scanAnalyzed=false;
    render();
  };
  r.readAsDataURL(f);
}
function analyzeUploadedLabel(){
  if(!state.scanData){alert("Upload a label photo first.");return;}
  state.scanAnalyzed=true;
  render();
}
function resetScan(){
  state.scanData=null;state.scanAnalyzed=false;render();
}
function demoScanMetrics(){
  const p=state.profile;
  return {
    calories:"~180 kcal",
    protein:"~6 g",
    sugar:"Check label",
    sodium:"Check label",
    verdict:p.goal==="Weight Loss"?"Compare calories, protein and added sugar before choosing.":"Compare serving size, protein, added sugar and sodium."
  };
}


function groceryData(p){
  const source=engineGenerateGroceryList([],p.diet);
  const iconMap={
    "Grains & Cereals":"🌾 Grains & Cereals",
    "Pulses & Lentils":"▤ Pulses & Lentils",
    "Vegetables":"▤ Vegetables",
    "Fruits":"🍎 Fruits",
    "Dairy / Alternatives":"🥛 Dairy / Alternatives",
    "Proteins":"🥩 Proteins",
    "Spices & Condiments":"🌿 Spices & Condiments",
    "Oils & Fats":"▤ Oils & Fats",
    "Others":"📦 Others"
  };
  const data={};
  Object.entries(source).forEach(function(entry){
    const cat=entry[0],items=entry[1];
    if(items&&items.length)data[iconMap[cat]||cat]=items.slice();
  });

  const allergies=(p.allergies||"").toLowerCase();
  if(allergies){
    Object.keys(data).forEach(function(cat){
      data[cat]=data[cat].filter(function(item){
        const low=item.toLowerCase();
        if(/nut|almond|walnut|peanut/.test(allergies) && /nut|almond|walnut|peanut/.test(low)) return false;
        if(/milk|dairy/.test(allergies) && /milk|curd|paneer|butter|yogurt/.test(low)) return false;
        return true;
      });
      if(!data[cat].length)delete data[cat];
    });
  }
  return data;
}
function groceryFlat(p){return Object.values(groceryData(p)).flat()}
function toggleGrocery(item){
  state.groceryChecked[item]=!state.groceryChecked[item];
  render();
}
function refreshGrocery(){state.groceryChecked={};render();}
