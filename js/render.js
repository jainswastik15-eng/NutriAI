function render(){let p=state.profile;if(state.tab==="Diet Plan"){
  const d=diseaseInfo(p), mv=macroValues(p), meals=mealSet(p);
  const bmiPos=Math.max(1,Math.min(99,((+p.m.bmi-15)/(40-15))*100));
  const ageNote=+p.age<18
    ? "Because you are under 18, calorie and BMI interpretation should be reviewed with a parent/guardian and qualified health professional."
    : `Your target is designed around ${p.goal.toLowerCase()} with a balanced, sustainable pattern.`;
  $("content").innerHTML=`
  <div class="diet-stack">
    <section class="section-box blue"><div class="inner">
      <div class="head"><span>❄️</span><div><h2>Seasonal Recommendations</h2><p>Winter Season • October – February • Eat what's in season for maximum nutrition</p></div></div>
      <div class="season">
        <div><h3>🍎 SEASONAL FRUITS</h3>
          ${food("Orange","Vitamin C, immunity support, folate","1 medium (130g)")}
          ${food("Guava (Amrood)","Vitamin C and fiber","1 medium (100g)")}
          ${food("Amla","Vitamin C and antioxidants","2–3 pieces (40g)")}
          ${food("Strawberry","Antioxidants, vitamin C","1 cup (150g)")}
          ${food("Kiwi","Vitamin C & K, digestive enzymes","2 medium")}
        </div>
        <div><h3>▦ SEASONAL VEGETABLES</h3>
          ${food("Spinach (Palak)","Iron, folate, vitamin K, calcium","1 cup cooked")}
          ${food("Fenugreek (Methi)","Fiber and iron","1 cup cooked")}
          ${food("Mustard Greens (Sarson)","Vitamins A, C and K","1 cup cooked")}
          ${food("Carrot","Beta-carotene, eye health","1 medium")}
          ${food("Peas (Matar)","Protein, fiber, vitamin C","½ cup")}
        </div>
      </div>
      <div class="season-tip">💡 <b>Seasonal Health Tips</b><br>• Include leafy greens and colorful vegetables • Enjoy warm soups without excess salt • Get regular daylight and physical activity when possible</div>
    </div></section>

    <section class="section-box">
      <div class="green-head"><h2>🏥 Disease-Specific Diet Plans</h2><p>Educational nutrition guidance based on selected health conditions</p></div>
      <div class="inner">
        <div class="disease-title">▤ &nbsp; ${d.title}<div style="font-size:11px;font-weight:500;margin-top:6px">Active profile: ${(d.conditions||["General Wellness"]).join(" • ")}</div><div class="keyfoods">Personalized food focus: ${d.foods.map(x=>`<span class="tagpill">${x}</span>`).join("")}</div></div>
        <div class="eat-grid">
          <div><div class="list-title ok">✅ EAT MORE / PRIORITIZE</div>${d.eat.map(x=>`<div class="advice-row good">✓ ${x}</div>`).join("")}</div>
          <div><div class="list-title avoid">⛔ LIMIT / AVOID</div>${d.avoid.map(x=>`<div class="advice-row bad">× ${x}</div>`).join("")}</div>
        </div>
        <div class="small-disclaimer">⚠ For educational purposes only. Consult a qualified healthcare professional for medical nutrition therapy.</div>
      </div>
    </section>

    <div class="planner-layout">
      <section class="section-box planner">
        <h2>🍳 Smart Cooking Time Planner</h2><p>Your meals are tailored to your time & cooking skill</p>
        <div class="label">How much time do you have to cook?</div>
        <div class="opt-row">
          <button class="plan-opt ${state.cookingTime==="lt10"?"sel":""}" onclick="setPlanner('cookingTime','lt10')">⚡ Less than 10 minutes</button>
          <button class="plan-opt ${state.cookingTime==="10to20"?"sel":""}" onclick="setPlanner('cookingTime','10to20')">⏱ 10–20 minutes</button>
          <button class="plan-opt ${state.cookingTime==="20to40"?"sel":""}" onclick="setPlanner('cookingTime','20to40')">🍳 20–40 minutes</button>
          <button class="plan-opt ${state.cookingTime==="gt40"?"sel":""}" onclick="setPlanner('cookingTime','gt40')">🏆 More than 40 minutes</button>
        </div>
        <div class="label space">Your cooking skill level?</div>
        <div class="opt-row">
          <button class="plan-opt ${state.cookingSkill==="Beginner"?"sel":""}" onclick="setPlanner('cookingSkill','Beginner')">Beginner</button>
          <button class="plan-opt ${state.cookingSkill==="Intermediate"?"sel":""}" onclick="setPlanner('cookingSkill','Intermediate')">Intermediate</button>
          <button class="plan-opt ${state.cookingSkill==="Advanced"?"sel":""}" onclick="setPlanner('cookingSkill','Advanced')">Advanced</button>
        </div>
        <div class="planner-status">✓ Meal cards below now use <b>${cookingMeta().label}</b> cooking time and <b>${state.cookingSkill}</b> skill level.</div>
      </section>
      <section class="section-box bmi-card">
        <h3>BMI Analysis</h3><span class="bmi-big">${p.m.bmi}</span><span class="bmi-label">${bmiInterpretation(p)}</span>
        <div class="bmi-track"><span class="bmi-marker" style="left:${bmiPos}%"></span></div><div class="scale-row"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
        ${+p.age<18?`<p style="font-size:11px;color:#7a8596;margin-top:10px">For people under 18, BMI requires age- and sex-specific percentile interpretation.</p>`:""}
      </section>
    </div>

    <div class="meal-area">
      <section>
        <div class="meal-top"><div><h2>🤖 AI Meal Plan for ${p.name}</h2><div style="font-size:12px;color:#7a8596">${bmiInterpretation(p)} • ${p.activity} • ${p.goal}</div></div><div class="meal-top-actions"><button class="pdf-btn" onclick="exportDietPlanPDF()">📄 Export PDF</button><button class="regen" onclick="regenerateMeals(this)">↻ Regenerate</button></div></div>
        <div class="summary">🎯 <b>Your Plan Summary:</b> ${ageNote} Prioritize quality protein, vegetables, fiber-rich carbohydrates and regular hydration.</div>
        <div class="focuses">Generated plan #${(state.mealVariant||0)+1} • Cooking: ${cookingMeta().label} • Skill: ${state.cookingSkill}<br><b>Personalization:</b> ${diseasePersonalizationText(p)}<br>Food focus: ${d.foods.slice(0,4).map(x=>`<span class="focus">${x}</span>`).join("")}</div>
        <div class="meal-cards">${meals.map(mealCardDetailed).join("")}</div>

        <div class="snack-grid space">
          <div class="section-box snack"><div class="time">🍎 Morning Snack (10–11am)</div><h4>Buttermilk with Roasted Cumin</h4><div class="meta"><span class="badge">🥛 200ml</span><span class="badge">🔥 60 kcal</span><span class="badge">⏰ 2 mins</span></div><p style="font-size:12px;color:#6f7a8c">A light, hydrating snack. Choose unsweetened versions.</p><div class="alt">🔄 Alt: 5 almonds + 2 walnuts</div></div>
          <div class="section-box snack"><div class="time">🌿 Evening Snack (4–5pm)</div><h4>Roasted Makhana</h4><div class="meta"><span class="badge">1 cup</span><span class="badge">🔥 100 kcal</span><span class="badge">⏰ 10 mins</span></div><p style="font-size:12px;color:#6f7a8c">Crunchy snack with portion control.</p><div class="alt">🔄 Alt: Fruit + plain curd</div></div>
        </div>

        <div class="hydration space">
          <h2>💧 Personalised Hydration Plan — ${p.m.wat}L/day</h2>
          <div class="hyd-grid">
            <div class="hyd"><b>Wake up: 300ml</b><p>Start the day with water.</p></div>
            <div class="hyd"><b>Before lunch: 400ml</b><p>Space fluids through the day.</p></div>
            <div class="hyd"><b>Mid-afternoon: 500ml</b><p>Keep a bottle nearby.</p></div>
            <div class="hyd"><b>Before dinner: 400ml</b><p>Avoid drinking all fluids at once.</p></div>
            <div class="hyd"><b>Evening: small sips</b><p>Adjust for weather and activity.</p></div>
          </div>
          <div class="special">💡 <b>Special advice:</b> Hydration needs vary with activity, climate and health conditions. If you have kidney, heart or fluid-restriction concerns, follow clinician advice rather than this estimate.</div>
        </div>
      </section>

      <aside>
        <section class="section-box donut-card">
          <h3>Daily Macro Split</h3>
          <div class="donut" style="--pPct:${mv.pPct}%;--cPct:${mv.cPct}%"></div>
          <div class="legend"><span><i class="sq p"></i>Protein</span><span><i class="sq c"></i>Carbs</span><span><i class="sq f"></i>Fat</span></div>
          <div class="macro-stats"><div class="macro-stat">Protein<b>${mv.protein}g</b></div><div class="macro-stat">Carbs<b>${mv.carbs}g</b></div><div class="macro-stat">Fat<b>${mv.fat}g</b></div></div>
        </section>
        <section class="section-box tips-card space">
          <h3 style="color:#2b7b5d">🌿 Health Tips</h3>
          <div class="tip">💡 Eat slowly and pay attention to fullness cues.</div>
          <div class="tip">💡 Include colorful vegetables across the day.</div>
          <div class="tip">💡 Keep regular meal and sleep routines.</div>
          <div class="tip">💡 Limit sugary drinks and highly processed snacks.</div>
          <div class="tip">💡 Adjust portions to hunger, activity and professional advice.</div>
        </section>
      </aside>
    </div>

    <div class="warning">⚠ These recommendations are for educational purposes and do not replace professional medical advice. For diagnosed conditions, pregnancy, eating disorders, medication interactions, or people under 18, seek individualized guidance from a qualified professional.</div>
  </div>`;
}
else if(state.tab==="Weekly"){
  const names=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const plans=weekData(p), meal=plans[state.weekDay], ex=weeklyExercises(p);
  const teen=+p.age<18, sleep=teen?"8–10 hours":"7–9 hours";
  $("content").innerHTML=`
    <div class="week-layout">
      <section class="week-card">
        <div class="week-head">
          <div class="week-title"><span class="week-icon">▣</span><div><h2>Personalized Weekly Meal Plan</h2><p>${p.goal} • ${p.diet} • ${p.region}</p></div></div>
          <button class="regen" onclick="regenerateWeek(this)">↻ Regenerate</button>
        </div>
        <div class="week-controls">
          <button class="week-arrow" onclick="shiftWeekDay(-1)">‹</button>
          <div class="days">${names.map((n,i)=>`<button class="day-btn ${state.weekDay===i?"sel":""}" onclick="setWeekDay(${i})">${n}</button>`).join("")}</div>
          <button class="week-arrow" onclick="shiftWeekDay(1)">›</button>
        </div>
        <div class="day-plan">
          <div>Day ${state.weekDay+1}</div>
          <b>Breakfast:</b> ${meal[0]}. Approx. 250–350 kcal. <span class="why">Why: Balanced fiber and protein for a steady start.</span><br>
          <b>Lunch:</b> ${meal[1]}. Approx. 400–500 kcal. <span class="why">Why: Supports energy and a balanced plate.</span><br>
          <b>Dinner:</b> ${meal[2]}. Approx. 320–430 kcal. <span class="why">Why: Protein and vegetables with a lighter evening meal.</span><br>
          <b>Snack:</b> ${meal[3]}. Approx. 100–180 kcal.<br>
          <div class="week-tip">Tip: Chew slowly, keep regular meal timing, and adjust portions to hunger and activity.</div>
        </div>
      </section>

      <div>
        <section class="exercise-week">
          <div class="toprow"><span class="purple-icon">⚛</span>Exercise Plan</div>
          <div class="exercise-summary"><div><small>◷ Duration</small><b>${p.goal==="Weight Loss"?"30–45 minutes daily":"25–40 minutes"}</b></div><div><small>▣ Frequency</small><b>${p.goal==="Muscle Building"?"3–5 days a week":"5–6 days a week"}</b></div></div>
          <div class="week-exercises">${ex.map((x,i)=>`<div class="week-ex"><span class="week-num">${i+1}</span><span>${x}</span></div>`).join("")}</div>
          <div class="week-info">ⓘ ${p.goal==="Weight Loss"?"Regular cardio and movement can support energy balance when paired with adequate nutrition.":"Build activity progressively and allow adequate recovery."}</div>
        </section>

        <section class="sleep-week">
          <div class="toprow"><span class="purple-icon">〽</span>Sleep Recommendation</div>
          <div class="sleep-highlight"><strong>${sleep}</strong><p>${teen?"Teens generally need additional sleep for growth and development.":"Consistent sleep supports recovery, appetite regulation and wellbeing."}</p></div>
          <div class="sleep-line">🌙 Avoid caffeine around 6 hours before bedtime.</div>
          <div class="sleep-line">🌙 Keep the bedroom cool, quiet and dark.</div>
          <div class="sleep-line">🌙 Maintain a consistent sleep schedule, including weekends.</div>
          <div class="sleep-line">🌙 Avoid very heavy meals close to bedtime.</div>
        </section>
      </div>
    </div>
    <div class="warning space">⚠ These recommendations are educational and do not replace professional medical or exercise advice. Adjust exercise for your fitness level, age and health status.</div>`;
}
else if(state.tab==="Health"){
  const risks=deficiencyRisks(p);
  const hc=(p.conditions||[]).filter(x=>x!=="None");
  const selected=state.healthCondition || hc[0] || "General Wellness";
  const guidance=healthGuidanceMap()[selected] || healthGuidanceMap()["General Wellness"];
  const answered=state.defAnswers.filter(x=>x!==null).length;
  const pct=answered*10;
  const allDone=answered===10;
  $("content").innerHTML=`
    <div class="health-grid">
      <section class="health-card">
        <div class="health-title"><span class="hico">🛡</span><div><h2>Deficiency Risk Check</h2><p>Profile-based educational flags, not a diagnosis</p></div></div>
        ${risks.map((r,i)=>`<div class="risk-card ${r[1].includes("Low")?"low":""}"><div class="risk-head"><span>${r[1].includes("Low")?"✓":"⚠"} ${r[0]}</span><span class="risk-level">${r[1]}</span></div><p>${r[2]}</p><p>Foods to consider: ${r[3]}</p></div>`).join("")}
      </section>

      <section class="health-card">
        <div class="health-title"><span class="hico heartico">♡</span><div><h2>Health Condition Guidance</h2><p>General dietary education for selected conditions</p></div></div>
        <select class="condition-select" onchange="setHealthCondition(this.value)">
          ${[...new Set([...(hc.length?hc:["General Wellness"]),"Diabetes","Hypertension / High BP","High Cholesterol","Anemia","Thyroid","General Wellness"])].map(x=>`<option ${x===selected?"selected":""}>${x}</option>`).join("")}
        </select>
        <div class="condition-box"><h3>${selected}</h3><ul>${guidance.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      </section>
    </div>

    <section class="prevent-card">
      <div class="health-title"><span class="hico heartico">🛡</span><div><h2>Lifestyle Disease Prevention</h2><p>Proactive habits for general wellness</p></div></div>
      <div class="prevent-grid">
        <div class="prevent"><h3>Heart Health</h3><p>• Choose nuts, seeds and other unsaturated-fat foods in sensible portions</p><p>• Limit highly salted packaged foods</p><p>• Build regular physical activity into your week</p></div>
        <div class="prevent"><h3>Diabetes Prevention</h3><p>• Prefer whole grains and higher-fiber carbohydrates</p><p>• Include vegetables and protein with meals</p><p>• Maintain a healthy routine around activity and sleep</p></div>
        <div class="prevent"><h3>Bone Health</h3><p>• Include calcium-rich foods or fortified alternatives</p><p>• Get safe sunlight exposure where appropriate</p><p>• Include age-appropriate weight-bearing activity</p></div>
      </div>
    </section>

    <section class="swaps-card">
      <div class="health-title"><span class="hico" style="background:#dff8ff;color:#2aa1ba">↗</span><div><h2>Smart Food Swaps</h2><p>Healthier alternatives you can try</p></div></div>
      ${smartSwaps().map(s=>`<div class="swap"><div class="swap-line"><span class="oldfood">${s[0]}</span><span>→</span><span class="newfood">${s[1]}</span></div><p>${s[2]}</p><p class="gain">${s[3]}</p></div>`).join("")}
    </section>

    <section class="checker">
      <div class="checker-head"><h2>🔬 Nutrient Deficiency Awareness Checker</h2><p>Answer 10 diet and lifestyle questions to identify possible areas to discuss or improve</p></div>
      <div class="questions">
        ${deficiencyQuestions.map((q,qi)=>`<div class="q"><div class="q-title"><b>${qi+1}.</b>${q[0]}</div><div class="answers">${q[1].map((a,ai)=>`<button class="ans ${state.defAnswers[qi]===ai?"sel":""}" onclick="setDefAnswer(${qi},${ai})">${a}</button>`).join("")}</div></div>`).join("")}
        <div class="check-progress"><span>${answered} of 10 answered</span><span>${pct}%</span></div>
        <div class="check-bar"><span style="width:${pct}%"></span></div>
        <button class="check-submit ${allDone?"ready":""}" onclick="validateDeficiencySubmit()">${allDone?"View Awareness Summary":"Complete all 10 questions to continue"}</button>
        <div id="defResults" class="check-result"></div>
        <div class="check-note">⚠ For educational awareness only. Symptoms are nonspecific and only appropriate clinical assessment and testing can diagnose a deficiency.</div>
      </div>
    </section>

    <div class="warning space">⚠ NutriAI provides general educational nutrition information. It does not diagnose deficiencies or health conditions and should not replace professional medical advice.</div>`;
}
else if(state.tab==="Tools"){
  const recipe=state.recipeText?recipeFromIngredients(state.recipeText,p):null;
  const metrics=demoScanMetrics();
  $("content").innerHTML=`
    <div class="tools-grid">
      <section class="tool-card">
        <div class="tool-title"><span class="tool-ico">🍲</span><div><h2>Smart Recipe Generator</h2><p>Personalized for your profile, goals & allergies</p></div></div>
        <div class="recipe-row">
          <input id="recipeInput" value="${state.recipeText.replaceAll('"','&quot;')}" placeholder="e.g. rice, dal, spinach, tomato...">
          <button class="spark-btn" onclick="generateRecipe()">✨</button>
        </div>
        <div class="recipe-chips">
          ${["Rice, dal, spinach","Oats, banana, almonds","Paneer, capsicum, onion","Ragi, milk, dates","Moong dal, vegetables, ginger"].map(x=>`<button class="recipe-chip" onclick="setRecipePreset('${x.replaceAll("'","\\'")}')">${x}</button>`).join("")}
        </div>
        ${recipe?`<div id="recipeResult" class="recipe-result">
          <h3>${recipe.title}</h3>
          <div class="recipe-meta"><span class="badge">🍴 ${p.diet}</span><span class="badge">🎯 ${p.goal}</span><span class="badge">⏱ ${cookingMeta().label}</span></div>
          <div class="recipe-step"><b>Use:</b> ${recipe.ingredients}</div>
          ${recipe.steps.map((s,i)=>`<div class="recipe-step"><b>${i+1}.</b> ${s}</div>`).join("")}
          <div class="nutri-line">${recipe.nutrition}</div>
        </div>`:""}
      </section>

      <section class="tool-card">
        <div class="tool-title"><span class="tool-ico purple">⌗</span><div><h2>Nutrient Label Scanner</h2><p>Upload a food label or packaged-food photo for a project demo analysis</p></div></div>

        <input id="scanInput" type="file" accept="image/*" style="display:none" onchange="handleScanFile(this)">
        ${!state.scanData?`
          <div class="upload-box" onclick="document.getElementById('scanInput').click()">
            <div><div class="upload-camera">📷</div><h3>Upload Food Label or Photo</h3><p>Choose a photo of any packaged-food label</p></div>
          </div>
        `:`
          <div class="scan-preview">
            <img src="${state.scanData.url}" alt="Uploaded food label preview">
            <div class="scan-info">
              <h3>${state.scanData.name}</h3>
              <p>${state.scanData.size} KB image loaded.</p>
              <p>This one-day standalone version does not perform OCR. It demonstrates the upload-and-analysis workflow safely.</p>
              <button class="primary scan-btn" onclick="analyzeUploadedLabel()">✨ Analyze Label</button>
              <button class="secondary scan-btn" onclick="resetScan()">Choose Another</button>
            </div>
          </div>
        `}
        ${state.scanAnalyzed?`<div class="scan-result">
          <h3>Demo Nutrition Review</h3>
          <div class="scan-grid">
            <div class="scan-metric">Calories<b>${metrics.calories}</b></div>
            <div class="scan-metric">Protein<b>${metrics.protein}</b></div>
            <div class="scan-metric">Added sugar<b>${metrics.sugar}</b></div>
            <div class="scan-metric">Sodium<b>${metrics.sodium}</b></div>
          </div>
          <p style="font-size:12px;color:#5d6879;line-height:1.45;margin:10px 0 0">${metrics.verdict}</p>
        </div>`:""}
        <div class="tool-warning">⚠ Image analysis in this offline project is a demo. Always read the actual package label for serving size, allergens, calories, sodium and exact nutrient values.</div>
      </section>
    </div>`;
}
else if(state.tab==="Grocery"){
  const gd=groceryData(p), flat=groceryFlat(p), checked=flat.filter(x=>state.groceryChecked[x]).length;
  const liters=Number(p.m.wat||2), glasses=Math.max(6,Math.round(liters*4));
  $("content").innerHTML=`
    <div class="grocery-layout">
      <section class="grocery-card">
        <div class="grocery-head">
          <div class="grocery-title"><span class="grocery-ico">🛒</span><div><h2>Smart Grocery List</h2><p>Based on your meal plan, diet and selected health conditions</p></div></div>
          <button class="refresh-btn" onclick="refreshGrocery()">↻ Refresh</button>
        </div>
        <div class="grocery-stat"><span>${flat.length} items total</span><span>${checked} checked</span></div>
        ${Object.entries(gd).map(([cat,items])=>`
          <div class="grocery-section">
            <h3>${cat}</h3>
            <div class="grocery-items">
              ${items.map(item=>`<label class="gitem ${state.groceryChecked[item]?"checked":""}"><input type="checkbox" ${state.groceryChecked[item]?"checked":""} onchange="toggleGrocery('${item.replaceAll("'","\\'")}')"><span>${item}</span></label>`).join("")}
            </div>
          </div>`).join("")}
        <div class="grocery-note">Items are suggestions for a project demo. Adjust quantities, brands and foods to your household needs, allergies and professional guidance.</div>
      </section>

      <aside class="side-stack">
        <section class="budget-card">
          <h2>💰 Budget Tips</h2>
          <div class="budget-tip">✅ Buy seasonal fruits and vegetables — they are often cheaper and fresher.</div>
          <div class="budget-tip">✅ Buy pulses and grains in bulk when practical.</div>
          <div class="budget-tip">✅ Cook at home more often to control cost and ingredients.</div>
          <div class="budget-tip">✅ Plan meals for the week to reduce food waste.</div>
          <div class="budget-tip">✅ Use local traditional staples that fit your region and budget.</div>
          <div class="budget-tip">✅ Compare unit prices rather than only package prices.</div>
        </section>

        <section class="water-card">
          <h2>💧 Water Intake Guide</h2>
          <div class="water-highlight"><strong>${liters.toFixed(1)} Liters / day</strong><p>Estimate based on your entered weight and profile.</p></div>
          <div class="water-list">
            • That's about ${glasses} glasses (250 ml each)<br>
            • Spread fluids across the day rather than drinking all at once<br>
            • Increase intake during exercise or hot weather when appropriate<br>
            • If you have kidney, heart, or fluid-restriction concerns, follow clinician advice
          </div>
        </section>
      </aside>
    </div>`;
}

else if(state.tab==="Family"){
  $("content").innerHTML=`
    <section class="family-shell">
      <div class="family-title"><span class="family-icon">👥</span><div><h2>Family Diet Mode</h2><p>Get age-appropriate meal suggestions for every family member</p></div></div>
      <div class="family-form">
        <input id="famName" placeholder="Name *">
        <input id="famAge" type="number" placeholder="Age *">
        <select id="famGender"><option>Male</option><option>Female</option><option>Other</option></select>
        <select id="famCondition"><option>None</option><option>Diabetes</option><option>Hypertension / High BP</option><option>High Cholesterol</option><option>Anemia</option><option>Thyroid</option></select>
      </div>
      <button class="family-add" onclick="addFamilyMember()">＋ Add Family Member</button>

      ${!state.familyMembers.length?`
        <div class="family-empty"><div><div style="font-size:42px">👥</div><strong>No family members added yet</strong><p style="font-size:12px">Add a member above to see their personalized meal suggestion.</p></div></div>
      `:`
        <div class="family-grid">${state.familyMembers.map(m=>{const fp=familyMealPlan(m);return `
          <div class="family-card">
            <h3>${m.name}</h3>
            <div class="meta">${m.age} years • ${m.gender} • ${m.condition}</div>
            <div class="family-plan"><b>Breakfast:</b> ${fp.breakfast}<br><b>Lunch:</b> ${fp.lunch}<br><b>Dinner:</b> ${fp.dinner}<br><br><b>Note:</b> ${fp.note}</div>
            <button class="family-remove" onclick="removeFamilyMember(${m.id})">Remove</button>
          </div>`}).join("")}</div>
      `}
    </section>`;
}
else if(state.tab==="Progress"){
  const summary=progressSummary(), info=progressMetricInfo();
  $("content").innerHTML=`
    <div class="progress-head">
      <div><h2>Health Progress Tracker</h2><p>Track your wellness journey over time</p></div>
      <button class="progress-add" onclick="toggleProgressForm()">＋ ${state.progressOpen?"Close":"Log Today's Progress"}</button>
    </div>

    ${state.progressOpen?`
      <section class="progress-form">
        <div class="progress-fields">
          <div class="progress-field"><label>Weight (kg)</label><input id="progWeight" type="number" step="0.1" value="${summary?summary.latest.weight:p.weight}"></div>
          <div class="progress-field"><label>Water (L)</label><input id="progWater" type="number" step="0.1" value="${summary?summary.latest.water:p.m.wat}"></div>
          <div class="progress-field"><label>Sleep (hours)</label><input id="progSleep" type="number" step="0.1" value="${summary?summary.latest.sleep:(+p.age<18?9:8)}"></div>
          <div class="progress-field"><label>Activity (min)</label><input id="progActivity" type="number" value="${summary?summary.latest.activity:30}"></div>
          <div class="progress-field"><label>Mood (1–5)</label><input id="progMood" type="number" min="1" max="5" value="${summary?summary.latest.mood:4}"></div>
        </div>
        <div class="progress-actions"><button class="secondary" onclick="toggleProgressForm()">Cancel</button><button class="primary" onclick="addProgress()">Save Progress</button></div>
      </section>`:""}

    ${!state.progressLogs.length?`
      <div class="empty-progress">
        <div><div style="font-size:42px">↗</div><strong>No progress logged yet</strong><p>Click “Log Today's Progress” to start tracking and generate your graph.</p></div>
      </div>
    `:`
      <div class="progress-grid">
        <section class="graph-card">
          <div class="graph-top">
            <div><h3>${info.label} Trend</h3><p>${state.progressLogs.length} saved progress entr${state.progressLogs.length===1?"y":"ies"}</p></div>
            <div class="metric-tabs">
              ${[["wellness","Wellness"],["weight","Weight"],["water","Water"],["sleep","Sleep"],["activity","Activity"]].map(m=>`<button class="metric-tab ${state.progressMetric===m[0]?"sel":""}" onclick="setProgressMetric('${m[0]}')">${m[1]}</button>`).join("")}
            </div>
          </div>
          ${progressChartSvg()}
        </section>

        <aside class="progress-stats">
          <h3 style="margin:0 0 12px;font-size:16px">Current Snapshot</h3>
          <div class="statbox"><small>Latest wellness score</small><b class="stat-good">${summary.latest.wellness}/100</b></div>
          <div class="statbox"><small>Weight change</small><b>${Number(summary.weightChange)>0?"+":""}${summary.weightChange} kg</b></div>
          <div class="statbox"><small>Average water</small><b>${summary.avgWater} L/day</b></div>
          <div class="statbox"><small>Average sleep</small><b>${summary.avgSleep} h/night</b></div>
          <div class="statbox"><small>Average activity</small><b>${summary.avgActivity} min</b></div>
          <button class="secondary" style="width:100%;margin-top:8px" onclick="clearProgress()">Clear Progress</button>
        </aside>
      </div>

      <section class="progress-history">
        <h3>Progress History</h3>
        <table class="history-table">
          <tr><th>Date</th><th>Weight</th><th>Water</th><th>Sleep</th><th>Activity</th><th>Wellness</th></tr>
          ${state.progressLogs.slice().reverse().map(r=>`<tr><td>${r.date}</td><td>${r.weight} kg</td><td>${r.water} L</td><td>${r.sleep} h</td><td>${r.activity} min</td><td>${r.wellness}/100</td></tr>`).join("")}
        </table>
      </section>
    `}
    <div class="progress-note">⚠ For educational tracking only. Daily weight and wellness values naturally fluctuate and should not be used as a medical diagnosis.</div>`;
}
else if(state.tab==="Ingredients"){
  const quick=["Rice","Wheat flour","Toor dal","Moong dal","Chana","Paneer","Tofu","Eggs","Chicken","Spinach","Tomato","Onion","Potato","Carrot","Curd","Milk","Oats","Ragi","Banana","Apple","Ginger","Garlic","Capsicum","Lemon"];
  const ingredientReady=state.ingredients.length>0 || state.ingredientDraft.trim().length>0;
  $("content").innerHTML=`
    <section class="feature-shell">
      <div class="feature-title"><span class="feature-icon">🍲</span><div><h2>Ingredient-Based Meal Planner</h2><p>Choose ingredients or type what you have. The green button generates your plan only after you click it.</p></div></div>

      <div class="full-row">
        <input id="ingredientInput" value="${escapeNutriText(state.ingredientDraft)}" placeholder="Type ingredients, e.g. paneer, spinach, tomato..." oninput="setIngredientDraft(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();addIngredient()}">
        <button class="square-add" onclick="addIngredient()">＋</button>
      </div>

      <div class="quick-chips">${quick.map(function(x){return `<button class="quick-chip ${state.ingredients.includes(x)?"sel":""}" onclick="addIngredient('${x.replaceAll("'","\\'")}')">+ ${x}</button>`}).join("")}</div>

      ${state.ingredients.length?`<div class="selected-ingredients">${state.ingredients.map(function(x){return `<button class="ingredient-token" onclick="removeIngredient('${x.replaceAll("'","\\'")}')">${escapeNutriText(x)}<span>×</span></button>`}).join("")}</div>`:""}

      <button id="ingredientGenerateBtn" class="action-wide conditional-action ${ingredientReady?"ready":""}" ${ingredientReady?"":"disabled"} onclick="generateIngredientMeals()">✨ Generate Meal Plan</button>

      ${state.ingredientMeals?`
        <div class="generated-guide">
          <h3>🍽️ Your Ingredient-Based Meal Plan</h3>
          <p style="font-size:13px;color:#647084">Using: <b>${state.ingredients.map(escapeNutriText).join(", ")}</b></p>
          <div class="guide-grid">
            ${state.ingredientMeals.map(function(item){
              const m=item.meal;
              const macros=(m.calories==="—")
                ?"Nutrition estimate unavailable"
                :`🔥 ${m.calories} kcal · P ${m.protein}g · C ${m.carbs}g · F ${m.fat}g · Fiber ${m.fiber}g`;
              return `<div class="guide-card">
                <h4>${item.label}</h4>
                <b>${escapeNutriText(m.name)}</b>
                <div class="macro-line">${macros}</div>
                <p><b>Portion:</b> ${escapeNutriText(m.portion||"1 serving")}</p>
                <p>${item.score>0?`Matches ${item.score} selected ingredient${item.score===1?"":"s"} in the meal database.`:"Suggested from your Base44 meal database for the current profile."}</p>
              </div>`;
            }).join("")}
          </div>
          <p style="font-size:12px;color:#6f7b8e;margin-top:12px">Meal matching is approximate. Check allergies, ingredients and nutrition independently.</p>
        </div>`:""}
    </section>`;
}
else if(state.tab==="Restaurant"){
  const chains=["McDonald's","Domino's","Subway","Haldiram's","KFC","Starbucks","Burger King","Pizza Hut"];
  const cuisines=["North Indian","South Indian","Chinese","Italian","Mexican","Thai","Mughlai","Continental"];
  const chosen=restaurantName();
  const restaurantReady=chosen.length>0;
  const guide=restaurantGuide(p);

  $("content").innerHTML=`
    <section class="feature-shell">
      <div class="feature-title"><span class="feature-icon" style="background:#ffe9ec;color:#e76472">🍴</span><div><h2>Restaurant Healthy Choice Guide</h2><p>Select a restaurant/cuisine or type a name. The button turns green when ready.</p></div></div>

      <div class="choice-label">Popular Chains</div>
      <div class="choice-cloud">${chains.map(function(x){return `<button class="choice-pill ${state.restaurantChoice===x&&!state.restaurantText?"sel":""}" onclick="setRestaurant('${x.replaceAll("'","\\'")}','chain')">${x}</button>`}).join("")}</div>

      <div class="choice-label">Cuisines</div>
      <div class="choice-cloud">${cuisines.map(function(x){return `<button class="choice-pill ${state.restaurantChoice===x&&!state.restaurantText?"sel":""}" onclick="setRestaurant('${x.replaceAll("'","\\'")}','cuisine')">${x}</button>`}).join("")}</div>

      <div class="choice-label">Or type a restaurant</div>
      <div class="full-row">
        <input id="restaurantCustom" value="${escapeNutriText(state.restaurantText)}" placeholder="Type restaurant name..." oninput="setRestaurantText(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();restaurantGenerate()}">
      </div>

      <button id="restaurantGenerateBtn" class="action-wide conditional-action space ${restaurantReady?"ready":""}" ${restaurantReady?"":"disabled"} onclick="restaurantGenerate()">✨ Get Healthy Options for ${escapeNutriText(chosen||"your restaurant")}</button>

      ${state.restaurantGenerated?`
        <div class="restaurant-report">
          <h3>🥗 Healthy Choice Guide — ${escapeNutriText(chosen)}</h3>
          <p>Personalized for <b>${escapeNutriText(p.diet)}</b> · <b>${escapeNutriText(p.goal)}</b>${p.conditions&&p.conditions.length?` · ${p.conditions.map(escapeNutriText).join(", ")}`:""}</p>

          <div class="report-section"><b>🍽️ Best balanced option</b><p>${escapeNutriText(guide.best)}</p></div>
          <div class="report-section"><b>🔄 Healthier alternative</b><p>${escapeNutriText(guide.alternative)}</p></div>
          <div class="report-section"><b>🥤 Drink choice</b><p>${escapeNutriText(guide.drink)}</p></div>
          <div class="report-section"><b>⚠ Enjoy in moderation</b><p>${escapeNutriText(guide.watch)}</p></div>
          <div class="report-section"><b>💡 Pro tip</b><p>${escapeNutriText(guide.tip)}</p></div>

          <p style="font-size:12px;font-style:italic;margin-top:12px">${escapeNutriText(guide.disclaimer)}</p>
        </div>`:""}
    </section>`;
}
else if(state.tab==="Festival"){
  const festivals=[["Diwali","▤","Festival of Lights"],["Holi","🎨","Festival of Colors"],["Navratri","🕉️","Nine Nights"],["Eid","🌙","Eid Celebration"],["Christmas","🎄","Christmas Feast"],["Pongal","🌾","Harvest Festival"],["Onam","🌺","Onam Sadhya"],["Baisakhi","🌻","Punjab Harvest"]];
  const advice=festivalAdvice(state.festival,p);
  $("content").innerHTML=`
    <section class="feature-shell">
      <div class="feature-title"><span class="feature-icon" style="background:#f7e8ff;color:#a04fe9">🎉</span><div><h2>Festival Mode</h2><p>Celebrate guilt-free — healthier festive eating, personalized</p></div></div>
      <div class="festival-grid">${festivals.map(f=>`<button class="festival-card ${state.festival===f[0]?"sel":""}" onclick="selectFestival('${f[0]}')"><span class="emoji">${f[1]}</span><b>${f[0]}</b><small>${f[2]}</small></button>`).join("")}</div>
      ${state.festival?`<div class="festival-result"><h3>${state.festival} Smart Celebration Tips</h3>${advice.map(x=>`<p>✓ ${x}</p>`).join("")}<p><b>Personalized note:</b> Keep your ${p.goal.toLowerCase()} goal in mind without trying to make festival eating “perfect.”</p></div>`:""}
    </section>`;
}
else if(state.tab==="Eco"){
  $("content").innerHTML=`
    <section class="feature-shell">
      <div class="feature-title"><span class="feature-icon" style="background:#e5faea;color:#46a864">🍃</span><div><h2>Carbon Footprint Calculator</h2><p>Estimate and compare the environmental impact of meals</p></div></div>
      <div class="eco-grid">
        <input id="ecoA" value="${state.ecoA.replaceAll('"','&quot;')}" placeholder="Meal A (e.g. Chicken Biryani)">
        <input id="ecoB" value="${state.ecoB.replaceAll('"','&quot;')}" placeholder="Meal B (optional, to compare)">
      </div>
      <div class="eco-preset">${Object.keys(ecoEstimates).map(x=>`<button onclick="ecoPreset('${x}','${state.ecoA?"b":"a"}')">${x}</button>`).join("")}</div>
      <button class="action-wide space" onclick="calculateEco()">✨ Calculate Carbon Footprint</button>
      ${state.ecoResult?`<div class="eco-result">
        <div class="eco-card"><h3>${state.ecoResult.a.name}</h3><div class="eco-score">${state.ecoResult.a.val.toFixed(1)}</div><p>Illustrative kg CO₂e-style project estimate per meal.</p></div>
        ${state.ecoResult.b?`<div class="eco-card"><h3>${state.ecoResult.b.name}</h3><div class="eco-score">${state.ecoResult.b.val.toFixed(1)}</div><p>Illustrative kg CO₂e-style project estimate per meal.</p></div>
        <div class="eco-compare">${state.ecoResult.a.val<state.ecoResult.b.val?state.ecoResult.a.name:state.ecoResult.b.name} has the lower illustrative impact in this demo.</div>`:""}
      </div>`:""}
      <div class="eco-note">🌱 These carbon values are simplified illustrative project estimates, not audited lifecycle-assessment data. Actual impact depends on ingredients, farming, transport, portions and preparation.</div>
    </section>`;
}

else if(state.tab==="Cravings"){
  const cravings=["Sweet","Salty","Spicy","Crunchy","Creamy","Refreshing","Chocolate","Fast Food","Very Hungry"];
  const sug=cravingSuggestions(p);
  $("content").innerHTML=`
    <section class="mode-shell">
      <div class="mode-title"><span class="mode-icon">♡</span><div><h2>NutriAI Craving Mode</h2><p>Satisfy the craving while finding options that fit your profile.</p></div></div>
      <div class="mode-label">What are you craving?</div>
      <div class="choice-grid craving-grid">${cravings.map(c=>`<button class="choice-btn ${state.cravingChoice===c?"selected":""}" onclick="setCravingChoice('${c.replaceAll("'","\\'")}')">${c}</button>`).join("")}</div>

      <div class="mode-result-grid">
        ${sug.map((s,i)=>`<article class="mode-card">
          <div class="match-pill">Craving Match</div>
          <h3>${s[0]}</h3>
          <div class="mode-metrics"><span>🔥 ${s[1]} kcal</span><span>💪 ${s[2]}g protein</span><span>⏱ ${s[4]}</span></div>
          <p>${s[3]}</p>
          <p class="mode-why"><b>Why for you:</b> Fits your ${p.diet.toLowerCase()} preference and gives you a practical alternative for a ${state.cravingChoice.toLowerCase()} craving.</p>
          <div class="mode-actions"><button class="primary" onclick="chooseCraving(${i})">Choose This</button><button class="secondary" onclick="addCravingToday(${i})">Add to Today</button></div>
        </article>`).join("")}
      </div>
      <div class="mode-footer-actions"><button class="secondary" onclick="anotherCraving()">↻ Another Option</button></div>
      ${state.cravingSelected?`<div class="success-note">✓ Selected: <b>${state.cravingSelected}</b></div>`:""}
      ${state.cravingAdded?`<div class="success-note">✓ Added to today's demo plan: <b>${state.cravingAdded}</b></div>`:""}
      <div class="mode-note">Cravings are normal. NutriAI does not label foods as “good” or “bad”; this tool simply offers practical choices.</div>
    </section>`;
}
else if(state.tab==="Lunchbox"){
  const results=lunchboxResults(p);
  $("content").innerHTML=`
    <section class="mode-shell">
      <div class="mode-title"><span class="mode-icon">▣</span><div><h2>NutriAI Smart Lunchbox</h2><p>Portable lunch ideas for school, college or work.</p></div></div>
      <div class="option-columns">
        <div><div class="mode-label">Lunchbox for</div><div class="choice-grid">${["School","College","Office"].map(x=>`<button class="choice-btn ${state.lunchboxFor===x?"selected":""}" onclick="setLunchboxOption('lunchboxFor','${x}')">${x}</button>`).join("")}</div></div>
        <div><div class="mode-label">Preparation time</div><div class="choice-grid">${["5","10","20","30"].map(x=>`<button class="choice-btn ${state.lunchboxTime===x?"selected":""}" onclick="setLunchboxOption('lunchboxTime','${x}')">${x} min</button>`).join("")}</div></div>
      </div>
      <div class="mode-label">Preference</div>
      <div class="choice-grid">${["No reheating","Can reheat","Mess-free","High protein","Budget friendly"].map(x=>`<button class="choice-btn ${state.lunchboxPref===x?"selected":""}" onclick="setLunchboxOption('lunchboxPref','${x.replaceAll("'","\\'")}')">${x}</button>`).join("")}</div>
      <button class="primary mode-generate" onclick="generateLunchbox()">✨ Generate Lunchbox</button>

      ${state.lunchboxGenerated?`<div class="mode-result-grid">
        ${results.map((x,i)=>`<article class="mode-card">
          <div class="match-pill">${state.lunchboxFor} • ${state.lunchboxPref}</div>
          <h3>${x[0]}</h3>
          <div class="lunch-list"><b>Main:</b> ${x[0]}<br><b>Side:</b> ${x[1]}<br><b>Snack/Fruit:</b> ${x[2]}<br><b>Drink:</b> ${x[3]}</div>
          <div class="mode-metrics"><span>🔥 ${x[4]} kcal</span><span>💪 ${x[5]}g protein</span><span>⏱ ~${state.lunchboxTime} min target</span></div>
          <div class="mode-actions"><button class="primary" onclick="packLunchbox(${i})">Pack This</button><button class="secondary" onclick="lunchboxAddGrocery(${i})">Add to Grocery</button></div>
        </article>`).join("")}
      </div>
      <div class="mode-footer-actions"><button class="secondary" onclick="regenerateLunchbox()">↻ Regenerate</button></div>`:""}
      ${state.lunchboxPacked?`<div class="success-note">✓ ${state.lunchboxPacked}</div>`:""}
      <div class="mode-note">For packed foods that normally require refrigeration, use appropriate cold storage and safe food-handling practices.</div>
    </section>`;
}
else if(state.tab==="Sports"){
  const sp=sportsModePlan(p);
  $("content").innerHTML=`
    <section class="mode-shell">
      <div class="mode-title"><span class="mode-icon">⌁</span><div><h2>NutriAI Sports Mode</h2><p>Fuel, hydration and recovery guidance around your activity.</p></div></div>
      <div class="mode-label">Sport</div>
      <div class="choice-grid sports-grid">${["Cricket","Football","Running","Cycling","Swimming","Basketball","Badminton","Gym / Strength Training"].map(x=>`<button class="choice-btn ${state.sportType===x?"selected":""}" onclick="setSportsOption('sportType','${x.replaceAll("'","\\'")}')">${x}</button>`).join("")}</div>

      <div class="option-columns">
        <div><div class="mode-label">Intensity</div><div class="choice-grid">${["Light","Moderate","Hard"].map(x=>`<button class="choice-btn ${state.sportIntensity===x?"selected":""}" onclick="setSportsOption('sportIntensity','${x}')">${x}</button>`).join("")}</div></div>
        <div><div class="mode-label">Duration</div><div class="choice-grid">${["30","45","60","90","120"].map(x=>`<button class="choice-btn ${state.sportDuration===x?"selected":""}" onclick="setSportsOption('sportDuration','${x}')">${x} min</button>`).join("")}</div></div>
      </div>
      <div class="mode-label">Training time</div>
      <div class="choice-grid">${["Morning","Afternoon","Evening"].map(x=>`<button class="choice-btn ${state.sportTiming===x?"selected":""}" onclick="setSportsOption('sportTiming','${x}')">${x}</button>`).join("")}</div>
      <button class="primary mode-generate" onclick="generateSportsMode()">⚡ Generate Sports Plan</button>

      ${state.sportsGenerated?`<div class="sports-plan-grid">
        <article class="mode-card accent-blue"><span class="plan-kicker">BEFORE TRAINING</span><h3>${sp.pre}</h3><p>${sp.when}</p></article>
        <article class="mode-card accent-green"><span class="plan-kicker">AFTER TRAINING</span><h3>${sp.post}</h3><p>${sp.recovery}</p></article>
        <article class="mode-card accent-cyan"><span class="plan-kicker">HYDRATION</span><h3>💧 Hydration plan</h3><p>${sp.hydration}</p></article>
        <article class="mode-card accent-orange"><span class="plan-kicker">TODAY'S SPORTS TIP</span><h3>${state.sportType}</h3><p>Focus on ${sp.focus}. ${sp.note}</p></article>
      </div>`:""}
      <div class="mode-note">Sports Mode provides general educational guidance, not individualized sports-medicine advice or supplement prescriptions.</div>
    </section>`;
}
else if(state.tab==="Travel"){
  const ts=travelSnacks(p), tp=travelPlan(p);
  $("content").innerHTML=`
    <section class="mode-shell">
      <div class="mode-title"><span class="mode-icon">✈</span><div><h2>NutriAI Travel Mode</h2><p>Eat smarter while travelling.</p></div></div>
      <div class="mode-label">1 · Trip type</div>
      <div class="choice-grid travel-grid">${["Road Trip","Flight","Train Journey","Bus Journey","School Trip","Office Travel","Vacation","Long Commute"].map(x=>`<button class="choice-btn ${state.travelType===x?"selected":""}" onclick="setTravelOption('travelType','${x}')">${x}</button>`).join("")}</div>
      <div class="option-columns">
        <div><div class="mode-label">2 · Journey duration</div><div class="choice-grid">${["Under 2 hours","2–4 hours","4–8 hours","8–12 hours","Full Day","Multiple Days"].map(x=>`<button class="choice-btn ${state.travelDuration===x?"selected":""}" onclick="setTravelOption('travelDuration','${x}')">${x}</button>`).join("")}</div></div>
        <div><div class="mode-label">3 · Travel time</div><div class="choice-grid">${["Early Morning","Morning","Afternoon","Evening","Overnight"].map(x=>`<button class="choice-btn ${state.travelTime===x?"selected":""}" onclick="setTravelOption('travelTime','${x}')">${x}</button>`).join("")}</div></div>
      </div>
      <div class="mode-label">4 · Food access</div>
      <div class="choice-grid">${["Carrying food from home","Buying food on the way","Restaurant / café","Airport food","Limited food options","Not sure"].map(x=>`<button class="choice-btn ${state.travelFoodAccess===x?"selected":""}" onclick="setTravelOption('travelFoodAccess','${x.replaceAll("'","\\'")}')">${x}</button>`).join("")}</div>
      <div class="mode-label">5 · Priority</div>
      <div class="choice-grid">${["High Protein","Budget Friendly","Light & Easy","No Refrigeration Needed","Mess Free","Hydration Focus"].map(x=>`<button class="choice-btn ${state.travelPriority===x?"selected":""}" onclick="setTravelOption('travelPriority','${x}')">${x}</button>`).join("")}</div>
      <button class="primary mode-generate" onclick="generateTravelMode()">✈ Generate Travel Plan</button>

      ${state.travelGenerated?`
        <div class="travel-summary">
          <div class="travel-strip"><b>${state.travelType}</b><span>${state.travelDuration}</span><span>${state.travelTime}</span><span>${state.travelPriority}</span></div>
          <div class="sports-plan-grid">
            <article class="mode-card accent-green"><span class="plan-kicker">BEFORE TRAVEL</span><h3>Balanced departure meal</h3><p>${tp.before}</p></article>
            <article class="mode-card accent-blue"><span class="plan-kicker">DURING JOURNEY</span><h3>Simple travel timeline</h3><p>${tp.timeline}</p></article>
            <article class="mode-card accent-cyan"><span class="plan-kicker">HYDRATION</span><h3>💧 Stay hydrated</h3><p>${tp.hydration}</p></article>
            <article class="mode-card accent-orange"><span class="plan-kicker">${state.travelType.toUpperCase()}</span><h3>Travel-specific guidance</h3><p>${tp.special}</p></article>
          </div>
          <h3 class="mode-subhead">Smart Travel Snacks</h3>
          <div class="mode-result-grid">${ts.map(x=>`<article class="mode-card"><div class="match-pill">${x[3]}</div><h3>${x[0]}</h3><div class="mode-metrics"><span>🔥 ${x[1]} kcal</span><span>💪 ${x[2]}g protein</span></div><p>${x[4]}</p></article>`).join("")}</div>
          <div class="mode-footer-actions"><button class="secondary" onclick="regenerateTravel()">↻ More Snack Options</button></div>
          <div class="travel-check"><h3>🎒 Travel Food Checklist</h3><label><input type="checkbox"> Water bottle</label><label><input type="checkbox"> Main packed meal</label><label><input type="checkbox"> Portable snack</label><label><input type="checkbox"> Fruit</label><label><input type="checkbox"> Napkins / cutlery if needed</label></div>
          <div class="mode-note warning-soft">Food safety: ${tp.safety}</div>
        </div>`:""}
    </section>`;
}

else if(state.tab==="Reminders"){
  $("content").innerHTML=renderReminderTab(p);
}
else if(state.tab==="Fitness"){
  const fp=fitnessPlan(p);
  $("content").innerHTML=`
    <section class="fit-shell">
      <div class="fit-top">
        <div class="fit-heading"><span class="fit-heading-icon">〽</span><div><h2>Yoga & Fitness Recommendations</h2><p>Personalized for your BMI, age, goal & selected conditions</p></div></div>
        <button class="regen" onclick="regenerateFitness(this)">↻ Regenerate</button>
      </div>
      <div class="fit-summary">🎯 ${fp.focus}${fp.teen?" Because you are under 18, keep intensity age-appropriate and involve a parent/guardian or qualified professional for structured training.":""}</div>

      <div class="fit-section-label yoga">🧘 Yoga Poses</div>
      <div class="fit-cards">${fp.plan.yoga.map(fitCard).join("")}</div>

      <div class="fit-section-label stretch">🏃 Stretching</div>
      <div class="fit-cards">${fp.plan.stretch.map(fitCard).join("")}</div>

      <div class="fit-section-label cardio">🏃 Cardio</div>
      <div class="fit-cards">${fp.plan.cardio.map(fitCard).join("")}</div>

      <div class="fit-section-label strength">💪 Strength Training</div>
      <div class="fit-cards">${fp.plan.strength.map(fitCard).join("")}</div>

      <div class="fit-section-label breath">🌬 Breathing (Pranayama)</div>
      <div class="fit-cards">${fp.plan.breath.map(fitCard).join("")}</div>

      <div class="fit-footer">⚠ For educational purposes. Consult a qualified healthcare or exercise professional before starting a new exercise routine, especially with medical conditions, injuries, pregnancy, or if you are under 18.</div>
    </section>`;
}
else if(state.tab==="Compare"){
  const r=state.compareResult;
  $("content").innerHTML=`
    <section class="compare-shell">
      <div class="compare-title"><span class="compare-icon">⚖</span><div><h2>AI Food Comparator</h2><p>Compare any two foods — personalized to your health goal</p></div></div>
      <div class="compare-inputs">
        <input id="compareA" value="${state.compareA.replaceAll('"','&quot;')}" placeholder="Food A (e.g. Paneer)">
        <input id="compareB" value="${state.compareB.replaceAll('"','&quot;')}" placeholder="Food B (e.g. Tofu)">
      </div>
      <div class="compare-presets">
        <button class="compare-chip" onclick="setComparePreset('Paneer','Tofu')">Paneer vs Tofu</button>
        <button class="compare-chip" onclick="setComparePreset('Brown Rice','White Rice')">Brown Rice vs White Rice</button>
        <button class="compare-chip" onclick="setComparePreset('Butter','Olive Oil')">Butter vs Olive Oil</button>
        <button class="compare-chip" onclick="setComparePreset('Apple Juice','Whole Apple')">Apple Juice vs Whole Apple</button>
        <button class="compare-chip" onclick="setComparePreset('Roti','Bread')">Roti vs Bread</button>
        <button class="compare-chip" onclick="setComparePreset('Jaggery','Sugar')">Jaggery vs Sugar</button>
      </div>
      <button class="compare-action" onclick="compareFoodsAdvanced()">✨ Compare Foods</button>

      ${r?`
        <div class="compare-results">
          <div class="compare-winner">🏆 <b>${r.winner==="Tie"?"The foods score similarly in this simplified demo.":r.winner+" scores better for your current goal in this simplified comparison."}</b><br>Portion size, preparation, allergies and your full diet still matter.</div>
          <div class="compare-grid">
            ${[r.a,r.b].map(x=>`<div class="compare-food-card"><span class="compare-score">${x.score}/100</span><h3>${x.name}</h3><div style="font-size:12px;color:#7c8798">${x.label}</div><div class="compare-metrics"><div class="compare-metric"><small>Calories</small><b>${x.cal}</b></div><div class="compare-metric"><small>Protein</small><b>${x.protein}g</b></div><div class="compare-metric"><small>Carbs</small><b>${x.carbs}g</b></div><div class="compare-metric"><small>Fat</small><b>${x.fat}g</b></div><div class="compare-metric"><small>Fiber</small><b>${x.fiber}g</b></div><div class="compare-metric"><small>Your goal</small><b>${p.goal}</b></div></div><div class="compare-notes">${x.note}</div></div>`).join("")}
          </div>
          <table class="compare-table2">
            <tr><th>Metric</th><th>${r.a.name}</th><th>${r.b.name}</th></tr>
            <tr><td>Calories / 100g</td><td>${r.a.cal}</td><td>${r.b.cal}</td></tr>
            <tr><td>Protein</td><td>${r.a.protein}g</td><td>${r.b.protein}g</td></tr>
            <tr><td>Carbs</td><td>${r.a.carbs}g</td><td>${r.b.carbs}g</td></tr>
            <tr><td>Fat</td><td>${r.a.fat}g</td><td>${r.b.fat}g</td></tr>
            <tr><td>Fiber</td><td>${r.a.fiber}g</td><td>${r.b.fiber}g</td></tr>
          </table>
        </div>`:""}
      <div class="tool-warning">⚠ Nutrition values are approximate demo values and vary by brand, recipe and serving size. Use current verified nutrition information for exact decisions.</div>
    </section>`;
}
else $("content").innerHTML=basic(state.tab,`<div class="grid2"><div class="mini"><h3>${state.tab} feature</h3><p>This tab is functional as a project demo and can be expanded after submission.</p></div><div class="mini"><h3>Personalized for ${p.name}</h3><p>${p.diet} • ${p.goal} • ${p.region}</p></div></div>`)}
let saved=null;
try{saved=JSON.parse(safeStorage.getItem("nutriProfile")||"null")}catch(e){saved=null}
if(saved){state.profile=saved}
loadProgress();
loadFamily();
stepUI();
