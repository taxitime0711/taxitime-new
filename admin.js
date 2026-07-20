console.log("ADMIN JS ISLEYIR");
let data = {};


// DATA YÜKLƏ

fetch("data.json")
.then(response => response.json())
.then(json => {

    data = json;

    loadData();

});



// MƏLUMATLARI PANELƏ GƏTİR

function loadData(){


document.getElementById("companyName").value =
data.company.name;


document.getElementById("city").value =
data.company.city;


document.getElementById("phone").value =
data.company.phone;


document.getElementById("whatsapp").value =
data.company.whatsapp;



document.getElementById("qubaBaki").value =
data.prices.quba_baki;


document.getElementById("bakiQuba").value =
data.prices.baki_quba;



loadServices();

loadCars();


}



// XİDMƏTLƏR

function loadServices(){

let box=document.getElementById("services");

box.innerHTML="";


data.services.forEach((item,index)=>{


box.innerHTML += `

<div class="item">

<input value="${item.title}" 
onchange="data.services[${index}].title=this.value">


<input value="${item.description}"
onchange="data.services[${index}].description=this.value">

<input value="${item.image}"
onchange="data.services[${index}].image=this.value">

</div>

`;


});


}




function addService(){

    data.services.push({

        title: "Yeni xidmət",
        description: "Məlumat",
        image: "service.jpg"

    });

    loadServices();

}




// AVTOMOBİLLƏR


function loadCars(){

let box=document.getElementById("cars");

box.innerHTML="";


data.cars.forEach((car,index)=>{


box.innerHTML += `

<div class="item">


<input value="${car.name}"
onchange="data.cars[${index}].name=this.value">


<input value="${car.image}"
onchange="data.cars[${index}].image=this.value">


<input value="${car.info}"
onchange="data.cars[${index}].info=this.value">


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



// YADDA SAXLA


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


let json = JSON.stringify(data, null, 4);

fetch("https://taxitime-api.taxitime0711.workers.dev", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: json

})
.then(response => response.text())

.then(result => {

    console.log(result);

    alert("Məlumat GitHub-a yadda saxlanıldı!");

})

.catch(error => {

    console.error(error);

    alert("Xəta baş verdi!");

});

}