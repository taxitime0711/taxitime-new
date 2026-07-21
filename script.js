// ===============================
// TAXI TIME SCRIPT
// ===============================


// AVTOPARK
function loadCars(){

    const box = document.getElementById("carsBox");

    if(!box) return;


    const cars = [

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

// TARIFLER

function loadPrices(){

    const box=document.getElementById("priceList");

    if(!box) return;


    fetch("data.json")
    .then(response => response.json())
    .then(data => {


        box.innerHTML = `


        <div class="price-card">

            <h3>Quba → Bakı</h3>

            <h2>${data.prices.quba_baki}</h2>

            <p>Rahat və təhlükəsiz səfər</p>

        </div>



        <div class="price-card">

            <h3>Bakı → Quba</h3>

            <h2>${data.prices.baki_quba}</h2>

            <p>24/7 sifariş xidməti</p>

        </div>


        `;


    })
    .catch(error => {

        console.log("Qiymət yüklənmədi:", error);

    });


}






// XIDMETLER

function loadPrices(){

    const box=document.getElementById("priceList");

    if(!box) return;


    fetch("data.json")
    .then(response => response.json())
    .then(data => {


        let regionOptions = "";

        for(let region in data.prices.regions){

            regionOptions += `
                <option value="${region}">
                    ${region}
                </option>
            `;

        }


        box.innerHTML = `


        <div class="price-card">

            <h3>Quba → Bakı</h3>

            <h2>${data.prices.quba_baki}</h2>

            <p>Rahat və təhlükəsiz səfər</p>

        </div>



        <div class="price-card">

            <h3>Bakı → Quba</h3>

            <h2>${data.prices.baki_quba}</h2>

            <p>24/7 sifariş xidməti</p>

        </div>



        <div class="price-card">

            <h3>🇦🇿 Bölgələr</h3>

            <select id="regionSelect">

                ${regionOptions}

            </select>


            <h2 id="regionPrice">
                ${data.prices.regions[Object.keys(data.prices.regions)[0]]}
            </h2>

            <p>Bölgələrə rahat səfər</p>

        </div>


        `;


        const select = document.getElementById("regionSelect");
        const price = document.getElementById("regionPrice");


        select.addEventListener("change", function(){

            price.innerHTML = data.prices.regions[this.value];

        });


    })
    .catch(error => {

        console.log("Qiymət yüklənmədi:", error);

    });


}


// WHATSAPP SIFARIŞ

function sendOrder(){

    let name=document.getElementById("name").value;
    let phone=document.getElementById("phone").value;
    let from=document.getElementById("from").value;
    let to=document.getElementById("to").value;


    if(!name || !phone || !from || !to){

        alert("Zəhmət olmasa bütün vacib məlumatları doldurun.");

        return;
    }
    let date=document.getElementById("date").value;
    let time=document.getElementById("time").value;
    let person=document.getElementById("person").value;
    let car=document.getElementById("car").value;


    let message = 
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
        "https://wa.me/994507119711?text="+encodeURIComponent(message),
        "_blank"
    );

}




// STATISTIKA

document.querySelectorAll(".counter").forEach(counter=>{

    let target = Number(counter.dataset.target);

    let count = 0;


    let timer=setInterval(()=>{

        count++;

        counter.innerHTML=count+"+";


        if(count>=target){

            clearInterval(timer);

        }


    },20);


});




// START

console.log("TAXI TIME SCRIPT ISLEYIR");


loadCars();

loadPrices();

loadServices();
