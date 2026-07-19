alert("YENI SCRIPT ISLEYIR");
function orderTaxi(){

    let message = 
    "Salam TAXI TIME. Mən taksi sifariş etmək istəyirəm.";

    let phone = "994507119711";

    let url = 
    "https://wa.me/" + phone + 
    "?text=" + encodeURIComponent(message);


    window.open(url, "_blank");

}
function sendOrder(){
    function sendOrder(){

    console.log("name:", document.getElementById("name"));
    console.log("phone:", document.getElementById("phone"));
    console.log("from:", document.getElementById("from"));
    console.log("to:", document.getElementById("to"));
    console.log("date:", document.getElementById("date"));
    console.log("time:", document.getElementById("time"));
    console.log("person:", document.getElementById("person"));
    console.log("car:", document.getElementById("car"));

    return;

}

let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;
let from = document.getElementById("from").value;
let to = document.getElementById("to").value;
let date = document.getElementById("date").value;
let time = document.getElementById("time").value;
let passengers = document.getElementById("person").value;
let car = document.getElementById("car").value;


// Tarixi Azərbaycan formatına çevirir
let dateText = new Date(date).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric"
});


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
passengers + " nəfər\n\n" +

"◆ Avtomobil:\n" +
car + "\n\n" +

"◆ Sifariş gözləyir...";


let whatsapp =
"https://wa.me/994505886677?text=" +
encodeURIComponent(message);


window.open(whatsapp, "_blank");

}


// TARIFLERI GOSTER

let priceList = document.getElementById("priceList");


if(priceList){

taxiData.routes.forEach(function(route){


priceList.innerHTML += `

<div class="price-card">

<h3>🚕 ${route.from} → ${route.to}</h3>

<p class="price">
${route.price}
</p>

<p>
Rahat və təhlükəsiz səfər
</p>

</div>

`;

});


}
// ADMIN TARIF OXU

let savedPrice = localStorage.getItem("taxiPrice");


let prices = document.querySelectorAll(".price");


if(savedPrice){

prices.forEach(function(item){

item.innerHTML = savedPrice + " AZN";

});

}
// Foto Qalereya Lightbox

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");

galleryImages.forEach(img => {

    img.addEventListener("click", function(){

        lightbox.style.display = "flex";
        lightboxImg.src = this.src;

    });

});

closeBtn.onclick = function(){

    lightbox.style.display = "none";

}

lightbox.onclick = function(e){

    if(e.target === lightbox){

        lightbox.style.display = "none";

    }

}
const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

    const update = ()=>{

        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;

        const speed = target/100;

        if(count < target){

            counter.innerText = Math.ceil(count + speed);

            setTimeout(update,20);

        }else{

            counter.innerText = target + "+";

        }

    };

    update();

});
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});
