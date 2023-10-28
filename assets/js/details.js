// const imgNumberli = document.querySelectorAll('div.slider-content-left-bottom li');
// console.log("imgNumberli");

// imgNumberLi.forEach(function (image, index) {
//     image.addEventListener("click", function () {
//         document.querySelector(".slider-content-left-top").style.right = index * 100 + "%"
//     })
// })

// const imgNumberli = document.querySelectorAll('.slider-content-left-top a');
// console.log(imgNumberli);

// var links =
//  document.querySelectorAll('.slider-content-left-bottom li');
// console.log(links);

// links.forEach(function(link) {
//     image.addEventListener("click", function () {
//         document.querySelector(".slider-content-left-top").style.right = index * 100 + "%"
// });
const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");
const quantityInput = document.getElementById("quantity");

minusButton.addEventListener("click", () => {
  let currentQuantity = parseInt(quantityInput.value);
  if (currentQuantity > 1) {
    currentQuantity--;
    quantityInput.value = currentQuantity;
  }
});

plusButton.addEventListener("click", () => {
  let currentQuantity = parseInt(quantityInput.value);
  currentQuantity++;
  quantityInput.value = currentQuantity;
});


function changeImage(obj)
{
    
    var path = obj.src
    var img = document.getElementById("mainImg")
    // img.src = path
    img.setAttribute("src",path)

    function init(){
        var images  = document.querySelectorAll("div.item2 img")
        for(var  i = 0; i <images.length; i++)
        images[i].onclick = function() {
            var path = this.src
            var img = document.getElementById("mainImg")
            // img.src = path
            img.setAttribute("src",path)
        }
        
    }
}
