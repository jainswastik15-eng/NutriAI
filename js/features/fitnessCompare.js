function regenerateFitness(btn){
  if(state.fitnessRegenerating)return;
  state.fitnessRegenerating=true;
  if(btn){btn.disabled=true;btn.textContent="⏳ Generating...";}
  setTimeout(()=>{state.fitnessVariant=(state.fitnessVariant+1)%3;state.fitnessRegenerating=false;render()},500);
}
function fitnessPlan(p){
  const diabetic=(p.conditions||[]).includes("Diabetes");
  const teen=+p.age<18;
  const v=state.fitnessVariant%3;

  const variants=[
    {
      yoga:[
        ["Surya Namaskar (Sun Salutation)",15,100,["Stand in Tadasana","Inhale, raise arms","Exhale, forward fold","Inhale, lunge","Exhale, plank","Lower to floor, cobra pose, downward dog","Return to standing"],"Improves overall flexibility and metabolic rate.","Keep movements steady and stop if dizzy or unwell."],
        ["Paschimottanasana (Seated Forward Bend)",5,20,["Sit with legs extended","Inhale, reach up","Exhale, fold forward from hips","Hold feet or shins","Maintain steady breathing"],"Gentle flexibility and relaxation.","Avoid forcing the stretch if there is lower-back pain."]
      ],
      stretch:[["Cat-Cow Stretch",5,15,["Start on hands and knees","Inhale, drop belly, look up (Cow)","Exhale, arch back, chin to chest (Cat)","Repeat rhythmically"],"Improves spinal mobility and relieves sedentary stiffness.","Keep the neck relaxed."]],
      cardio:[["Brisk Walking",30,150,["Warm up with slow walking","Increase pace to a brisk walk","Keep posture upright","Swing arms naturally"],"Supports cardiovascular fitness and daily movement.","Wear supportive shoes and stop for chest pain, faintness, or severe breathlessness."]],
      strength:[["Bodyweight Squats",10,60,["Stand feet shoulder-width apart","Lower hips as if sitting in a chair","Keep chest up","Push through heels to return to standing"],"Builds lower-body strength and supports glucose uptake.","Keep knees tracking in line with toes and use support if needed."]],
      breath:[["Bhramari Pranayama",5,0,["Sit comfortably","Close eyes","Inhale slowly through the nose","Exhale with a gentle humming sound"],"May help relaxation and stress reduction.","Practice gently; stop if uncomfortable or lightheaded."]]
    },
    {
      yoga:[
        ["Tadasana (Mountain Pose)",5,15,["Stand tall with feet grounded","Relax shoulders","Lengthen through spine","Breathe slowly"],"Improves posture and body awareness.","Use a wall for balance if needed."],
        ["Bhujangasana (Cobra Pose)",5,20,["Lie on stomach","Place hands under shoulders","Lift chest gently","Keep elbows soft","Breathe normally"],"Opens the chest and strengthens back muscles.","Avoid deep extension with acute back pain."]
      ],
      stretch:[["Child's Pose",5,10,["Kneel comfortably","Sit hips toward heels","Reach arms forward","Breathe slowly"],"Gentle back and hip relaxation.","Modify knee position if uncomfortable."]],
      cardio:[["Low-Impact Marching",20,100,["March slowly in place","Gradually increase pace","Swing arms gently","Cool down for 3 minutes"],"Low-impact cardio suitable for beginners.","Use support if balance is limited."]],
      strength:[["Wall Push-Ups",10,45,["Stand facing a wall","Place hands at chest height","Bend elbows and bring chest toward wall","Push back slowly"],"Builds upper-body strength with low joint load.","Keep body aligned and avoid locking elbows."]],
      breath:[["Box Breathing",5,0,["Inhale gently","Pause briefly","Exhale slowly","Pause briefly","Repeat comfortably"],"Encourages calm breathing and focus.","Do not hold the breath for long periods."]]
    },
    {
      yoga:[
        ["Vrikshasana (Tree Pose)",5,15,["Stand tall","Shift weight to one leg","Place opposite foot at ankle or calf","Bring hands together","Breathe steadily"],"Supports balance and concentration.","Use a wall or chair for support."],
        ["Setu Bandhasana (Bridge Pose)",8,35,["Lie on back with knees bent","Press feet into floor","Lift hips gently","Keep shoulders relaxed","Lower slowly"],"Strengthens glutes and posterior chain.","Avoid if movement causes neck or back pain."]
      ],
      stretch:[["Standing Side Stretch",5,15,["Stand tall","Raise one arm","Lean gently to opposite side","Return to center","Repeat other side"],"Improves side-body mobility.","Avoid bouncing or forcing range."]],
      cardio:[["Easy Cycling / Stationary Bike",25,140,["Start easy for 5 minutes","Ride at a comfortable moderate pace","Keep breathing steady","Cool down gradually"],"Supports aerobic fitness with low impact.","Adjust seat height properly and stop if joint pain develops."]],
      strength:[["Chair Sit-to-Stand",10,55,["Sit toward front of chair","Feet flat on floor","Stand without using hands if safe","Sit back slowly"],"Builds functional leg strength.","Use a stable chair and hold support if balance is poor."]],
      breath:[["Slow Diaphragmatic Breathing",5,0,["Sit or lie comfortably","Place one hand on abdomen","Inhale slowly allowing abdomen to rise","Exhale slowly","Repeat without strain"],"May support relaxation and recovery.","Stop if you feel dizzy."]]
    }
  ];

  const focus = diabetic
    ? "This plan emphasizes steady, moderate movement, gentle yoga and basic strength work. Regular activity can support overall fitness and may help with blood-glucose management as part of a clinician-approved care plan."
    : p.goal==="Muscle Building"
      ? "This plan combines mobility, light cardio and bodyweight strength work to support gradual strength development and recovery."
      : p.goal==="Weight Loss"
        ? "This plan combines regular low-impact cardio, yoga, stretching and basic strength work to support sustainable activity and energy balance."
        : "This plan focuses on balanced movement, flexibility, cardiovascular fitness, strength and relaxation.";

  return {focus,teen,plan:variants[v]};
}
function fitCard(x){
  return `<div class="fit-ex-card"><span class="fit-difficulty">Beginner</span><h3>${x[0]}</h3><div class="fit-meta">⏱ ${x[1]} min ${x[2]?`&nbsp;&nbsp;🔥 ${x[2]} kcal`:``}</div><div class="fit-steps">Steps:<ol>${x[3].map(s=>`<li>${s}</li>`).join("")}</ol></div><div class="fit-benefit">✨ Benefits: ${x[4]}</div><div class="fit-caution">⚠ Precautions: ${x[5]}</div></div>`;
}


