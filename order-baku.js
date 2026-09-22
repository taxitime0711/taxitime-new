(()=>{
  "use strict";
  const API="https://taxitime-api.taxitime0711.workers.dev";
  const FALLBACK_DISTRICTS=["Binəqədi","Xətai","Xəzər","Qaradağ","Nərimanov","Nəsimi","Nizami","Pirallahı","Sabunçu","Səbail","Suraxanı","Yasamal"];
  let publicData={prices:{baku_locations:{},regions:{}}};
  const $=id=>document.getElementById(id);
  const clean=v=>String(v??"").trim();

  function getBakuMap(){
    const p=publicData?.prices?.baku_locations;
    return p&&typeof p==="object"&&!Array.isArray(p)?p:{};
  }
  function getRegions(){
    const p=publicData?.prices?.regions;
    return p&&typeof p==="object"&&!Array.isArray(p)?p:{};
  }
  function addOptions(select,items,keep){
    if(!select)return;
    const wanted=keep||select.value;
    select.innerHTML="";
    items.forEach(item=>{
      const o=document.createElement("option");
      o.value=item.value;o.textContent=item.label;select.appendChild(o);
    });
    if(wanted&&items.some(x=>x.value===wanted))select.value=wanted;
  }
  function districtNames(){
    const keys=Object.keys(getBakuMap());
    return (keys.length?keys:FALLBACK_DISTRICTS).sort((a,b)=>a.localeCompare(b,"az"));
  }
  function fillDistrict(preferred){
    const sel=$("orderBakuDistrict");
    if(!sel)return;
    const ds=districtNames();
    addOptions(sel,ds.map(x=>({value:x,label:x})),preferred||"Nərimanov");
    fillLocation();
  }
  function fillLocation(){
    const district=clean($("orderBakuDistrict")?.value);
    const sel=$("orderBakuLocation");
    if(!sel)return;
    const obj=getBakuMap()[district]||{};
    const arr=Array.isArray(obj.locations)?obj.locations:[];
    const items=arr.filter(x=>clean(x?.name)).map((x,i)=>({
      value:String(i),
      label:clean(x.name)+(clean(x.type)?" — "+clean(x.type):"")
    }));
    if(!items.length)items.push({value:"",label:"Ünvan siyahısı yoxdur — dəqiq ünvanı yazın"});
    addOptions(sel,items);
    syncRoute();
  }
  function fillRegions(){
    const sel=$("orderRegionName");if(!sel)return;
    let rs=Object.keys(getRegions()).filter(x=>clean(x)&&clean(x).toLocaleLowerCase("az")!=="bakı"&&clean(x).toLocaleLowerCase("az")!=="quba");
    rs.sort((a,b)=>a.localeCompare(b,"az"));
    if(!rs.length)rs=["Abşeron","Ağdaş","Qusar","Xaçmaz","Şabran","Siyəzən","Xızı","Sumqayıt"];
    addOptions(sel,rs.map(x=>({value:x,label:x})),"Abşeron");
  }
  function bakuAddress(){
    const district=clean($("orderBakuDistrict")?.value);
    const obj=getBakuMap()[district]||{};
    const arr=Array.isArray(obj.locations)?obj.locations:[];
    const locSel=$("orderBakuLocation");
    let location="";
    if(locSel&&locSel.value!==""){
      const idx=Number(locSel.value);
      if(Number.isInteger(idx)&&idx>=0&&idx<arr.length)location=clean(arr[idx]?.name);
      else location=clean(locSel.options[locSel.selectedIndex]?.textContent).replace(/\s+—\s+.*$/,'');
    }
    const exact=clean($("orderBakuExact")?.value);
    return ["Bakı",district,location,exact].filter(Boolean).join(", ");
  }
  function regionAddress(){
    const region=clean($("orderRegionName")?.value);
    const exact=clean($("orderRegionExact")?.value);
    return [region,exact].filter(Boolean).join(", ");
  }
  function activeRoute(){
    return document.querySelector('input[name="orderRouteType"]:checked')?.value||"baku";
  }
  function setActive(route){
    const radio=$(route==="region"?"routeTypeRegion":"routeTypeBaku");
    if(radio)radio.checked=true;
    $("bakuRouteCard")?.classList.toggle("active",route==="baku");
    $("regionRouteCard")?.classList.toggle("active",route==="region");
    syncRoute();
  }
  function syncRoute(){
    const route=activeRoute();
    let from="Quba",to="";
    if(route==="baku"){
      const addr=bakuAddress()||"Bakı";
      if($("bakuDirection")?.value==="b2q"){from=addr;to="Quba";}else{from="Quba";to=addr;}
    }else{
      const addr=regionAddress();
      if($("regionDirection")?.value==="r2q"){from=addr;to="Quba";}else{from="Quba";to=addr;}
    }
    if($("from"))$("from").value=from;
    if($("to"))$("to").value=to;
    const box=$("orderAddressSummary");
    if(box)box.textContent=`Marşrut: ${from||"—"} → ${to||"—"}`;
  }
  function wire(){
    $("bakuRouteCard")?.addEventListener("click",e=>{
      if(e.target.closest("select,input"))return;
      setActive("baku");
    });
    $("regionRouteCard")?.addEventListener("click",e=>{
      if(e.target.closest("select,input"))return;
      setActive("region");
    });
    $("routeTypeBaku")?.addEventListener("change",()=>setActive("baku"));
    $("routeTypeRegion")?.addEventListener("change",()=>setActive("region"));
    $("bakuDirection")?.addEventListener("change",()=>{setActive("baku");syncRoute();});
    $("orderBakuDistrict")?.addEventListener("change",()=>{setActive("baku");fillLocation();});
    $("orderBakuLocation")?.addEventListener("change",()=>{setActive("baku");syncRoute();});
    $("orderBakuExact")?.addEventListener("input",()=>{setActive("baku");syncRoute();});
    $("regionDirection")?.addEventListener("change",()=>{setActive("region");syncRoute();});
    $("orderRegionName")?.addEventListener("change",()=>{setActive("region");syncRoute();});
    $("orderRegionExact")?.addEventListener("input",()=>{setActive("region");syncRoute();});
  }
  async function loadPublicData(){
    try{
      const r=await fetch(API+"?ts="+Date.now(),{cache:"no-store"});
      if(!r.ok)throw new Error("HTTP "+r.status);
      publicData=await r.json();
    }catch(e){
      console.warn("TAXI TIME order route data fallback:",e);
    }
    fillDistrict("Nərimanov");
    fillRegions();
    setActive("baku");
  }
  document.addEventListener("DOMContentLoaded",()=>{
    wire();
    loadPublicData();
  });
})();
