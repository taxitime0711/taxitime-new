// TAXI TIME uploaded image display fix
window.loadServices=function(){
  const box=document.getElementById("servicesBox");
  if(!box)return;
  fetch("data.json?ts="+Date.now())
    .then(r=>r.json())
    .then(data=>{
      box.innerHTML="";
      (data.services||[])
        .filter(s=>(s.title||s.name||"").trim()&&(s.description||"").trim())
        .forEach(s=>{
          const title=(s.title||s.name||"").trim();
          let image=(s.image||"").trim();
          // Only use old built-in images when admin has not selected an image.
          if(!image&&/^Təhlükəsiz Səfər$/i.test(title))image="quba-baki.jpg";
          if(!image&&(/^Hava Limani$/i.test(title)||/^Hava Limanı$/i.test(title)))image="airport.jpg";
          box.innerHTML+=`<div class="card">${image?`<img src="${safeText(image)}" alt="${safeText(title)}" onerror="this.onerror=null;this.src='quba-baki.jpg'">`:""}<h3>${safeText(title)}</h3><p>${safeText(s.description||"")}</p></div>`;
        });
    })
    .catch(console.log);
};
