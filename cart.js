let cart = [];
let host = 'https://products-dasw.onrender.com';
let exp = 746284;
renderPage();

async function renderPage() {
    await getCartFromServer();
    renderCart();
}

function getUser() {
    let user = sessionStorage.getItem('user');
    return user;
}

async function getCartFromServer() {
    let resp = await fetch(`${host}/api/cart`, {
        method :'GET',
        headers: {
            'x-expediente': exp,
            'x-user': getUser()
        }
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else
        cart = data.cart.map(item => ({product: item.product, amount: item.amount}));
}

function renderCart() {
    let buffer = [];
    cart.forEach(item => {
        let html = cartItemToHTML(item.product, item.amount);
        buffer.push(html);
    });
    let cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = buffer.join('');
    let cartBill = document.getElementById('cart-bill');
    cartBill.innerHTML = cartBillToHTML();
}

function cartItemToHTML(product, amount) {
    return /*html*/`
        <div id="${product.uuid}" class="media border p-3 object-container">
            <img
              src="${product.imageUrl}"
              alt="${product.name}"
              class="mr-3 mt-3 rounded-circle object-image"
            />
            <div class="media-body col-8">
                <h4>
                    ${product.name}
                    <button class="btn btn-danger"
                            onclick="deleteFromCart('${product.uuid}')">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </h4>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">
                            Quantity:
                        </span>
                    </div>
                    <input id="cart-input-${product.uuid}"
                        type="text"
                        value="${amount}"
                        disabled
                        class="form-control"
                        placeholder="${product.unit}"
                        aria-label="amount"
                        aria-describedby="basic-addon1"/>
                    <button id="cart-confirm-${product.uuid}"
                            class="btn btn-success no-display"
                            onclick="confirmChange('${product.uuid}')">
                        <i class="bi bi-check2"></i>
                    </button>
                    <button id="cart-cancel-${product.uuid}"
                            class="btn btn-danger no-display"
                            onclick="cancelChange('${product.uuid}')">
                        <i class="bi bi-x"></i>
                    </button>
                    <button id="cart-edit-${product.uuid}"
                            class="btn btn-primary"
                            onclick="enableDisableEditing('${product.uuid}')">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Price:</span>
                    </div>
                    <input type="text"
                            value="${product.pricePerUnit}"
                            disabled
                            class="form-control"
                            aria-label="price"/>
                    <div class="input-group-append">
                        <span class="input-group-text">MXN / ${product.unit}</span>
                    </div>
                </div>
            </div>
        </div>`;
}

async function deleteFromCart(uuid) {
    let resp = await fetch(`${host}/api/cart/${uuid}`, {
        method :'DELETE',
        headers: {
            'x-expediente': exp,
            'x-user': getUser()
        }
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else {
        cart = cart.filter(item => item.product.uuid !== uuid);
        renderCart();
    }
}

function enableDisableEditing(uuid) {
    document.getElementById('cart-edit-'+uuid).classList.toggle('no-display');
    document.getElementById('cart-confirm-'+uuid).classList.toggle('no-display');
    document.getElementById('cart-cancel-'+uuid).classList.toggle('no-display');
    let input = document.getElementById('cart-input-'+uuid);
    input.disabled = !input.disabled;
}

function cancelChange(uuid) {
    let item = cart.find(item => item.product.uuid === uuid);
    document.getElementById('cart-input-'+uuid).value = item.amount;
    enableDisableEditing(uuid);
}

function confirmChange(uuid) {
    let item = cart.find(item => item.product.uuid === uuid);
    let input = document.getElementById('cart-input-'+uuid);
    let pattern = item.product.unit === 'piece' ? /^[0-9]+$/gm : /^[0-9]+(\.[0-9]+)?$/gm;
    if (!pattern.test(input.value) || Number.parseFloat(input.value) <= 0) {
        alert('Invalid amount!');
        return;
    }
    editCartServer(item, Number.parseFloat(input.value));
}

async function editCartServer(item, newAmount) {
    let resp = await fetch(`${host}/api/cart/${item.product.uuid}`, {
        method :'POST',
        headers: {
            'x-expediente': exp,
            'x-user': getUser(),
            'content-type': 'application/json'
        },
        body: JSON.stringify({amount: newAmount})
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else {
        item.amount = newAmount;
        renderCart();
    }
}

function cartBillToHTML() {
    return /*html*/`
        <div class="container mt-3">
            <div class="media border p-3 object-container">
                <div class="media-body">
                    <h4>Total purchase</h4>
                    ${
                        cart.map(item => {
                            return /*html*/`
                                <p>
                                    <b>${item.product.name}: </b>
                                    ${item.amount} x ${item.product.pricePerUnit} MXN
                                </p>`;
                        }).join('')
                    }
                    <h5>Total: ${cart.reduce((sum, item) =>
                                sum + item.amount * item.product.pricePerUnit, 0).toFixed(2)} MXN</h5>
                    <br />
                    <div class="row justify-content-center">
                        <div class="col-5">
                            <div class="row">
                                <button type="button" class="btn btn-primary">Pay</button>
                            </div>
                            <br />
                            <div class="row">
                                <button type="button" class="btn btn-danger">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
