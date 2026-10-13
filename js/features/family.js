function toggleLanguage(){
  state.lang=state.lang==="en"?"hi":"en";
  const b=document.getElementById("langBtn");
  if(b)b.textContent=state.lang==="hi"?"◎ English":"◎ हिन्दी";
  const hero=document.querySelector(".hero");
  if(hero){
    const h1=hero.querySelector("h1"), p=hero.querySelector("p"), startBtn=hero.querySelector(".primary");
    if(state.lang==="hi"){
      if(h1)h1.innerHTML='आपका व्यक्तिगत<br><span>AI पोषण विशेषज्ञ</span>';
      if(p)p.textContent="आपकी प्रोफ़ाइल और लक्ष्यों के आधार पर व्यक्तिगत भोजन योजना, वेलनेस स्कोर और पोषण मार्गदर्शन।";
      if(startBtn)startBtn.textContent="✨ मेरी योजना शुरू करें";
      toast("हिन्दी मोड चालू");
    }else{
      if(h1)h1.innerHTML='Your Personal<br><span>AI Nutritionist</span>';
      if(p)p.textContent="Get personalized diet plans, wellness scores, deficiency checks, and health guidance — all powered by intelligent nutrition science tailored to your body and goals.";
      if(startBtn)startBtn.textContent="✨ Start My Plan";
      toast("English mode enabled");
    }
  }else{
    toast(state.lang==="hi"?"हिन्दी मोड चालू":"English mode enabled");
  }
}
function familyMealPlan(m){
  const teen=Number(m.age)<18;
  const cond=m.condition&&m.condition!=="None"?m.condition:"general wellness";
  return {
    breakfast: teen?"Poha/upma + curd or fortified alternative + fruit":"Oats/poha + protein source + fruit",
    lunch:"Dal + vegetables + roti/rice + salad",
    dinner:"Vegetable + protein source + roti/rice in a comfortable portion",
    note:`Age ${m.age}: keep meals balanced and age-appropriate. Guidance shown for ${cond}; this is educational, not medical treatment.`
  };
}
function addFamilyMember(){
  const name=(document.getElementById("famName")?.value||"").trim();
  const age=Number(document.getElementById("famAge")?.value);
  const gender=document.getElementById("famGender")?.value||"";
  const condition=document.getElementById("famCondition")?.value||"None";
  if(!name){toast("Enter the family member's name.");return;}
  if(!age||age<1||age>110){toast("Enter a valid age.");return;}
  state.familyMembers.push({id:Date.now(),name,age,gender,condition});
  safeStorage.setItem("nutriFamily",JSON.stringify(state.familyMembers));
  toast(`${name} added to Family Diet Mode`);
  render();
}
function removeFamilyMember(id){
  state.familyMembers=state.familyMembers.filter(x=>x.id!==id);
  safeStorage.setItem("nutriFamily",JSON.stringify(state.familyMembers));
  toast("Family member removed");
  render();
}
function loadFamily(){
  try{state.familyMembers=JSON.parse(safeStorage.getItem("nutriFamily")||"[]")||[]}catch(e){state.familyMembers=[]}
}
function validateDeficiencySubmit(){
  const answered=state.defAnswers.filter(x=>x!==null).length;
  if(answered<10){toast(`Answer ${10-answered} more question${10-answered===1?"":"s"} first.`);return;}
  const el=document.getElementById("defResults");
  if(el){
    el.innerHTML=deficiencyResultHtml();
    el.scrollIntoView({behavior:"smooth",block:"start"});
  }
}
