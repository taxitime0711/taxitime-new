// TAXI TIME DATA SİSTEMİ

console.log("DATA SISTEMI ISLEYIR");

let taxiData = {};


// DATA YÜKLƏ

fetch("data.json")

.then(response => response.json())

.then(data => {

    taxiData = data;

    loadServices();
    loadPrices();
    loadCars();

})

.catch(error => {

    console.log("DATA XƏTASI:", error);

});




// HERO SİFARİŞ

function orderTaxi(){

    let message =
    "Salam TAXI TIME. Mən taksi sifariş etmək istəyirəm.";

    let phone = "994507119711";

    let url =
    "https://wa.me/" + phone +
    "?text=" + encodeURIComponent(message);


    window.open(url, "_blank");

}




// ONLINE SİFARİŞ

function sendOrder(){


let name =
document.getElementById("name").value;


let phone =
document.getElementById("phone").value;


let from =
document.getElementById("from").value;


let to =
document.getElementById("to").value;


let date =
document.getElementById("date").value;


let time =
document.getElementById("time").value;


let person =
document.getElementById("person").value;


let car =
document.getElementById("car").value;



if(!name || !phone || !from || !to){

alert("Zəhmət olmasa məlumatları doldurun.");

return;

}



let dateText = new Date(date).toLocaleDateString(
"az-AZ",
{
day:"numeric",
month:"long",
year:"numeric"
}
);



let message =

"◆ TAXI TIME SİFARİŞ\n\n" +

"◆ Müştəri:\n" +
name + "\n\n" +

"◆ Əlaqə:\n" +
phone + "\n\n" +

"◆ Götürülmə yeri:\n" +
from + "\n\n" +

"◆ Gediləcək yer:\n" +
to + "\n\n" +

"◆ Tarix:\n" +
dateText + "\n\n" +

"◆ Saat:\n" +
time + "\n\n" +

"◆ Sərnişin sayı:\n" +
person + "\n\n" +

"◆ Avtomobil:\n" +
car;



let whatsapp =

"https://wa.me/994507119711?text="

+ encodeURIComponent(message);



window.open(whatsapp,"_blank");


}




// XİDMƏTLƏR

function loadServices(){


let box =
document.getElementById("servicesBox");


if(!box) return;


box.innerHTML="";


taxiData.services.forEach(service=>{


box.innerHTML += `

<div class="card">

<img src="${service.image}">

<h3>${service.title}</h3>

<p>${service.description}</p>

</div>

`;


});


}




// TARİFLƏR

function loadPrices(){


let box =
document.getElementById("priceList");


if(!box) return;


box.innerHTML = `


<div class="price-card">

<h3>🚕 Quba → Bakı</h3>

<div class="price">

${taxiData.prices.quba_baki}

</div>

<p>
Gündəlik rahat reyslər
</p>

</div>



<div class="price-card">

<h3>🚘 Bakı → Quba</h3>

<div class="price">

${taxiData.prices.baki_quba}

</div>

<p>
Vaxtında götürmə və çatdırılma
</p>

</div>


`;

}




// AVTOMOBİLLƏR

function loadCars(){


let box =
document.getElementById("carsBox");


if(!box) return;


box.innerHTML="";


taxiData.cars.forEach(car=>{


box.innerHTML += `


<div class="fleet-card">


<img src="${car.image}" alt="${car.name}">


<h3>${car.name}</h3>


<p>${car.info}</p>


</div>


`;


});


}





// GALEREYA LIGHTBOX


const galleryImages =
document.querySelectorAll(".gallery-item img");


const lightbox =
document.getElementById("lightbox");


const lightboxImg =
document.getElementById("lightbox-img");


const closeBtn =
document.querySelector(".close");



galleryImages.forEach(img=>{


img.onclick=function(){


lightbox.style.display="flex";

lightboxImg.src=this.src;


}


});



if(closeBtn){

closeBtn.onclick=function(){

lightbox.style.display="none";

}

}



if(lightbox){

lightbox.onclick=function(e){

if(e.target===lightbox){

lightbox.style.display="none";

}

}

}





// SAYĞACLAR

// SAYĞACLAR

window.addEventListener("load",()=>{

const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

let target = +counter.getAttribute("data-target");

let count = 0;

let timer=setInterval(()=>{

count += Math.ceil(target/50);

if(count>=target){

count=target;

clearInterval(timer);

}

counter.innerHTML=count+"+";


},30);


});


});
