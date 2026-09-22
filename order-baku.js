(()=>{
  "use strict";
  const API="https://taxitime-api.taxitime0711.workers.dev";
  const FALLBACK_DISTRICTS=["Binəqədi","Xətai","Xəzər","Qaradağ","Nərimanov","Nəsimi","Nizami","Pirallahı","Sabunçu","Səbail","Suraxanı","Yasamal"];
  let publicData={prices:{baku_locations:{},regions:{}}};
  const $=id=>document.getElementById(id);
  const clean=v=>String(v??"").trim();
  const escText=v=>clean(v);

  function getBakuMap(){
    const p=publicData&&publicData.prices&&publicData.prices.baku_locations;
    return p&&typeof p==="object"&&!Array.isArray(p)?p:{};
  }
  function getRegions(){
    const p=publicData&&publicData.prices&&publicData.prices.regions;
    return p&&typeof p==="object"&&!Array.isArray(p)?p:{};
  }
  function addOptions(select,items,keep){
    if(!select)return;
    const wanted=keep||select.value;
    select.innerHTML="";
    items.forEach(item=>{
      const o=document.createElement("option");
      o.value=item.value; o.textContent=item.label; select.appendChild(o);
    });
    if(wanted&&items.some(x=>x.value===wanted))select.value=wanted;
  }
  function districtNames(){
    const keys=Object.keys(getBakuMap());
    return (keys.length?keys:FALLBACK_DISTRICTS).sort((a,b)=>a.localeCompare(b,"az"));
  }
  function fillDistrict(side,preferred){
    const sel=$(side+"BakuDistrict");
    if(!sel)return;
    const ds=districtNames();
    addOptions(sel,ds.map(x=>({value:x,label:x})),preferred);
    fillLocation(side);
  }
  function fillLocation(side){
    const d=$(side+"BakuDistrict")?.value||"";
    const sel=$(side+"BakuLocation");
    if(!sel)return;
    const obj=getBakuMap()[d]||{};
    const arr=Array.isArray(obj.locations)?obj.locations:[];
    const items=arr.filter(x=>clean(x&&x.name)).map((x,i)=>({value:String(i),label:clean(x.name)+(clean(x.type)?" — "+clean(x.type):"")}));
    if(!items.length)items.push({value:"",label:"Ünvan siyahısı yoxdur — dəqiq ünvanı aşağıda yazın"});
    addOptions(sel,items);
    syncSide(side);
  }
  function fillRegions(side){
    const sel=$(side+"RegionName"); if(!sel)return;
    let rs=Object.keys(getRegions()).filter(x=>clean(x)&&clean(x).toLocaleLowerCase("az")!=="bakı");
    rs.sort((a,b)=>a.localeCompare(b,"az"));
    if(!rs.length)rs=["Abşeron","Qusar","Xaçmaz","Şabran","Siyəzən","Xızı","Sumqayıt"];
    addOptions(sel,rs.map(x=>({value:x,label:x})));
  }
  function bakuValue(side){
    const district=clean($(side+"BakuDistrict")?.value);
    const locSel=$(side+"BakuLocation");
    const obj=getBakuMap()[district]||{};
    const arr=Array.isArray(obj.locations)?obj.locations:[];
    let location="";
    if(locSel&&locSel.value!==""){
      const idx=Number(locSel.value);
      if(Number.isInteger(idx)&&idx>=0&&idx<arr.length) location=clean(arr[idx]?.name);
      else location=clean(locSel.options[locSel.selectedIndex]?.textContent).replace(/\s+—\s+.*$/,'');
    }
    const exact=clean($(side+"BakuExact")?.value);
    return ["Bakı",district,location,exact].filter(Boolean).join(", ");
  }
  function regionValue(side){
    const region=clean($(side+"RegionName")?.value);
    const exact=clean($(side+"RegionExact")?.value);
    return [region,exact].filter(Boolean).join(", ");
  }
  function syncSide(side){
    const mode=$(side+"Place")?.value||"";
    const baku=$(side+"Baku"); const region=$(side+"Region");
    if(baku)baku.hidden=mode!=="baku";
    if(region)region.hidden=mode!=="region";
    let value="";
    if(mode==="quba")value="Quba";
    else if(mode==="baku")value=bakuValue(side)||"Bakı";
    else if(mode==="region")value=regionValue(side);
    const hidden=$(side==="orderFrom"?"from":"to");
    if(hidden)hidden.value=value;
    updateSummary();
  }
  function updateSummary(){
    const from=clean($("from")?.value), to=clean($("to")?.value);
    const box=$("orderAddressSummary");
    if(box)box.textContent=`Marşrut: ${escText(from)||"—"} → ${escText(to)||"—"}`;
  }
  function wireSide(side){
    $(side+"Place")?.addEventListener("change",()=>syncSide(side));
    $(side+"BakuDistrict")?.addEventListener("change",()=>fillLocation(side));
    $(side+"BakuLocation")?.addEventListener("change",()=>syncSide(side));
    $(side+"BakuExact")?.addEventListener("input",()=>syncSide(side));
    $(side+"RegionName")?.addEventListener("change",()=>syncSide(side));
    $(side+"RegionExact")?.addEventListener("input",()=>syncSide(side));
  }
  async function loadPublicData(){
    try{
      const r=await fetch(API+"?ts="+Date.now(),{cache:"no-store"});
      if(!r.ok)throw new Error("HTTP "+r.status);
      publicData=await r.json();
    }catch(e){
      console.warn("TAXI TIME order address data fallback:",e);
    }
    fillDistrict("orderFrom");
    fillDistrict("orderTo","Nərimanov");
    fillRegions("orderFrom");
    fillRegions("orderTo");
    syncSide("orderFrom");
    syncSide("orderTo");
  }
  document.addEventListener("DOMContentLoaded",()=>{
    wireSide("orderFrom"); wireSide("orderTo");
    loadPublicData();
  });
})();
