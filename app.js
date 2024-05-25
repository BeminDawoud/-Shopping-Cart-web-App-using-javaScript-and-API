let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

/* these event listeneres are responsible for showing and hiding the cart */
/* it cancels and reactivates the css of the cart */
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})


/* this function creates a div for each item inside the products div */
/* it also creates a class and an id for each item */
const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <h2>${product.title}</h2> 
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}


/* checks for a click on the add cart button and adds the item to the cart */
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});


/* this function adds an item to the cart */
const addToCart = (product_id) => {
    let product = products.find(item => item.id == product_id);
    if (!product) return; // Product not found, exit function
    
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    
    // if cart is empty, add the product to cart.
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            name: product.title, 
            quantity: 1
        }];
    }     
    // if cart is not empty and product is not added yet, add the product to cart.
    else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            name: product.title, 
            quantity: 1
        });
    }
    // if product already exists, increase quantity by one.
    else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('cart', JSON.stringify(cart));
  };


// this function displays the items added in the shopping cart.
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            listCartHTML.appendChild(newItem);
            let product = products.find(p => p.id == item.product_id);
            let itemTotalPrice = product.price * item.quantity;
            totalPrice += itemTotalPrice;
            newItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}">
                </div>
                <div class="name">
                    ${item.name}
                </div>
                <div class="totalPrice">$${itemTotalPrice.toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
    const totalPriceElement = document.querySelector('.total-price');
    totalPriceElement.innerText = `Total Price: $${totalPrice.toFixed(2)}`;
};



// detects the click on the minus or plus and assigns it to a variable.
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});


// updates quantity of products inside the shopping cart.
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1); // if element quantity reaches zero, we remove the product from cart.
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};


// fetching the products from API and adding them to the product array.
const initApp = () => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        products = data;
        addDataToHTML();
      })
      .catch(error => console.error('Error fetching products:', error));
  
    // get data cart from memory
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  };
  
initApp();