const foodDB={
  "Paneer":{cal:265,protein:18,carbs:6,fat:20,fiber:0.5,label:"High-protein dairy food",note:"Good protein and calcium; portions matter because calories and saturated fat can be higher."},
  "Tofu":{cal:144,protein:17,carbs:3,fat:9,fiber:2,label:"Plant protein",note:"Good plant protein with fewer calories than many paneer servings."},
  "Brown Rice":{cal:123,protein:2.7,carbs:25.6,fat:1,fiber:1.6,label:"Whole grain",note:"Usually offers more fiber than white rice."},
  "White Rice":{cal:130,protein:2.4,carbs:28.2,fat:0.3,fiber:0.4,label:"Refined grain",note:"Easy to digest but generally lower in fiber."},
  "Butter":{cal:717,protein:0.9,carbs:0.1,fat:81,fiber:0,label:"Saturated-fat rich",note:"Very energy dense; best used in small amounts."},
  "Olive Oil":{cal:884,protein:0,carbs:0,fat:100,fiber:0,label:"Unsaturated fat",note:"Mostly unsaturated fat, but still very energy dense."},
  "Apple Juice":{cal:46,protein:0.1,carbs:11.3,fat:0.1,fiber:0.2,label:"Juice",note:"Contains much less fiber than whole fruit."},
  "Whole Apple":{cal:52,protein:0.3,carbs:14,fat:0.2,fiber:2.4,label:"Whole fruit",note:"Provides fiber and usually more satiety than juice."},
  "Roti":{cal:120,protein:3.5,carbs:22,fat:2,fiber:3,label:"Whole-wheat flatbread",note:"Can be a good whole-grain choice depending on flour and portion."},
  "Bread":{cal:265,protein:9,carbs:49,fat:3.2,fiber:2.7,label:"Bread",note:"Nutrition varies by type; whole-grain bread is generally higher in fiber."},
  "Jaggery":{cal:383,protein:0.4,carbs:98,fat:0.1,fiber:0,label:"Added sugar",note:"Contains trace minerals but is still mostly sugar."},
  "Sugar":{cal:387,protein:0,carbs:100,fat:0,fiber:0,label:"Added sugar",note:"Pure added sugar with minimal micronutrients."}
};
function normalizeFoodName(v){
  const hit=Object.keys(foodDB).find(k=>k.toLowerCase()===v.trim().toLowerCase());
  return hit||v.trim();
}
function setComparePreset(a,b){
  state.compareA=a;state.compareB=b;state.compareResult=null;render();
}
function compareFoodsAdvanced(){
  const a=normalizeFoodName(document.getElementById("compareA")?.value||state.compareA);
  const b=normalizeFoodName(document.getElementById("compareB")?.value||state.compareB);
  if(!a||!b){alert("Enter both foods.");return;}
  state.compareA=a;state.compareB=b;
  const fallback={cal:200,protein:8,carbs:25,fat:7,fiber:3,label:"Food",note:"No exact demo data is stored for this food; use a verified nutrition label for exact values."};
  const A=foodDB[a]||fallback, B=foodDB[b]||fallback;
  const score=x=>{
    let s=50+Math.min(25,x.protein*1.3)+Math.min(20,x.fiber*2)-Math.min(18,x.fat*.22)-Math.min(12,x.cal/45);
    if(state.profile?.goal==="Weight Loss")s-=Math.min(12,x.cal/60);
    if(state.profile?.goal==="Muscle Building")s+=Math.min(12,x.protein*.6);
    return Math.max(20,Math.min(95,Math.round(s)));
  };
  const sa=score(A), sb=score(B);
  state.compareResult={a:{name:a,...A,score:sa},b:{name:b,...B,score:sb},winner:sa===sb?"Tie":sa>sb?a:b};
  render();
}


function toast(msg){
  const t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove("show"),1800);
}
function navToast(msg){toast(msg)}
