// TAXI TIME: Quba weather + compact news corner
(function(){
  const weatherCodes={0:['☀️','Açıq hava'],1:['🌤️','Əsasən açıq'],2:['⛅','Qismən buludlu'],3:['☁️','Buludlu'],45:['🌫️','Dumanlı'],48:['🌫️','Dumanlı'],51:['🌦️','Çiskin'],53:['🌦️','Çiskin'],55:['🌧️','Güclü çiskin'],61:['🌧️','Yağış'],63:['🌧️','Yağış'],65:['🌧️','Güclü yağış'],71:['🌨️','Qar'],73:['🌨️','Qar'],75:['❄️','Güclü qar'],80:['🌦️','Yağış ehtimalı'],81:['🌧️','Yağışlı'],82:['⛈️','Güclü yağış'],95:['⛈️','Şimşəkli'],96:['⛈️','Şimşəkli'],99:['⛈️','Şimşəkli']};
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function renderShell(){
    const host=document.getElementById('infoCorner'); if(!host)return;
    host.innerHTML=`<div class="weather-panel"><div class="iw-title"><span>🌤️ Quba hava</span><small>Canlı məlumat</small></div><div id="weatherNow" class="weather-loading">Yüklənir...</div><div id="weatherDays" class="weather-days"></div></div><div class="news-panel"><div class="iw-title"><span>📰 Xəbərlər guşəsi</span><small>Qısa məlumat</small></div><div class="news-list"><div class="news-item"><b>TAXI TIME • 24/7</b><span>Quba–Bakı istiqamətində sifarişlər qəbul olunur.</span></div><div class="news-item"><b>✈️ Hava limanı transferi</b><span>Öncədən sifarişlə rahat qarşılama və transfer xidməti.</span></div><div class="news-item"><b>🚘 Səfər üçün hazır</b><span>Avtomobilinizi seçin və onlayn sifariş bölməsindən müraciət edin.</span></div></div><a class="news-order" href="#order">Sifariş ver →</a></div>`;
  }
  async function loadWeather(){
    try{
      const u='https://api.open-meteo.com/v1/forecast?latitude=41.3611&longitude=48.5134&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBaku&forecast_days=3';
      const r=await fetch(u); if(!r.ok)throw new Error(); const d=await r.json();
      const c=d.current||{}, pair=weatherCodes[c.weather_code]||['🌤️','Hava məlumatı'];
      document.getElementById('weatherNow').innerHTML=`<div class="weather-icon">${pair[0]}</div><div><strong>${Math.round(c.temperature_2m)}°C</strong><span>${esc(pair[1])}</span></div><div class="weather-meta"><span>Hiss olunur <b>${Math.round(c.apparent_temperature)}°</b></span><span>Külək <b>${Math.round(c.wind_speed_10m)} km/s</b></span></div>`;
      const days=['Bu gün','Sabah','Birigün'];
      document.getElementById('weatherDays').innerHTML=(d.daily.time||[]).map((x,i)=>{const p=weatherCodes[d.daily.weather_code[i]]||['🌤️',''];return `<div><span>${days[i]||''}</span><b>${p[0]} ${Math.round(d.daily.temperature_2m_max[i])}°</b><small>${Math.round(d.daily.temperature_2m_min[i])}°</small></div>`}).join('');
    }catch(e){document.getElementById('weatherNow').innerHTML='<div class="weather-error">Hava məlumatı hazırda əlçatan deyil.</div>';}
  }
  window.addEventListener('DOMContentLoaded',()=>{renderShell();loadWeather();});
})();
