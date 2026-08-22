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
  if(from==='Quba'&&to==='Bakı') return prices.quba_baki;
  if(from==='Bakı'&&to==='Quba') return prices.baki_quba;
  const regions=prices.regions||{};
  if(from==='Quba'&&regions[to]) return regions[to];
  if(to==='Quba'&&regions[from]) return regions[from];
  return null;
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

    fromEl.value='Quba';
    toEl.value='Bakı';

    async function show(){
      const from=fromEl.value;
      const to=toEl.value;
      if(from===to){priceEl.textContent='Fərqli məntəqə seçin';timeEl.textContent='';return;}
      priceEl.textContent='Qiymət yenilənir...';
      try{
        const fresh=await ttFetchData();
        const tariff=ttRouteTariff(fresh,from,to);
        if(!tariff){priceEl.textContent='Bu marşrut üçün tarif yoxdur';timeEl.textContent='';return;}
        const s=activeSlot(tariff);
        const val=ttSlotValue(s,classEl.value,tripEl.value);
        priceEl.textContent=val||'Qiymət daxil edilməyib';
        timeEl.textContent=slotLabel(s)?`Aktiv tarif: ${slotLabel(s)}`:'';
      }catch(e){
        priceEl.textContent='Qiymət yenilənmədi';
        timeEl.textContent='İnterneti yoxlayın';
      }
    }

    fromEl.addEventListener('change',show);
    toEl.addEventListener('change',show);
    classEl.addEventListener('change',show);
    tripEl.addEventListener('change',show);
    show();
  }).catch(console.log);
}
