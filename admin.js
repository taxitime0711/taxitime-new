// ===============================
// TAXI TIME ADMIN JS
// PART 1
// ===============================


console.log("TAXI TIME ADMIN JS ISLEYIR");


let data = {};



// ===============================
// MENYU KEÇİDLƏRİ
// ===============================

document.addEventListener("DOMContentLoaded",()=>{


    document.querySelectorAll(".nav-btn").forEach(button=>{


        button.addEventListener("click",()=>{


            // aktiv düymə

            document.querySelectorAll(".nav-btn")
            .forEach(btn=>{

                btn.classList.remove("active");

            });


            button.classList.add("active");



            // səhifələr

            document.querySelectorAll(".page")
            .forEach(page=>{

                page.classList.remove("active-page");

            });



            let page =
            document.getElementById(button.dataset.page);



            if(page){

                page.classList.add("active-page");

            }


        });


    });



    loadDataFile();


});




// ===============================
// DATA YÜKLƏ
// ===============================


function loadDataFile(){


fetch("data.json")


.then(response=>response.json())


.then(json=>{


    data=json;


    loadData();


})


.catch(error=>{


    console.log(
        "Data yüklənmədi:",
        error
    );


});


}


// ===============================
// MƏLUMATLARI GÖSTƏR
// ===============================


function loadData(){


    if(!data.company) return;



    document.getElementById("companyName").value =
    data.company.name || "";



    document.getElementById("city").value =
    data.company.city || "";



    document.getElementById("phone").value =
    data.company.phone || "";



    document.getElementById("whatsapp").value =
    data.company.whatsapp || "";



    document.getElementById("qubaBaki").value =
    data.prices.quba_baki || "";



    document.getElementById("bakiQuba").value =
    data.prices.baki_quba || "";



    loadRegions();

    loadServices();

    loadCars();


}





// ===============================
// PART 2
// RAYONLAR + XİDMƏTLƏR + AVTOPARK
// ===============================



// ===============================
// RAYONLAR
// ===============================


function loadRegions(){

    const box = document.getElementById("regions");

    if(!box) return;


    box.innerHTML="";


    if(!data.prices.regions) return;


    for(let region in data.prices.regions){


        box.innerHTML += `

        <div class="item">

            <input 
            value="${region}"
            readonly>


            <input 
            value="${data.prices.regions[region]}"
            onchange="
            data.prices.regions['${region}']=this.value
            ">

        </div>

        `;


    }


}




function addRegion(){


    if(!data.prices.regions){

        data.prices.regions={};

    }


    let name =
    prompt("Rayon adı:");



    if(!name) return;



    data.prices.regions[name]="0 AZN";


    loadRegions();


}





// ===============================
// XİDMƏTLƏR
// ===============================


function loadServices(){


    const box =
    document.getElementById("servicesList");


    if(!box) return;



    box.innerHTML="";



    if(!data.services) return;



    data.services.forEach((service,index)=>{


        box.innerHTML += `


        <div class="item">


        <input 
        value="${service.title}"
        onchange="
        data.services[${index}].title=this.value
        ">


        <input 
        value="${service.description}"
        onchange="
        data.services[${index}].description=this.value
        ">


        <input 
        value="${service.image}"
        onchange="
        data.services[${index}].image=this.value
        ">


        </div>


        `;


    });


}




function addService(){


    data.services.push({


        title:"Yeni xidmət",


        description:"Məlumat",


        image:"service.jpg"


    });



    loadServices();


}






// ===============================
// AVTOPARK
// ===============================


function loadCars(){


    const box =
    document.getElementById("carsList");


    if(!box) return;



    box.innerHTML="";



    if(!data.cars) return;



    data.cars.forEach((car,index)=>{


        box.innerHTML += `


        <div class="item">


        <input
        value="${car.name}"
        onchange="
        data.cars[${index}].name=this.value
        ">



        <input
        value="${car.image}"
        onchange="
        data.cars[${index}].image=this.value
        ">



        <input
        value="${car.info || ''}"
        onchange="
        data.cars[${index}].info=this.value
        ">



        </div>


        `;


    });


}




function addCar(){


    data.cars.push({


        name:"Yeni avtomobil",


        image:"car.jpg",


        info:"Məlumat"


    });



    loadCars();


}
// ===============================
// PART 3
// YADDA SAXLA
// ===============================


function saveData(){


    data.company.name =
    document.getElementById("companyName").value;


    data.company.city =
    document.getElementById("city").value;


    data.company.phone =
    document.getElementById("phone").value;


    data.company.whatsapp =
    document.getElementById("whatsapp").value;



    data.prices.quba_baki =
    document.getElementById("qubaBaki").value;


    data.prices.baki_quba =
    document.getElementById("bakiQuba").value;



    let json = JSON.stringify(data,null,4);



    fetch("https://taxitime-api.taxitime0711.workers.dev",{


        method:"POST",


        headers:{


            "Content-Type":"application/json"


        },


        body:json


    })


    .then(response=>response.text())


    .then(result=>{


        console.log(result);


        alert("✅ TAXI TIME məlumatları yadda saxlanıldı!");


    })


    .catch(error=>{


        console.error(error);


        alert("❌ Xəta baş verdi!");


    });


}