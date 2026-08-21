// TAXI TIME - avtomobil şəkli seçmə/yükləmə əlavəsi
(function(){
  function fileToBase64(file){
    return new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(String(r.result).split(',')[1]||'');
      r.onerror=reject;
      r.readAsDataURL(file);
    });
  }

  function safeFileName(name){
    const ext=(name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    const base=(name.replace(/\.[^.]+$/,'')||'car').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,45)||'car';
    return `uploads/cars/${Date.now()}-${base}.${ext}`;
  }

  window.loadCars=function(){
    data.cars=data.cars||[];
    carsList.innerHTML=data.cars.map((x,i)=>`
      <div class="item car-admin-row" style="display:grid;grid-template-columns:1.2fr 1.35fr auto 1.2fr auto;gap:8px;align-items:center">
        <input value="${esc(x.name)}" placeholder="Avtomobil adı" onchange="data.cars[${i}].name=this.value">
        <input value="${esc(x.image)}" placeholder="Şəkil yolu" onchange="data.cars[${i}].image=this.value">
        <label style="display:inline-flex;align-items:center;justify-content:center;padding:11px 13px;border-radius:8px;background:#2d6cdf;color:white;cursor:pointer;white-space:nowrap;font-weight:700">
          📷 Şəkil seç
          <input type="file" accept="image/jpeg,image/png,image/webp" style="display:none" onchange="uploadCarImage(${i},this)">
        </label>
        <input value="${esc(x.text||x.info)}" placeholder="Açıqlama" onchange="data.cars[${i}].text=this.value">
        <button class="delete" onclick="deleteCar(${i})">🗑️ Sil</button>
        <div id="carUploadStatus${i}" style="grid-column:1/-1;color:#aaa;font-size:13px"></div>
      </div>`).join('');
  };

  window.uploadCarImage=async function(i,input){
    const file=input.files&&input.files[0];
    if(!file)return;
    const status=document.getElementById(`carUploadStatus${i}`);
    if(file.size>5*1024*1024){
      alert('Şəkil maksimum 5 MB ola bilər.');
      input.value='';
      return;
    }
    if(status)status.textContent='⏳ Şəkil yüklənir...';
    try{
      const filename=safeFileName(file.name);
      const content=await fileToBase64(file);
      const r=await fetch(API+'?action=upload-image',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':adminAuth},
        body:JSON.stringify({filename,content,mime:file.type||'image/jpeg'})
      });
      const t=await r.text();
      if(r.status===401||r.status===403)throw new Error('LOGIN_REQUIRED');
      if(!r.ok)throw new Error(t||('HTTP '+r.status));
      let out={};
      try{out=JSON.parse(t);}catch{}
      data.cars[i].image=out.path||filename;
      if(status)status.textContent='✅ Şəkil yükləndi: '+data.cars[i].image;
      loadCars();
      alert('✅ Şəkil yükləndi. İndi “Yadda saxla” düyməsini bas.');
    }catch(e){
      if(e.message==='LOGIN_REQUIRED'){
        alert('Sessiya bitib. Yenidən daxil olun.');
        adminLogout();
      }else{
        if(status)status.textContent='❌ Şəkil yüklənmədi: '+e.message;
        alert('❌ Şəkil yüklənmədi: '+e.message);
      }
    }finally{
      input.value='';
    }
  };
})();
