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
  // Backward compatibility with old admin values
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
function loadPrices(){
  const box=document.getElementById('priceList'); if(!box)return;
  fetch('data.json?ts='+Date.now()).then(r=>r.json()).then(data=>{
    const regions=Object.keys(data.prices?.regions||{}).filter(x=>x!=='Bakı'&&x!=='Quba').sort((a,b)=>a.localeCompare(b,'az'));
    const places=['Quba','Bakı',...regions];
    const opts=places.map(x=>`<option value="${safeText(x)}">${safeText(x)}</option>`).join('');
    box.innerHTML=`<div class="price-card" style="max-width:620px;margin:auto;grid-column:1/-1"><h3>🚕 Marşrut üzrə qiymət</h3><select id="ttFrom">${opts}</select><select id="ttTo">${opts}</select><select id="ttClass"><option value="standard">Standart</option><option value="comfort">Comfort</option><option value="vip">VIP</option></select><select id="ttTrip"><option value="one_way">Tək gediş</option><option value="round_trip">Gediş-dönüş</option></select><h2 id="ttPrice">Marşrut seçin</h2><p id="ttTime">Haradan və Hara seçdikdə istiqamət avtomatik müəyyən edilir</p></div>`;
    ttFrom.value='Quba'; ttTo.value='Bakı';
    function show(){
      const from=ttFrom.value,to=ttTo.value;
      if(from===to){ttPrice.textContent='Fərqli məntəqə seçin';ttTime.textContent='';return;}
      const tariff=ttRouteTariff(data,from,to);
      if(!tariff){ttPrice.textContent='Bu marşrut üçün tarif yoxdur';ttTime.textContent='';return;}
      const s=activeSlot(tariff),val=ttSlotValue(s,ttClass.value,ttTrip.value);
      ttPrice.textContent=val||'Qiymət daxil edilməyib';
      ttTime.textContent=slotLabel(s)?`Aktiv tarif: ${slotLabel(s)}`:'';
    }
    [ttFrom,ttTo,ttClass,ttTrip].forEach(x=>x.onchange=show); show();
  }).catch(console.log);
}
