let idArray = [];
var currentItem = 0;

function init() {
   
    $.ajax({
        url: "products",
        method: "GET",
        dataType: "json",
        success: function (data) {                
            setupPage(data);                         
        },
        error: function (error) {
            console.log('Error fetching data:', error);
        }
    })       

}

function setupPage(data) {
    data.forEach(element => {                   
        idArray.push(element["_id"]);                    
    });

    displayCurrentProduct();
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
            document.getElementById("imageData").src = data.image;
        },
        error: function (error) {
            console.log('Error fetching data:', error);
        }
    })
}

function incCurrentItem() {
    console.log(currentItem);
    
    if(currentItem == idArray.length-2) { //Loop back to start of array
        currentItem = 0;
    } else {    
        currentItem++;
    }
    displayCurrentProduct();
}

function decCurrentItem() {

    console.log(currentItem);
    if(currentItem == 0) {
        currentItem = idArray.length - 1;
    } else {
        currentItem--;
    }
    
    displayCurrentProduct();
}

init();