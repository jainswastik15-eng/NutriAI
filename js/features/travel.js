const TRAVEL_SNACKS=[
  ["Roasted Chana",180,9,"No refrigeration","Easy to carry, crunchy and protein-rich."],
  ["Banana",105,1,"No refrigeration","Simple, portable carbohydrate source."],
  ["Apple + Nuts",230,6,"No refrigeration","Fresh fruit plus a filling snack."],
  ["Whole-Grain Veg Sandwich",320,13,"Best kept cool","Portable main snack; keep chilled for longer trips."],
  ["Paneer/Tofu Wrap",390,23,"Best kept cool","More filling option with protein."],
  ["Roasted Makhana",160,5,"No refrigeration","Light, crisp travel snack."],
  ["Dry Idli + Chutney",300,10,"Short journey","Mess-friendly packed meal for shorter trips."],
  ["Peanut Chikki + Fruit",260,8,"No refrigeration","Compact and convenient; portion sensibly."]
];
function setTravelOption(kind,val){state[kind]=val;state.travelGenerated=false;render()}
function generateTravelMode(){state.travelGenerated=true;render()}
function regenerateTravel(){state.travelVariant=(state.travelVariant+1)%TRAVEL_SNACKS.length;state.travelGenerated=true;render()}
function travelSnacks(p){
  const v=state.travelVariant||0;
  return [0,1,2].map(function(i){
    const x=TRAVEL_SNACKS[(v+i)%TRAVEL_SNACKS.length].slice();
    if(p.diet==="Vegan")x[0]=x[0].replace(/Paneer\/Tofu/gi,"Tofu");
    return x;
  });
}
function travelPlan(p){
  const flight=state.travelType==="Flight";
  const road=state.travelType==="Road Trip";
  const long=/8–12|Full Day|Multiple/.test(state.travelDuration);
  return {
    before:flight?"Have a normal balanced meal before leaving for the airport.":"Have a balanced meal before departure so you are not relying only on snacks.",
    timeline:long?"Pack a main meal plus 2–3 portable snacks and water.":"One portable snack plus water may be enough depending on meal timing.",
    hydration:"Carry water where permitted and drink regularly according to thirst. Avoid excessive caffeine.",
    special:flight
      ?"Airport quick picks: fruit + yogurt, a vegetable/protein sandwich or wrap, nuts, and water."
      :road
        ?"Road-trip kit: wrap/sandwich, fruit, roasted chana or nuts, water, tissues, and normal rest breaks."
        :"Choose portable, mess-free foods and be careful with foods that require refrigeration.",
    safety:"Foods containing dairy, paneer, cooked rice, cut fruit or other perishable ingredients may need safe temperature control on longer journeys."
  };
}
