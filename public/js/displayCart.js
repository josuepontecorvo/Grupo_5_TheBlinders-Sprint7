window.onload = function() {
    
    let tableBody = document.querySelector('.cart-table tbody');
    let cartProducts = localStorage.getItem('cart');
    let total = document.querySelector('.total-price p')

    let totalBuy = 0;

    if (cartProducts) {
        for (product of Object.values(JSON.parse(cartProducts))) {
            let row = `
                <tr>
                    <td class="cart-table-image"><img src="/${product.image}" alt="Imagen de producto"></td>
                    <td class="cart-table-description"><p>${product.description}</p></td>
                    <td class="cart-table-price">$ ${product.price}</td>
                    <td class="cart-table-quantity"><input type="number" class="product-quantity" name="${product.id}" value="${product.quantity}"></td>
                    <td class="cart-table-total">$ ${product.price * product.quantity}</td>
                    <td class="cart-table-delete"><a class="delete" title="${product.id}" href="javascript:void(0)"><i class="fa-solid fa-trash"></i></a></td>
                </tr>
            `;

            tableBody.innerHTML += row;
            totalBuy += product.price * product.quantity;
        }

        total.innerText = `Precio total : $ ${totalBuy}`

        let inputsProductQuantity = document.querySelectorAll('.product-quantity');
        inputsProductQuantity.forEach( input => {
            input.addEventListener('change', function (e) {
                let product = {}
                let productId = this.getAttribute('name');
                let products = JSON.parse(cartProducts);
                product = { ...products[+productId] };
                product.quantity = this.value;

                if (this.value < 0) {

                    this.value = 0

                } else {

                    products[product.id] = {...product}
                    
                    localStorage.setItem('cart', JSON.stringify(products))
                    let totalElement = e.target.parentElement.nextElementSibling;
                    totalElement.innerText =`$ ${product.price * product.quantity}`;
    
                    let sum = 0;
                    for (product of Object.values(products)) {
                        sum += product.price * product.quantity;
                    };
                    total.innerText = `Precio total : $ ${sum}`

                }
        
            })
        }) 

        let garbageBins = document.querySelectorAll('.delete');
        for (bin of garbageBins) {
            bin.addEventListener('click', function (e) {
                let productId = this.getAttribute("title")
                let products = JSON.parse(localStorage.getItem('cart'));
                delete products[productId];
                localStorage.setItem('cart', JSON.stringify(products));
                location.reload();
            })
        }
    }


};

