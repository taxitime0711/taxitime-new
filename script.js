// ===============================
// TAXI TIME SCRIPT
// PART 1
// ===============================


// -------------------------------
// AVTOPARK
// -------------------------------

function loadCars(){

    const box = document.getElementById("carsBox");

    if(!box) return;

    fetch("data.json")
    .then(res => res.json())
    .then(data => {

        box.innerHTML = "";

        data.cars.forEach(car => {

            box.innerHTML += `

            <div class="fleet-card">

                <img src="${car.image}" alt="${car.name}">

                <h3>${car.name}</h3>

                <p>${car.text}</p>

            </div>

            `;

        });

    })
    .catch(err => console.log(err));

}



// -------------------------------
// XİDMƏTLƏR
// -------------------------------

function loadServices(){

    const box = document.getElementById("servicesBox");

    if(!box) return;

    fetch("data.json")
    .then(res => res.json())
    .then(data => {

        box.innerHTML = "";

        data.services.forEach(service => {

            box.innerHTML += `

            <div class="card">

                <img src="${service.image}" alt="${service.title}">

                <h3>${service.title}</h3>

                <p>${service.description}</p>

            </div>

            `;

        });

    })
    .catch(err => console.log(err));

}



// -------------------------------
// TARİFLƏR
// -------------------------------

function loadPrices(){

    const box = document.getElementById("priceList");

    if(!box) return;

    fetch("data.json")
    .then(res => res.json())
    .then(data => {

        let regionOptions = "";

        for(const region in data.prices.regions){

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

    <div class="region-top">

        <span class="region-title">
            Quba
        </span>

        <select id="regionSelect">

            <option value="">
                Rayon seçin
            </option>

            ${regionOptions}

        </select>

    </div>

    <h2 id="regionPrice">
        Qiymət seçin
    </h2>

    <p>
        Bölgələrə rahat səfər
    </p>

</div>

`;

        const select = document.getElementById("regionSelect");
        const price = document.getElementById("regionPrice");

        if(select){

            select.addEventListener("change", function(){

                if(this.value === ""){

                    price.innerHTML = "Qiymət seçin";

                }else{

                    price.innerHTML = data.prices.regions[this.value];

                }

            });

        }

    })
    .catch(err => console.log(err));

}
// ===============================
// TAXI TIME SCRIPT
// PART 2
// ===============================


// -------------------------------
// WHATSAPP SİFARİŞ
// -------------------------------

function sendOrder(){

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const person = document.getElementById("person").value;
    const car = document.getElementById("car").value;

    if(!name || !phone || !from || !to){

        alert("Zəhmət olmasa bütün vacib məlumatları doldurun.");
        return;

    }

    const message = `Salam TAXI TIME

Ad: ${name}

Telefon: ${phone}

Marşrut:
${from} → ${to}

Tarix: ${date}

Saat: ${time}

Sərnişin sayı: ${person}

Avtomobil: ${car}`;

    window.open(
        "https://wa.me/994507119711?text=" + encodeURIComponent(message),
        "_blank"
    );

}



// -------------------------------
// STATİSTİKA
// -------------------------------

function startCounters(){

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        let count = 0;

        const speed = Math.max(1, Math.ceil(target / 100));

        const timer = setInterval(() => {

            count += speed;

            if(count >= target){

                count = target;
                clearInterval(timer);

            }

            counter.textContent = count + "+";

        },20);

    });

}



// -------------------------------
// LIGHTBOX
// -------------------------------

function initLightbox(){

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");

    if(!lightbox || !lightboxImg) return;

    document.querySelectorAll(".gallery-item img").forEach(img=>{

        img.addEventListener("click",()=>{

            lightbox.style.display="flex";
            lightboxImg.src = img.src;

        });

    });

    if(closeBtn){

        closeBtn.addEventListener("click",()=>{

            lightbox.style.display="none";

        });

    }

    lightbox.addEventListener("click",(e)=>{

        if(e.target===lightbox){

            lightbox.style.display="none";

        }

    });

}



// -------------------------------
// START
// -------------------------------

document.addEventListener("DOMContentLoaded",()=>{

    loadServices();
    loadCars();
    loadPrices();

    startCounters();

    initLightbox();

});

console.log("TAXI TIME SCRIPT işləyir.");