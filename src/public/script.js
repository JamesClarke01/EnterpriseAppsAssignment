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
        },
        error: function (error) {
            console.log('Error fetching data:', error);
        }
    })
}

init();