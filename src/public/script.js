let idArray = [];
var currentItem = 0;

function setupPage(data) {
    idArray = [];
    currentItem = 0;
    
    $.ajax({
        url: "products",
        method: "GET",
        dataType: "json",
        success: function (data) {                
            data.forEach(element => {                   
                idArray.push(element["_id"]);                    
            });
        
            displayCurrentProduct();                      
        },
        error: function (error) {
            console.log('Error fetching data:', error);
        }
    })          
}

function displayCurrentProduct() {        
    
    $.ajax({
        url: "products/" + idArray[currentItem],
        method: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            document.getElementById("nameData").textContent = data.name;
            document.getElementById("priceData").textContent = data.price;
            document.getElementById("manufacturerData").textContent = data.manufacturer;
            document.getElementById("descriptionData").textContent = data.description;
            document.getElementById("imageData").src = data.image;
        },
        error: function (error) {
            console.log('Error fetching data:', error);
        }
    })
}

function deleteCurrentItem() {
    fetch("/products/" + idArray[currentItem], {method: "DELETE"});
    setupPage();
}   

function incCurrentItem() {
    
    
    if(currentItem == idArray.length-1) { //Loop back to start of array
        currentItem = 0;
    } else {    
        currentItem++;
    }

    console.log(currentItem);

    displayCurrentProduct();
}

function decCurrentItem() {

    
    if(currentItem == 0) {
        currentItem = idArray.length - 1;
    } else {
        currentItem--;
    }

    console.log(currentItem);
    
    displayCurrentProduct();
}

setupPage();