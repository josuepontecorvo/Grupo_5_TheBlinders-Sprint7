window.onload = () => {

    let card = document.querySelector('section.detail-container');
    
    let cartStorage = {}
    if (localStorage.getItem('cart')) {
        cartStorage = JSON.parse(localStorage.getItem('cart'))
    }

    console.log( cartStorage );
    
    card.addEventListener("click", function (e) {
        if (e.target.classList.contains('detail-add-cart')) {
            e.stopPropagation();
            e.preventDefault();
            let product = {};
            product.image = this.querySelector('.main-image img').src.split('/').slice(-2).join('/');
            product.description = this.querySelector('.detail-column-2 h3').innerText;
            let priceField = this.querySelector('.detail-price').innerText;
            let priceRegex = /[0-9]/g;
            product.price = priceField.match(priceRegex).join("");
            product.id = this.querySelector('#inputId').value;
            product.quantity = 1 
    
            if (cartStorage?.hasOwnProperty(product.id)) {
                product.quantity = cartStorage[product.id].quantity + 1;
            } 
    
            cartStorage[product.id] = {...product}  
    
            localStorage.setItem('cart', JSON.stringify(cartStorage))
    
        }
    })
    
    
    
    }