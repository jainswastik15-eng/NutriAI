function loadProgress(){
  try{ state.progressLogs=JSON.parse(safeStorage.getItem("nutriProgress")||"[]") || []; }catch(e){ state.progressLogs=[]; }
}
function toggleProgressForm(){state.progressOpen=!state.progressOpen;render()}
function setProgressMetric(v){state.progressMetric=v;render()}
function addProgress(){
  const weight=Number(document.getElementById("progWeight")?.value);
  const water=Number(document.getElementById("progWater")?.value);
  const sleep=Number(document.getElementById("progSleep")?.value);
  const activity=Number(document.getElementById("progActivity")?.value);
  const mood=Number(document.getElementById("progMood")?.value);
  if(!weight || weight<20 || weight>300){alert("Enter a realistic weight.");return;}
  if(!water || water<0.5 || water>10){alert("Enter water intake between 0.5 and 10 L.");return;}
  if(!sleep || sleep<1 || sleep>16){alert("Enter sleep hours between 1 and 16.");return;}
  if(activity<0 || activity>600){alert("Enter activity minutes between 0 and 600.");return;}
  if(!mood || mood<1 || mood>5){alert("Choose a mood score from 1 to 5.");return;}

  const targetWater=Number(state.profile?.m?.wat || 2);
  const targetSleep=+state.profile?.age<18?9:8;
  const targetActivity=30;
  const wellness=Math.max(40,Math.min(100,Math.round(
    55 +
    Math.min(15,(water/targetWater)*15) +
    Math.min(15,(sleep/targetSleep)*15) +
    Math.min(10,(activity/targetActivity)*10) +
    (mood-3)*2
  )));
  const d=new Date();
  const label=d.toLocaleDateString(undefined,{month:"short",day:"numeric"});
  state.progressLogs.push({date:label,ts:Date.now(),weight,water,sleep,activity,mood,wellness});
  if(state.progressLogs.length>14) state.progressLogs=state.progressLogs.slice(-14);
  safeStorage.setItem("nutriProgress",JSON.stringify(state.progressLogs));
  state.progressOpen=false;
  render();
}
function clearProgress(){
  if(confirm("Clear all saved progress entries?")){
    state.progressLogs=[];
    safeStorage.removeItem("nutriProgress");
    render();
  }
}
function progressMetricInfo(){
  return {
    wellness:{label:"Wellness score",suffix:"",min:40,max:100},
    weight:{label:"Weight",suffix:" kg",min:null,max:null},
    water:{label:"Water",suffix:" L",min:0,max:null},
    sleep:{label:"Sleep",suffix:" h",min:0,max:12},
    activity:{label:"Activity",suffix:" min",min:0,max:null}
  }[state.progressMetric];
}
function progressChartSvg(){
  const logs=state.progressLogs;
  if(!logs.length) return "";
  const key=state.progressMetric, info=progressMetricInfo();
  const vals=logs.map(x=>Number(x[key]));
  let min=info.min!==null?info.min:Math.min(...vals);
  let max=info.max!==null?info.max:Math.max(...vals);
  if(max===min){max+=1;min-=1}
  if(info.min===null){const pad=(max-min)*0.18 || 1;min-=pad;max+=pad}
  else if(info.max===null){max=Math.max(...vals)*1.15 || 1}
  const W=760,H=300, left=52,right=20,top=25,bottom=42;
  const iw=W-left-right, ih=H-top-bottom;
  const x=i=>left+(logs.length===1?iw/2:(i/(logs.length-1))*iw);
  const y=v=>top+ih-((v-min)/(max-min))*ih;
  const pts=logs.map((r,i)=>[x(i),y(Number(r[key]))]);
  const line=pts.map(p=>p.join(",")).join(" ");
  const area=`${left},${top+ih} `+line+` ${pts[pts.length-1][0]},${top+ih}`;
  const ticks=[0,.25,.5,.75,1].map(t=>({v:min+(max-min)*t,y:top+ih-ih*t}));
  return `<svg class="progress-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${info.label} progress chart">
    ${ticks.map(t=>`<line class="gridline" x1="${left}" x2="${W-right}" y1="${t.y}" y2="${t.y}"></line><text class="axis-label" x="${left-8}" y="${t.y+4}" text-anchor="end">${(Math.round(t.v*10)/10)}${info.suffix}</text>`).join("")}
    <polygon class="trend-area" points="${area}"></polygon>
    <polyline class="trend-line" points="${line}"></polyline>
    ${pts.map((p,i)=>`<circle class="trend-dot" cx="${p[0]}" cy="${p[1]}" r="5"><title>${logs[i].date}: ${logs[i][key]}${info.suffix}</title></circle>`).join("")}
    ${logs.map((r,i)=>`<text class="axis-label" x="${x(i)}" y="${H-14}" text-anchor="middle">${r.date}</text>`).join("")}
  </svg>`;
}
function progressSummary(){
  const l=state.progressLogs;
  if(!l.length) return null;
  const latest=l[l.length-1], first=l[0];
  return {
    latest,
    weightChange:(latest.weight-first.weight).toFixed(1),
    avgWater:(l.reduce((a,x)=>a+x.water,0)/l.length).toFixed(1),
    avgSleep:(l.reduce((a,x)=>a+x.sleep,0)/l.length).toFixed(1),
    avgActivity:Math.round(l.reduce((a,x)=>a+x.activity,0)/l.length)
  };
}
