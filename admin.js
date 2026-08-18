console.log("TAXI TIME ADMIN V4 işləyir");
let data={};

document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".nav-btn").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  button.classList.add("active");
  const page=document.getElementById(button.dataset.page); if(page) page.classList.add("active-page");
 }));
 loadDataFile();
});

function loadDataFile(){fetch("data.json?ts="+Date.now()).then(r=>r.json()).then(j=>{data=j;loadData();}).catch(e=>console.error(e));}
function loadData(){
 if(!data.company) data.company={}; if(!data.prices) data.prices={regions:{}}; if(!data.prices.regions) data.prices.regions={};
 document.getElementById("companyName").value=data.company.name||"";
 document.getElementById("city").value=data.company.city||"";
 document.getElementById("phone").value=data.company.phone||"";
 document.getElementById("whatsapp").value=data.company.whatsapp||"";
 document.getElementById("qubaBaki").value=data.prices.quba_baki||"";
 document.getElementById("bakiQuba").value=data.prices.baki_quba||"";
 loadRegions();loadServices();loadCars();loadGallery();loadReviews();
}

function loadRegions(selected){
 const s=document.getElementById("regionSelect"); if(!s)return; s.innerHTML="";
 Object.keys(data.prices.regions).sort((a,b)=>a.localeCompare(b,"az")).forEach(r=>{const o=document.createElement("option");o.value=r;o.textContent=r;s.appendChild(o);});
 if(selected&&data.prices.regions[selected]!==undefined)s.value=selected;
 selectRegion();
}
function selectRegion(){const r=document.getElementById("regionSelect").value;document.getElementById("regionPriceInput").value=r?data.prices.regions[r]||"":"";}
function saveSelectedRegion(){const r=document.getElementById("regionSelect").value;if(!r)return alert("Rayon seçin");data.prices.regions[r]=document.getElementById("regionPriceInput").value.trim();saveData();}
function addRegion(){const n=prompt("Rayon adı:");if(!n)return;const name=n.trim();if(!name)return;if(data.prices.regions[name]!==undefined)return alert("Bu rayon artıq mövcuddur");data.prices.regions[name]="0 AZN";loadRegions(name);}
function deleteSelectedRegion(){const r=document.getElementById("regionSelect").value;if(!r)return;if(!confirm(r+" silinsin?"))return;delete data.prices.regions[r];loadRegions();}

function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function loadServices(){const b=document.getElementById("servicesList");if(!b)return;data.services=data.services||[];b.innerHTML=data.services.map((x,i)=>`<div class="item"><input value="${esc(x.title||x.name)}" onchange="data.services[${i}].title=this.value"><input value="${esc(x.description)}" placeholder="Açıqlama" onchange="data.services[${i}].description=this.value"><input value="${esc(x.image)}" placeholder="Şəkil" onchange="data.services[${i}].image=this.value"><button class="delete" onclick="deleteService(${i})">🗑️ Sil</button></div>`).join("");}
function addService(){data.services=data.services||[];data.services.push({title:"Yeni xidmət",description:"",image:""});loadServices();}
function deleteService(i){if(confirm("Bu xidmət silinsin?")){data.services.splice(i,1);loadServices();}}

function loadCars(){const b=document.getElementById("carsList");if(!b)return;data.cars=data.cars||[];b.innerHTML=data.cars.map((x,i)=>`<div class="item"><input value="${esc(x.name)}" placeholder="Avtomobil" onchange="data.cars[${i}].name=this.value"><input value="${esc(x.image)}" placeholder="Şəkil" onchange="data.cars[${i}].image=this.value"><input value="${esc(x.text||x.info)}" placeholder="Məlumat" onchange="data.cars[${i}].text=this.value"><button class="delete" onclick="deleteCar(${i})">🗑️ Sil</button></div>`).join("");}
function addCar(){data.cars=data.cars||[];data.cars.push({name:"Yeni avtomobil",image:"",text:""});loadCars();}
function deleteCar(i){if(confirm("Bu avtomobil silinsin?")){data.cars.splice(i,1);loadCars();}}

function loadGallery(){const b=document.getElementById("galleryList");if(!b)return;data.gallery=data.gallery||[];b.innerHTML=data.gallery.map((x,i)=>`<div class="item"><input value="${esc(x.title)}" placeholder="Başlıq" onchange="data.gallery[${i}].title=this.value"><input value="${esc(x.url||x.image)}" placeholder="Şəkil URL/fayl" onchange="data.gallery[${i}].url=this.value"><button class="delete" onclick="deleteGallery(${i})">🗑️ Sil</button></div>`).join("");}
function addGallery(){data.gallery=data.gallery||[];data.gallery.push({title:"Yeni şəkil",url:""});loadGallery();}
function deleteGallery(i){if(confirm("Bu şəkil silinsin?")){data.gallery.splice(i,1);loadGallery();}}

function loadReviews(){const b=document.getElementById("reviewsList");if(!b)return;data.reviews=data.reviews||[];b.innerHTML=data.reviews.map((x,i)=>`<div class="item"><input value="${esc(x.name)}" placeholder="Ad" onchange="data.reviews[${i}].name=this.value"><input value="${esc(x.text||x.review)}" placeholder="Rəy" onchange="data.reviews[${i}].text=this.value"><button class="delete" onclick="deleteReview(${i})">🗑️ Sil</button></div>`).join("");}
function addReview(){data.reviews=data.reviews||[];data.reviews.push({name:"",text:""});loadReviews();}
function deleteReview(i){if(confirm("Bu rəy silinsin?")){data.reviews.splice(i,1);loadReviews();}}

function collectMain(){data.company.name=document.getElementById("companyName").value;data.company.city=document.getElementById("city").value;data.company.phone=document.getElementById("phone").value;data.company.whatsapp=document.getElementById("whatsapp").value;data.prices.quba_baki=document.getElementById("qubaBaki").value;data.prices.baki_quba=document.getElementById("bakiQuba").value;}
function saveData(){collectMain();fetch("https://taxitime-api.taxitime0711.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data,null,4)}).then(async r=>{const t=await r.text();if(!r.ok)throw new Error(t||r.status);alert("✅ Məlumatlar yadda saxlanıldı!");}).catch(e=>{console.error(e);alert("❌ Yadda saxlama xətası: "+e.message);});}
