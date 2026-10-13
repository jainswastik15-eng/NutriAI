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
function sportsModePlan(p){
  const vegan=p.diet==="Vegan";
  const nonveg=p.diet==="Non-Vegetarian";
  const protein=vegan?"tofu":nonveg?"egg / chicken":"paneer / curd";
  const intensity=state.sportIntensity;
  const hard=intensity==="Hard";
  const mins=Number(state.sportDuration||60);
  const pre=hard||mins>=60?"Banana + oats / toast + water":"Fruit + curd (or plant yogurt) + water";
  const post=`${protein} + rice/roti + vegetables`;
  const timing=state.sportTiming;
  return {
    focus:SPORTS_FOCUS[state.sportType]||SPORTS_FOCUS["Cricket"],
    pre:pre,
    post:post,
    when:hard?"Eat a normal meal 2–3 hours before, or a lighter snack 45–90 minutes before.":"A light snack 45–90 minutes before is usually practical.",
    hydration:mins>=90?"Carry water and take regular sips; longer/hot sessions may need additional fluids according to thirst and conditions.":"Drink water before and after, and sip during activity as needed.",
    recovery:`After ${state.sportType.toLowerCase()}, include a normal meal with protein, carbohydrates and vegetables.`,
    note:Number(p.age)<18?"For under-18 users, focus on balanced meals, growth, hydration and recovery—not calorie restriction.":"Adjust portions to hunger, training load and your overall daily plan."
  };
}
