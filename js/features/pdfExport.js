function exportDietPlanPDF(){
  if(!state.profile){
    alert("Create your NutriAI profile first.");
    return;
  }
  if(state.tab!=="Diet Plan"){
    state.tab="Diet Plan";
    render();
  }

  const previousTitle=document.title;
  const safeName=String(state.profile.name||"NutriAI")
    .replace(/[^a-z0-9_-]+/gi,"_")
    .replace(/^_+|_+$/g,"");
  document.title=(safeName||"NutriAI")+"_Diet_Plan";

  document.body.classList.add("pdf-export-mode");

  const cleanup=function(){
    document.body.classList.remove("pdf-export-mode");
    document.title=previousTitle;
    window.removeEventListener("afterprint",cleanup);
  };

  window.addEventListener("afterprint",cleanup);
  setTimeout(function(){
    window.print();
    // Some browsers do not fire afterprint reliably.
    setTimeout(function(){
      if(document.body.classList.contains("pdf-export-mode"))cleanup();
    },1500);
  },100);
}
