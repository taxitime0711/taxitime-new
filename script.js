// ===============================
// TAXI TIME SCRIPT
// ===============================


// AVTOPARK

function loadCars(){

    const box = document.getElementById("carsBox");

    if(!box) return;


    let cars = [

        {
            name:"Geely Galaxy A7",
            image:"gallery1.jpg",
            text:"Yeni nəsil komfortlu və təhlükəsiz sedan"
        },

        {
            name:"BYD Destroyer 05",
            image:"gallery2.jpg",
            text:"Premium hibrid avtomobil"
        },

        {
            name:"Mercedes-Benz S350",
            image:"gallery3.jpg",
            text:"VIP səviyyəli rahatlıq"
        },

        {
            name:"BYD Qin Plus",
            image:"gallery4.jpg",
            text:"Qənaətli və komfortlu seçim"
        },

        {
            name:"Toyota Corolla Cross",
            image:"gallery5.jpg",
            text:"Ailə və uzun yol üçün ideal"
        },

        {
            name:"Mercedes Sprinter",
            image:"gallery7.jpg",
            text:"Qrup səfərləri üçün geniş salon"
        },

        {
            name:"Hyundai i40",
            image:"gallery8.jpg",
            text:"Rahat və təhlükəsiz səfərlər üçün"
        }

    ];


    box.innerHTML="";


    cars.forEach(car=>{

        box.innerHTML += `

        <div class="fleet-card">

            <img src="${car.image}" alt="${car.name}">

            <h3>${car.name}</h3>

            <p>${car.text}</p>

        </div>

        `;

    });

}



// TARIFLER

function loadPrices(){

    const box=document.getElementById("priceList");

    if(!box) return;


    box.innerHTML=`

    <div class="price-card">

        <h3>Quba → Bakı</h3>

        <div class="price">
            100 AZN
        </div>

        <p>Rahat və təhlükəsiz səfər</p>

    </div>


    <div class="price-card">

        <h3>Bakı → Quba</h3>

        <div class="price">
            100 AZN
        </div>

        <p>24/7 sifariş xidməti</p>

    </div>

    `;

}



// XIDMETLER

function loadServices(){

    const box=document.getElementById("servicesBox");

    if(!box) return;


    box.innerHTML=`

    <div class="card">

        <img src="quba-baki.jpg">

        <h3>Quba - Bakı</h3>

        <p>Sərnişin daşıma xidməti</p>

    </div>


    <div class="card">

        <img src="airport.jpg">

        <h3>Hava Limanı Transferi</h3>

        <p>24/7 rahat xidmət</p>

    </div>


    <div class="card">

        <img src="car.png">

        <h3>Komfortlu Avtomobillər</h3>

        <p>Təmiz və təhlükəsiz nəqliyyat</p>

    </div>

    `;

}



// WHATSAPP SIFARIS

function sendOrder(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let from=document.getElementById("from").value;
let to=document.getElementById("to").value;
let date=document.getElementById("date").value;
let time=document.getElementById("time").value;
let person=document.getElementById("person").value;
let car=document.getElementById("car").value;


let text=

`Salam TAXI TIME

Ad: ${name}

Telefon: ${phone}

Marşrut:
${from} → ${to}

Tarix:
${date}

Saat:
${time}

Sərnişin:
${person}

Avtomobil:
${car}`;


window.open(
"https://wa.me/994507119711?text="+encodeURIComponent(text),
"_blank"
);


}



// STATISTIKA

document.querySelectorAll(".counter").forEach(counter=>{

let target=Number(counter.dataset.target);

let count=0;

let timer=setInterval(()=>{

count++;

counter.innerHTML=count;


if(count>=target){

clearInterval(timer);

counter.innerHTML=target+"+";

}

},20);


});



// START

console.log("TAXI TIME SCRIPT ISLEYIR");


loadCars();

loadPrices();

loadServices();