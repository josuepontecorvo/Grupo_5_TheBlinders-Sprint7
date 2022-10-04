window.onload = () => {

let cards = document.querySelectorAll('a.detail');

let cartStorage = {}
if (localStorage.getItem('cart')) {
    cartStorage = JSON.parse(localStorage.getItem('cart'))
}

cards.forEach( card => {

card.addEventListener("click", function (e) {
    if (e.target.classList.contains('add-products-to-cart')) {
        e.stopPropagation();
        e.preventDefault();
        let product = {};
        product.image = this.querySelector('img').src.split('/').slice(-2).join('/');
        product.description = this.querySelector('h3').innerText;
        let priceField = this.querySelector('.destacados-products-price').innerText;
        let priceRegex = /[0-9]/g;
        product.price = priceField.match(priceRegex).join("");
        let url = this.href.split('/');
        product.id = url[url.length - 1];
        product.quantity = 1 

        

        if (cartStorage?.hasOwnProperty(product.id)) {
            product.quantity = cartStorage[product.id].quantity + 1;
        } 

        cartStorage[product.id] = {...product}  

        localStorage.setItem('cart', JSON.stringify(cartStorage))

    }
})

});

}