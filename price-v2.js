// TAXI TIME unified route + class tariff UI
function ttPriceKey(slot, cls, trip){
  const c=cls||'standard';
  if(c==='standard') return trip==='round_trip'?'standard_round_trip':'standard';
  if(c==='comfort') return trip==='round_trip'?'comfort_round_trip':'comfort';
  return trip==='round_trip'?'vip_round_trip':'vip';
}
function ttSlotValue(slot, cls, trip){
  const key=ttPriceKey(slot,cls,trip);
  if(slot && slot[key]) return slot[key];
  if(cls==='standard') return trip==='round_trip'?(slot.round_trip||''):(slot.one_way||'');
  return '';
}
function ttRouteTariff(data,from,to){
  const prices=data.prices||{};
  // Quba ↔ Bakı uses one shared tariff table from admin panel.
  if((from==='Quba'&&to==='Bakı')||(from==='Bakı'&&to==='Quba')) return prices.quba_baki;
  const regions=prices.regions||{};
  if(from==='Quba'&&regions[to]) return regions[to];
  if(to==='Quba'&&regions[from]) return regions[from];
  return null;
}
function ttNorm(v){return String(v||'').toLocaleLowerCase('az').replace(/ı/g,'i').replace(/ə/g,'e').replace(/ş/g,'s').replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ö/g,'o').replace(/ü/g,'u');}
function ttDetectPlace(text,places){
  const n=ttNorm(text);
  let best='';
  for(const p of places){const pn=ttNorm(p);if(n.includes(pn)&&pn.length>ttNorm(best).length)best=p;}
  return best;
}
async function ttFetchData(){
  const r=await fetch('data.json?ts='+Date.now(),{cache:'no-store'});
  if(!r.ok) throw new Error('Tarif məlumatı alınmadı');
  return r.json();
}
function loadPrices(){
  const box=document.getElementById('priceList'); if(!box)return;
  ttFetchData().then(data=>{
    const regions=Object.keys(data.prices?.regions||{}).filter(x=>x!=='Bakı'&&x!=='Quba').sort((a,b)=>a.localeCompare(b,'az'));
    const places=['Quba','Bakı',...regions];
    const opts=places.map(x=>`<option value="${safeText(x)}">${safeText(x)}</option>`).join('');
    box.innerHTML=`<div class="price-card" style="max-width:620px;margin:auto;grid-column:1/-1"><h3>🚕 Marşrut üzrə qiymət</h3><select id="ttFrom">${opts}</select><select id="ttTo">${opts}</select><select id="ttClass"><option value="standard">Standart</option><option value="comfort">Comfort</option><option value="vip">VIP</option></select><select id="ttTrip"><option value="one_way">Tək gediş</option><option value="round_trip">Gediş-dönüş</option></select><h2 id="ttPrice">Marşrut seçin</h2><p id="ttTime">Haradan və Hara seçdikdə istiqamət avtomatik müəyyən edilir</p></div>`;

    const fromEl=document.getElementById('ttFrom');
    const toEl=document.getElementById('ttTo');
    const classEl=document.getElementById('ttClass');
    const tripEl=document.getElementById('ttTrip');
    const priceEl=document.getElementById('ttPrice');
    const timeEl=document.getElementById('ttTime');
    const orderFrom=document.getElementById('from');
    const orderTo=document.getElementById('to');

    let orderPrice=document.getElementById('orderAutoPrice');
    if(orderTo && !orderPrice){
      orderPrice=document.createElement('div');
      orderPrice.id='orderAutoPrice';
      orderPrice.style.cssText='grid-column:1/-1;padding:12px 14px;border:1px solid #f5b400;border-radius:9px;background:#fff8e9;font-weight:800;color:#111;display:none';
      orderTo.insertAdjacentElement('afterend',orderPrice);
    }

    fromEl.value='Quba';
    toEl.value='Bakı';

    async function show(fromOverride,toOverride,forOrder=false){
      const from=fromOverride||fromEl.value;
      const to=toOverride||toEl.value;
      const targetPrice=forOrder&&orderPrice?orderPrice:priceEl;
      const targetTime=forOrder&&orderPrice?null:timeEl;
      if(!from||!to){if(forOrder&&orderPrice)orderPrice.style.display='none';return;}
      if(from===to){targetPrice.textContent='Fərqli məntəqə seçin';if(targetTime)targetTime.textContent='';if(forOrder&&orderPrice)orderPrice.style.display='block';return;}
      if(forOrder&&orderPrice){orderPrice.style.display='block';orderPrice.textContent='Qiymət yoxlanılır...';}
      else priceEl.textContent='Qiymət yenilənir...';
      try{
        const fresh=await ttFetchData();
        const tariff=ttRouteTariff(fresh,from,to);
        if(!tariff){targetPrice.textContent='Bu marşrut üçün tarif yoxdur';if(targetTime)targetTime.textContent='';return;}
        const s=activeSlot(tariff);
        const val=ttSlotValue(s,classEl.value,tripEl.value);
        targetPrice.textContent=val?`Qiymət: ${val}`:'Qiymət daxil edilməyib';
        if(targetTime)targetTime.textContent=slotLabel(s)?`Aktiv tarif: ${slotLabel(s)}`:'';
      }catch(e){
        targetPrice.textContent='Qiymət yenilənmədi';
        if(targetTime)targetTime.textContent='İnterneti yoxlayın';
      }
    }

    function syncOrderPrice(){
      if(!orderFrom||!orderTo)return;
      const f=ttDetectPlace(orderFrom.value,places);
      const t=ttDetectPlace(orderTo.value,places);
      if(!f||!t){if(orderPrice)orderPrice.style.display='none';return;}
      fromEl.value=f;toEl.value=t;
      show(f,t,true);
      show(f,t,false);
    }

    fromEl.addEventListener('change',()=>show());
    toEl.addEventListener('change',()=>show());
    classEl.addEventListener('change',()=>{show();syncOrderPrice();});
    tripEl.addEventListener('change',()=>{show();syncOrderPrice();});
    if(orderFrom){orderFrom.addEventListener('input',syncOrderPrice);orderFrom.addEventListener('change',syncOrderPrice);}
    if(orderTo){orderTo.addEventListener('input',syncOrderPrice);orderTo.addEventListener('change',syncOrderPrice);}
    show();
  }).catch(console.log);
}
