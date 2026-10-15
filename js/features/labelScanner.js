function labelScannerEscape(value){
  return String(value==null?"":value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]});
}
function labelScannerNumber(text, patterns){
  for(const pattern of patterns){
    const match=String(text||"").match(pattern);
    if(match){
      const n=parseFloat(String(match[1]).replace(",","."));
      if(Number.isFinite(n))return n;
    }
  }
  return null;
}
function labelScannerServing(text){
  const match=String(text||"").match(/serving\s*size\s*[:\-]?\s*([^\n\r]+)/i) || String(text||"").match(/per\s*serving\s*[:\-]?\s*([^\n\r]+)/i);
  return match?match[1].trim().slice(0,80):"Not detected";
}
function parseNutrientLabel(text){
  const t=String(text||"").replace(/\r/g,"\n");
  const calories=labelScannerNumber(t,[/calories?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)/i,/energy\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*k?cal/i,/\b(\d+(?:[.,]\d+)?)\s*kcal\b/i]);
  const protein=labelScannerNumber(t,[/protein\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const carbs=labelScannerNumber(t,[/(?:total\s+)?carbohydrate(?:s)?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i,/carbs?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const fat=labelScannerNumber(t,[/(?:total\s+)?fat\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const saturatedFat=labelScannerNumber(t,[/saturated\s+fat\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i,/saturates?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const fiber=labelScannerNumber(t,[/(?:dietary\s+)?fibe?r\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const sugars=labelScannerNumber(t,[/(?:total\s+)?sugars?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const addedSugar=labelScannerNumber(t,[/added\s+sugars?\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*g/i]);
  const sodium=labelScannerNumber(t,[/sodium\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*mg/i]);
  const cholesterol=labelScannerNumber(t,[/cholesterol\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*mg/i]);
  const ironMg=labelScannerNumber(t,[/iron\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*mg/i]);
  const calciumMg=labelScannerNumber(t,[/calcium\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*mg/i]);
  return {serving:labelScannerServing(t),calories,protein,carbs,fat,saturatedFat,fiber,sugars,addedSugar,sodium,cholesterol,ironMg,calciumMg,raw:t};
}
function labelScannerAllergenHits(text,p){
  const raw=String(text||"").toLowerCase();
  const tokens=String((p&&p.allergies)||"").split(/[,;|]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
  return [...new Set(tokens.filter(x=>raw.includes(x)))];
}
function labelScannerAnalyze(parsed,p){
  let score=70;
  const positives=[],cautions=[];
  const n=(v)=>typeof v==="number"&&Number.isFinite(v);
  const conditions=(p.conditions||[]).map(x=>String(x).toLowerCase());
  const allergies=labelScannerAllergenHits(parsed.raw,p);
  if(allergies.length){score-=45;cautions.push(`Entered allergen text detected: ${allergies.join(", ")}. Do not rely on OCR alone—verify the package allergen statement.`)}
  if(n(parsed.protein)){if(parsed.protein>=10){score+=7;positives.push("Provides a meaningful amount of protein per listed serving.")}else if(parsed.protein<3)cautions.push("Protein is relatively low per listed serving.")}
  if(n(parsed.fiber)){if(parsed.fiber>=3){score+=8;positives.push("Contains at least 3 g fiber per listed serving.")}else if(parsed.fiber<1)cautions.push("Fiber is low per listed serving.")}
  if(n(parsed.addedSugar)){if(parsed.addedSugar<=5){score+=6;positives.push("Added sugar appears moderate/low per listed serving.")}else if(parsed.addedSugar>=10){score-=10;cautions.push("Added sugar is relatively high per listed serving.")}}
  else if(n(parsed.sugars)&&parsed.sugars>=15){score-=5;cautions.push("Total sugar is relatively high; check whether it is naturally occurring or added.")}
  if(n(parsed.sodium)){if(parsed.sodium<=140){score+=6;positives.push("Sodium is relatively low per listed serving.")}else if(parsed.sodium>=400){score-=12;cautions.push("Sodium is high per listed serving.")}}
  if(n(parsed.saturatedFat)){if(parsed.saturatedFat<=2){score+=5;positives.push("Saturated fat is relatively low per listed serving.")}else if(parsed.saturatedFat>=5){score-=9;cautions.push("Saturated fat is relatively high per listed serving.")}}
  if(p.goal==="Weight Loss"&&n(parsed.calories)){if(parsed.calories<=250)score+=4;else if(parsed.calories>=450){score-=5;cautions.push("This serving is calorie-dense; portion size matters for your selected goal.")}}
  if(p.goal==="Muscle Building"&&n(parsed.protein)){if(parsed.protein>=15)score+=7;else cautions.push("Protein may be modest for a protein-focused snack/meal; compare with the full meal context.")}
  if(conditions.some(c=>c.includes("hypertension")||c.includes("high bp"))&&n(parsed.sodium)&&parsed.sodium>=300){score-=8;cautions.push("Because high blood pressure is selected, compare this sodium amount with your clinician's daily target.")}
  if(conditions.some(c=>c.includes("diabet")||c.includes("pcos")||c.includes("pcod"))){
    if(n(parsed.addedSugar)&&parsed.addedSugar>=8){score-=8;cautions.push("Added sugar deserves extra attention with your selected glucose-related condition.")}
    if(n(parsed.fiber)&&parsed.fiber>=3)score+=3;
  }
  if(conditions.some(c=>c.includes("cholesterol"))&&n(parsed.saturatedFat)&&parsed.saturatedFat>=4){score-=8;cautions.push("Saturated fat deserves extra attention with high cholesterol selected.")}
  score=Math.max(0,Math.min(100,score));
  const label=score>=80?"Strong fit":score>=65?"Generally suitable":score>=45?"Check the details":"Use caution";
  return {score,label,positives,cautions,allergies};
}
function labelScannerSetText(v){state.labelScanText=v;state.labelScanResult=null;state.labelScanError="";}
function labelScannerUseSample(){
  state.labelScanText=`Nutrition Facts\nServing size 40 g\nCalories 180\nTotal Fat 6 g\nSaturated Fat 1 g\nSodium 120 mg\nTotal Carbohydrate 25 g\nDietary Fiber 5 g\nTotal Sugars 4 g\nAdded Sugars 2 g\nProtein 9 g\nIron 2 mg\nCalcium 80 mg\nIngredients: rolled oats, chickpeas, sunflower oil, spices.`;
  state.labelScanImage="";state.labelScanError="";labelScannerAnalyzeText();
}
function labelScannerClear(){
  state.labelScanImage="";state.labelScanText="";state.labelScanProgress=0;state.labelScanBusy=false;state.labelScanError="";state.labelScanResult=null;render();
}
function labelScannerFileChanged(input){
  const file=input&&input.files&&input.files[0];
  if(!file)return;
  if(!/^image\//i.test(file.type||"")){state.labelScanError="Please choose an image file.";render();return;}
  if(file.size>12*1024*1024){state.labelScanError="Please use an image smaller than 12 MB.";render();return;}
  const reader=new FileReader();
  reader.onload=function(){state.labelScanImage=reader.result;state.labelScanResult=null;state.labelScanError="";render();};
  reader.onerror=function(){state.labelScanError="The image could not be opened.";render();};
  reader.readAsDataURL(file);
}
async function labelScannerRunOCR(){
  if(!state.labelScanImage){state.labelScanError="Choose or take a photo of a nutrition label first.";render();return;}
  if(!window.Tesseract){state.labelScanError="OCR library did not load. You can still paste the label text into the text box below.";render();return;}
  state.labelScanBusy=true;state.labelScanProgress=0;state.labelScanError="";render();
  try{
    const result=await Tesseract.recognize(state.labelScanImage,"eng",{logger:function(m){if(m.status==="recognizing text"&&typeof m.progress==="number"){state.labelScanProgress=Math.round(m.progress*100);const el=document.getElementById("labelOcrProgress");if(el)el.textContent=state.labelScanProgress+"%";const bar=document.getElementById("labelOcrBar");if(bar)bar.style.width=state.labelScanProgress+"%";}}});
    state.labelScanText=(result&&result.data&&result.data.text)||"";
    state.labelScanBusy=false;state.labelScanProgress=100;
    labelScannerAnalyzeText(false);
  }catch(err){
    console.error(err);state.labelScanBusy=false;state.labelScanError="OCR could not read this image. Try a clearer, straight-on photo or paste the label text manually.";render();
  }
}
function labelScannerAnalyzeText(doRender=true){
  const txt=String(state.labelScanText||"").trim();
  if(!txt){state.labelScanError="No label text is available yet.";if(doRender)render();return;}
  const parsed=parseNutrientLabel(txt);
  const count=[parsed.calories,parsed.protein,parsed.carbs,parsed.fat,parsed.sodium,parsed.fiber,parsed.sugars].filter(v=>typeof v==="number").length;
  if(count<2){state.labelScanError="Only a small amount of nutrition data was detected. Check the OCR text and correct it if needed.";}else state.labelScanError="";
  state.labelScanResult={parsed,analysis:labelScannerAnalyze(parsed,state.profile)};
  if(doRender)render();
}
function labelScannerMetric(label,value,unit){
  const display=(typeof value==="number"&&Number.isFinite(value))?`${value}${unit||""}`:"—";
  return `<div class="label-metric"><small>${label}</small><b>${display}</b></div>`;
}
function renderLabelScannerTab(p){
  const r=state.labelScanResult;
  const parsed=r&&r.parsed, analysis=r&&r.analysis;
  return `<section class="label-scan-shell">
    <div class="label-scan-head"><div class="heading-with-icon"><span class="label-scan-icon"><svg class="ui-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/><path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3"/></svg></span><div><h2>Nutrient Label Scanner</h2><p>Scan a packaged-food nutrition label and compare it with your NutriAI profile.</p></div></div><span class="local-badge">Photo stays in this browser</span></div>
    <div class="label-scan-grid">
      <div class="label-upload-card">
        <h3>1 · Add a nutrition-label photo</h3>
        <label class="label-drop" for="labelScanFile">${state.labelScanImage?`<img src="${state.labelScanImage}" alt="Nutrition label preview">`:`<div class="label-drop-empty"><span class="scan-camera">▣</span><b>Choose photo or use camera</b><small>Use a sharp, straight-on image with good lighting</small></div>`}</label>
        <input id="labelScanFile" class="hidden" type="file" accept="image/*" capture="environment" onchange="labelScannerFileChanged(this)">
        <div class="label-scan-actions"><label class="primary label-file-btn" for="labelScanFile">📷 Choose / Take Photo</label><button class="secondary" onclick="labelScannerRunOCR()" ${state.labelScanBusy?"disabled":""}>${state.labelScanBusy?"Reading label…":"✨ Scan Label"}</button><button class="ghost-btn" onclick="labelScannerClear()">Clear</button></div>
        ${state.labelScanBusy?`<div class="ocr-progress"><div class="ocr-progress-top"><span>Reading text locally in your browser…</span><b id="labelOcrProgress">${state.labelScanProgress}%</b></div><div class="ocr-track"><span id="labelOcrBar" style="width:${state.labelScanProgress}%"></span></div></div>`:""}
        ${state.labelScanError?`<div class="label-error">⚠ ${labelScannerEscape(state.labelScanError)}</div>`:""}
        <div class="label-privacy">OCR uses Tesseract.js in the browser. The photo is not intentionally uploaded to NutriAI. Internet access is needed the first time the OCR library loads.</div>
      </div>
      <div class="label-text-card">
        <h3>2 · Review the detected text</h3>
        <textarea id="labelScanText" oninput="labelScannerSetText(this.value)" placeholder="OCR text will appear here. You can also paste nutrition-label text manually.">${labelScannerEscape(state.labelScanText)}</textarea>
        <div class="label-text-actions"><button class="primary" onclick="labelScannerAnalyzeText()">Analyze Nutrition</button><button class="secondary" onclick="labelScannerUseSample()">Use Sample Label</button></div>
        <p class="label-helper">Correct OCR mistakes before analyzing—especially decimal points, serving size, sodium, sugars and units.</p>
      </div>
    </div>
    ${r?`<div class="label-result-grid">
      <section class="section-box label-facts"><h3>Detected Nutrition Facts</h3><div class="label-serving"><span>Serving size</span><b>${labelScannerEscape(parsed.serving)}</b></div><div class="label-metrics">${labelScannerMetric("Calories",parsed.calories,"")}${labelScannerMetric("Protein",parsed.protein,"g")}${labelScannerMetric("Carbs",parsed.carbs,"g")}${labelScannerMetric("Total fat",parsed.fat,"g")}${labelScannerMetric("Saturated fat",parsed.saturatedFat,"g")}${labelScannerMetric("Fiber",parsed.fiber,"g")}${labelScannerMetric("Total sugars",parsed.sugars,"g")}${labelScannerMetric("Added sugars",parsed.addedSugar,"g")}${labelScannerMetric("Sodium",parsed.sodium,"mg")}${labelScannerMetric("Cholesterol",parsed.cholesterol,"mg")}</div></section>
      <section class="section-box label-fit"><div class="label-score-row"><div><small>NUTRIAI LABEL MATCH</small><h3>${analysis.label}</h3></div><div class="label-score-ring" style="--scan-score:${analysis.score}%"><b>${analysis.score}</b><span>/100</span></div></div><p class="label-fit-basis">Based on ${labelScannerEscape(p.goal)}, ${labelScannerEscape(p.diet)}, selected conditions, and entered allergies. This is a heuristic comparison, not a medical rating.</p>${analysis.allergies.length?`<div class="label-allergy-alert">⚠ Possible entered-allergen match: <b>${labelScannerEscape(analysis.allergies.join(", "))}</b>. Verify the official “contains/may contain” statement yourself.</div>`:""}<div class="label-insights">${analysis.positives.length?`<div><h4>✓ Positive points</h4>${analysis.positives.map(x=>`<p class="good">${labelScannerEscape(x)}</p>`).join("")}</div>`:""}${analysis.cautions.length?`<div><h4>⚠ Check carefully</h4>${analysis.cautions.map(x=>`<p class="warn">${labelScannerEscape(x)}</p>`).join("")}</div>`:""}${!analysis.positives.length&&!analysis.cautions.length?`<p>Not enough nutrients were detected to create a detailed comparison.</p>`:""}</div></section>
    </div>`:""}
    <div class="warning space">⚠ OCR can misread nutrition labels. Always verify the package label, serving size, ingredients and allergen statement before making a food decision. NutriAI does not diagnose disease or replace a dietitian/clinician.</div>
  </section>`;
}
