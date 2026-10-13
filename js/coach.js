function coachEscape(s){
  return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}
function coachFormat(s){
  return coachEscape(s).replace(/\n/g,"<br>");
}
function coachInit(){
  if(state.coachMessages.length)return;
  const name=(state.profile&&state.profile.name)?state.profile.name:"there";
  state.coachMessages.push({
    role:"assistant",
    text:"Hello "+name+"! 👋 I'm your NutriAI Health Coach.\n\nI can help you with:\n• Diet questions — what to eat for your goals\n• Nutrition info — benefits of specific foods\n• Health tips — lifestyle and wellness guidance\n• Food alternatives — healthier swaps\n• Deficiency awareness — nutrients to discuss/check\n\nHow can I help you today?"
  });
}
function coachToggle(){
  const w=$("coachWidget");
  if(!w)return;
  state.coachOpen=!state.coachOpen;
  w.classList.toggle("collapsed",!state.coachOpen);
  if(state.coachOpen){
    coachInit();
    coachRender();
    setTimeout(function(){const i=$("coachInput");if(i)i.focus()},80);
  }
}
function coachMeal(type,another){
  const p=state.profile||{};
  const db=base44MealPools(p)||{};
  const key=type==="breakfast"?"breakfasts":type==="lunch"?"lunches":type==="dinner"?"dinners":"snacks";
  const list=db[key]||[];
  if(!list.length)return null;
  if(!another || state.coachLastTopic!==type)state.coachMealIndex=0;
  else state.coachMealIndex=(state.coachMealIndex+1)%list.length;
  state.coachLastTopic=type;
  return list[state.coachMealIndex%list.length];
}
function coachMedicalBoundary(q){
  return /(dose|dosage|medicine|medication|insulin|prescription|diagnos|treat|cure|emergency|chest pain|faint|severe pain|suicid|eating disorder|pregnan)/i.test(q);
}
function coachReply(question){
  const q=question.toLowerCase().trim();
  const p=state.profile||{};
  const age=Number(p.age||0);
  const isMinor=age>0&&age<18;

  if(coachMedicalBoundary(q)){
    return "I can explain general nutrition and wellness information, but I can't diagnose conditions or tell you how to change medicines or treatment. For symptoms, medication questions, or a diagnosed condition, please involve a parent/guardian if appropriate and speak with a qualified clinician or dietitian.";
  }

  if(/^(hi|hello|hey|namaste)\b/.test(q)){
    return "Hi"+(p.name?" "+p.name:"")+"! 👋 Ask me about meals, protein, hydration, food swaps, ingredients, restaurants, exercise, or your NutriAI plan.";
  }

  const another=/another|one more|different|next option|something else/.test(q);
  let type=null;
  if(/breakfast|morning meal/.test(q))type="breakfast";
  else if(/lunch|afternoon meal/.test(q))type="lunch";
  else if(/dinner|night meal|evening meal/.test(q))type="dinner";
  else if(/snack/.test(q))type="snack";
  else if(another && ["breakfast","lunch","dinner","snack"].includes(state.coachLastTopic))type=state.coachLastTopic;

  if(type){
    const m=coachMeal(type,another);
    if(m){
      return "A "+type+" option from your NutriAI meal database is "+m.name+".\n\nApprox. nutrition: "+m.calories+" kcal • Protein "+m.protein+"g • Carbs "+m.carbs+"g • Fat "+m.fat+"g"+(m.fiber!=null?" • Fiber "+m.fiber+"g":"")+".\nPortion: "+(m.portion||"1 serving")+".\n\n"+(m.reason||"This option was selected from your saved diet profile.");
    }
  }

  if(/protein|high protein/.test(q)){
    const diet=p.diet||"Vegetarian";
    if(diet==="Vegan")return "For your vegan preference, useful protein foods include tofu, soy products, lentils, chickpeas, beans, sprouts, peas, nuts and seeds. Try pairing a protein source with whole grains and vegetables rather than relying on a single food.";
    if(diet==="Non-Vegetarian")return "Protein options include eggs, chicken, fish, curd, paneer, lentils, beans and chickpeas. Choose portions that fit the rest of your meal and use less-fried preparations when possible.";
    return "For your vegetarian preference, good protein choices include paneer, curd, milk, tofu, lentils, beans, chickpeas, sprouts, soy foods, nuts and seeds.";
  }

  if(/water|hydration|dehydrat/.test(q)){
    const target=p.m&&p.m.wat?p.m.wat+" L":"your usual hydration target";
    return "Your NutriAI dashboard currently shows about "+target+" per day. Treat that as a rough project estimate, not a medical prescription. Sip regularly and increase attention to fluids with heat or activity. Very high or very low fluid needs can occur with some medical conditions.";
  }

  if(/calorie|calories|lose weight|weight loss|dieting/.test(q)){
    if(isMinor){
      return "Because your profile is under 18, I won't recommend calorie restriction or a weight-loss calorie target. A safer focus is balanced meals, regular movement, enough sleep, vegetables/fruit, protein foods, whole grains, and guidance from a parent/guardian plus a pediatric clinician or dietitian if weight is a concern.";
    }
    return "For weight management, focus on sustainable portions, vegetables and fruit, adequate protein, whole grains, minimally processed foods, sleep, and regular activity. Calorie estimates in this project are approximate and shouldn't replace individualized professional advice.";
  }

  if(/bmi|body mass/.test(q)){
    if(isMinor){
      return "For people under 18, BMI should be interpreted using age- and sex-specific growth charts rather than adult BMI cutoffs. Your project can calculate a number, but a pediatric clinician should interpret it in context.";
    }
    return "BMI is a rough screening measure based on height and weight. It does not directly measure body fat, muscle mass, or overall health, so it is best interpreted alongside other health information.";
  }

  if(/deficien|vitamin|iron|calcium|b12|vitamin d/.test(q)){
    return "Food patterns can suggest nutrients worth paying attention to, but a deficiency can't be confirmed from symptoms or a questionnaire alone. NutriAI can highlight foods containing iron, calcium, vitamin B12, vitamin D and other nutrients; suspected deficiency should be checked with a qualified professional and, when appropriate, lab testing.";
  }

  if(/swap|alternative|instead of|healthier/.test(q)){
    return "A simple swap rule is: keep the same role in the meal but improve fiber, protein, or preparation. Examples: sugary drink → water/unsweetened drink; deep-fried snack → roasted snack; refined grain → whole-grain option; heavy creamy sauce → lighter vegetable/curd-based option when suitable.";
  }

  if(/ingredient|what can i cook|recipe/.test(q)){
    return "Open the Ingredients tab, add what you have, and click the green Generate Meal Plan button. I can also help you think through a combination here — tell me 2–5 ingredients you have.";
  }

  if(/restaurant|domino|subway|mcdonald|kfc|starbucks|burger/.test(q)){
    return "Use the Restaurant tab to choose or type a restaurant, then click the green Healthy Options button. The guide is rule-based and not a live restaurant menu, so confirm current ingredients, allergens and nutrition with the restaurant.";
  }


  if(/sleep|hours of sleep|bedtime/.test(q)){
    const rec=engineGetSleepRecommendation(Number(p.age||18));
    return "For your age, the NutriAI nutrition engine suggests "+rec.hours+".\n\n"+rec.tip;
  }

  if(/food swap|food swaps|swap list/.test(q)){
    const swaps=engineGetFoodSwaps().slice(0,4);
    return "Here are a few swaps from your NutriAI nutrition engine:\n• "+swaps.map(function(s){return s.unhealthy+" → "+s.healthy}).join("\n• ");
  }

  if(/exercise|workout|activity|walking/.test(q)){
    if(Number(p.age)<18){
      return "For an under-18 profile, keep exercise age-appropriate: walking, cycling, sports, mobility work, and supervised strength activities can all be options. Structured training should involve a parent/guardian or qualified professional where appropriate.";
    }
    const ex=engineGetExerciseRecommendation(nutritionEngineProfile(p));
    return "Your NutriAI nutrition engine suggests:\n• "+ex.exercises.join("\n• ")+"\n\n"+ex.reasoning+"\nFrequency: "+ex.frequency+".";
  }

  if(/grocery|shopping/.test(q)){
    const g=engineGenerateGroceryList([],p.diet);
    const sample=[].concat(g["Vegetables"]||[],g["Fruits"]||[],g["Proteins"]||[]).slice(0,8);
    return "The Grocery tab now uses your NutriAI nutrition engine. A few items for your "+(p.diet||"selected")+" profile are:\n• "+sample.join("\n• ")+"\n\nYou can open Grocery for the full categorized list.";
  }

  if(/what should i eat|meal plan|diet plan/.test(q)){
    state.coachLastTopic="breakfast";
    const m=coachMeal("breakfast",false);
    if(m)return "A simple place to start is "+m.name+" for breakfast. You can ask me for lunch, dinner, snacks, or say “another one” for a different option.";
  }

  return "I can help with your NutriAI meal plan, food choices, protein, hydration, healthy swaps, ingredients, restaurants, grocery planning, exercise and deficiency awareness.\n\nTry asking:\n• What should I eat for breakfast?\n• Give me another option.\n• What are good vegetarian protein foods?\n• What is a healthier snack?\n• How can I improve hydration?";
}
function coachRender(){
  const body=$("coachBody");
  if(!body)return;
  coachInit();
  const msgs=state.coachMessages.map(function(m){
    if(m.role==="user"){
      return `<div class="coach-row user"><div class="coach-bubble">${coachFormat(m.text)}</div></div>`;
    }
    return `<div class="coach-row assistant"><div class="coach-small-avatar"><img src="assets/health-coach-leaf.png" alt="" class="coach-leaf-icon"></div><div class="coach-bubble">${coachFormat(m.text)}</div></div>`;
  }).join("");
  const suggestions=state.coachMessages.length<=1?`
    <div class="coach-suggestions">
      <button class="coach-suggestion" onclick="coachAsk('What should I eat for breakfast?')">Breakfast</button>
      <button class="coach-suggestion" onclick="coachAsk('Good protein foods for me?')">Protein</button>
      <button class="coach-suggestion" onclick="coachAsk('How can I improve hydration?')">Hydration</button>
    </div>`:"";
  body.innerHTML=msgs+suggestions;
  body.scrollTop=body.scrollHeight;
}
function coachAsk(q){
  const input=$("coachInput");
  if(input)input.value=q;
  coachSend();
}
function coachSend(){
  const input=$("coachInput");
  if(!input)return;
  const q=input.value.trim();
  if(!q)return;
  coachInit();
  state.coachMessages.push({role:"user",text:q});
  input.value="";
  coachRender();

  const body=$("coachBody");
  const typing=document.createElement("div");
  typing.className="coach-row assistant";
  typing.id="coachTyping";
  typing.innerHTML='<div class="coach-small-avatar"><img src="assets/health-coach-leaf.png" alt="" class="coach-leaf-icon"></div><div class="coach-bubble"><span class="coach-typing"><span></span><span></span><span></span></span></div>';
  body.appendChild(typing);
  body.scrollTop=body.scrollHeight;

  setTimeout(function(){
    const t=$("coachTyping"); if(t)t.remove();
    const answer=coachReply(q);
    state.coachMessages.push({role:"assistant",text:answer});
    coachRender();
  },420);
}
