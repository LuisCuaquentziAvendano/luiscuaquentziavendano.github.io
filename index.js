let products = [];
let filtered = [];
let host = 'https://products-dasw.onrender.com';
let exp = 746284;
let productsWindow = 7;
let goToCart = false;
renderPage();

async function renderPage() {
    // await loadDataToServer();
    // sessionStorage.setItem('user', '');
    await getProductsFromServer();
    renderProductsWindow();
}

async function loadDataToServer() {
    let names = [
        "Watermelon", "Onion", "Avocado", "Banana", "White bread",
        "Apple", "Carrot", "Lettuce", "Orange", "Tomato",
        "Pineapple", "Broccoli", "Cucumber", "Grapes", "Brown bread",
        "Mango", "Potato", "Spinach", "Strawberry", "Whole grain bread"
    ];
    let descriptions = [
        "From Mexico", "From Puebla", "From Michoacan", "From Aguascalientes", "From Jalisco",
        "From USA", "From Spain", "From California", "From Florida", "From Italy",
        "From Costa Rica", "From Ecuador", "From Netherlands", "From Chile", "From France",
        "From India", "From Idaho", "From Australia", "From Japan", "From Germany"
    ];
    let units = [
        "piece", "kg", "kg", "kg", "piece",
        "piece", "kg", "piece", "kg", "kg",
        "piece", "kg", "kg", "kg", "piece",
        "piece", "kg", "kg", "kg", "piece"
    ];
    let categories = [
        "fruit", "vegetable", "vegetable", "fruit", "bread",
        "fruit", "vegetable", "vegetable", "fruit", "vegetable",
        "fruit", "vegetable", "vegetable", "fruit", "bread",
        "fruit", "vegetable", "vegetable", "fruit", "bread"
    ];
    let prices = [
        80.50, 125.00, 98.00, 32.00, 62.50,
        70.25, 45.75, 30.00, 55.00, 42.80,
        65.40, 38.20, 23.50, 78.90, 58.00,
        90.20, 15.60, 50.75, 120.00, 55.80
    ];
    let stocks = [
        15, 5, 10, 8, 25,
        20, 12, 18, 30, 15,
        22, 17, 9, 14, 28,
        35, 10, 20, 40, 30
    ];
    let images = [
        'https://www.collinsdictionary.com/images/full/watermelon_222700726.jpg',
        'https://produits.bienmanger.com/36700-0w470h470_Organic_Red_Onion_From_Italy.jpg',
        'https://cdn.britannica.com/72/170772-050-D52BF8C2/Avocado-fruits.jpg',
        'https://www.shutterstock.com/image-photo/bunch-bananas-isolated-on-white-600nw-99478112.jpg',
        'https://www.goldmedalbakery.com/content/uploads/2019/12/Jumbo-22oz-White.jpg',
        'https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834',
        'https://elpoderdelconsumidor.org/wp-content/uploads/2021/05/zanahorias.png',
        'https://www.smartnfinal.com.mx/wp-content/uploads/2016/09/99550-LECHIGA-BOLA.jpg',
        'https://i.pinimg.com/550x/b2/38/62/b23862aabbcdc7146588c4fa641c7414.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/800px-Bright_red_tomato_and_cross_section02.jpg',
        'https://www.gob.mx/cms/uploads/image/file/415269/pi_a_1.jpg',
        'https://elpoderdelconsumidor.org/wp-content/uploads/2016/11/brocoli.jpg',
        'https://media.justo.mx/products/VERDURAS-Pepino-6.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQUe5_qAtXAStBatf6FrMANApkatCGP2K0gK1AgoVog&s',
        'https://www.allergywise.co.nz/images/products/Allergywise-Gluten-Free-BROWN-LOAF-297.jpg',
        'https://www.soriana.com/dw/image/v2/BGBD_PRD/on/demandware.static/-/Sites-soriana-grocery-master-catalog/default/dw854cc9be/images/product/0000000004220_A.jpg?sw=445&sh=445&sm=fit',
        'https://www.superaki.mx/cdn/shop/products/0000000000147_554d7657-8d42-4a0a-b149-f85b097cb95b_300x300.png?v=1634911471',
        'https://www.tastingtable.com/img/gallery/is-it-worth-buying-canned-spinach-over-fresh/l-intro-1680798210.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyuvGVxGiS8gMB_IMBKCyrNAhWBpPxHEc13Jl9cj-0hQ&s',
        'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/9/11/0/HE_whole-wheat-bread_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1371609761646.jpeg'
    ];
    await getProductsFromServer();
    for (let i = 0; i < products.length; i++) {
        await fetch(`${host}/api/products/${products[i].uuid}`, {
            method :'DELETE',
            headers: {
                'x-expediente': exp,
                'x-auth': 'admin'
            }
        });
    }
    for (let i = 0; i < names.length; i++) {
        let newProduct = {
            name: names[i],
            description: descriptions[i],
            pricePerUnit: prices[i],
            stock: stocks[i],
            category: categories[i],
            imageUrl: images[i],
            unit: units[i]
        };
        await fetch(`${host}/api/products`, {
            method :'POST',
            headers: {
                'x-expediente': exp,
                'x-auth': 'admin',
                'content-type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
    }
}

async function getProductsFromServer() {
    let resp = await fetch(`${host}/api/products`, {
        method :'GET',
        headers: {
            'x-expediente': exp
        }
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else
        products = data;
}

function productToHTML(product) {
    return /*html*/`
        <div class="card card-container">
            <img
                class="card-img-top card-image"
                src="${product.imageUrl}"
                alt="${product.name}"
            />
            <div class="card-body text-center">
                <h4 class="card-title text-center">${product.name}</h4>
                <p class="card-text text-center">${product.description}</p>
                <p class="card-text text-center">$ ${product.pricePerUnit} /
                                    ${product.unit}</p>
                <button class="btn btn-primary"
                        role="button"
                        onclick="addCart('${product.uuid}')">
                    <i class="bi bi-cart-fill"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

document.getElementById('search')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        let toSearch = document.querySelector('#search #input').value;
        if (toSearch === '') {
            renderProductsWindow();
            return;
        }
        filter('name', toSearch);
    });

document.querySelectorAll('.categories').forEach(cat =>
    cat.addEventListener('click', () => {
        let category = cat.getAttribute('data-category');
        filter('category', category);
    }));

async function filter(property, value) {
    let resp = await fetch(`${host}/api/products?${property}=${value}`, {
        method :'GET',
        headers: {
            'x-expediente': exp,
            'x-auth': 'admin'
        }
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else {
        filtered = data;
        renderProductsWindow(0, true);
    }
}

document.getElementById('login-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        let email = document.querySelector('#login-modal #email').value;
        sessionStorage.setItem('user', email);
        document.getElementById('login-modal-close').click();
    });


document.getElementById('signup-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        let email = document.querySelector('#signup-form #email').value;
        sessionStorage.setItem('user', email);
        document.getElementById('signup-modal-close').click();
    });

document.getElementById('cart')
    .addEventListener('click', (e) => {
        if (sessionStorage.getItem('user') === null) {
            e.preventDefault();
            goToCart = true;
            document.getElementById('login-modal-button').click();
        }
    });

document.getElementById('login-modal-close')
    .addEventListener('click', () => {
        if (goToCart)
            document.getElementById('cart').click();
    });

document.getElementById('signup-modal-close')
    .addEventListener('click', () => {
        if (goToCart)
            document.getElementById('cart').click();
    });

function addCart(uuid) {
    let product = products.find(p => p.uuid === uuid);
    if (sessionStorage.getItem('user') === null) {
        document.getElementById('login-modal-button').click();
        return;
    }
    Swal.fire({
        title: product.unit === 'piece'
                    ? 'How many products do you want to add to the cart?'
                    : 'How much product do you want to add to the cart?',
        input: 'text',
        inputAttributes: {
            pattern: product.unit === 'piece' ? '[0-9]+' : '[0-9]+(\\.[0-9]+)?',
            placeholder: product.unit
        },
        showCancelButton: true,
        confirmButtonText: 'Add to cart',
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            if (Number.parseFloat(result.value) === 0)
                alert(`You cannot add 0 ${product.unit}s to the cart`);
            else
                addCartServer(uuid, result.value);
        }
    });
}

async function addCartServer(uuid, quantity) {
    let resp = await fetch(`${host}/api/cart/${uuid}`, {
        method :'POST',
        headers: {
            'x-expediente': exp,
            'x-user': sessionStorage.getItem('user'),
            'content-type': 'application/json'
        },
        body: JSON.stringify({amount: quantity})
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
}
