let products = [];
let filtered = [];
let filter;
let editProduct;
let host = 'https://products-dasw.onrender.com';
let exp = 746284;
let productsWindow = 7;
renderPage();

async function renderPage() {
    await getProductsAdmin();
    tableHeaders();
    prepareModal();
    renderProductsWindow();
}

async function getProductsAdmin() {
    let resp = await fetch(`${host}/api/products`, {
        method :'GET',
        headers: {
            'x-expediente': exp,
            'x-auth': 'admin'
        }
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else
        products = data;
}

function tableHeaders() {
    let tableHeaders = document.getElementById('table-headers');
    let headers = /*html*/`
        <tr>
            <th>EDIT</th>
            ${Object.keys(products[0]).map(key => /*html*/`
                <th>
                    ${key}
                </th>`).join('')}
        </tr>`;
    tableHeaders.innerHTML = headers;
}

function productToHTML(product) {
    return /*html*/`
        <tr>
            <td>
                    <button id="edit-${product.uuid}"
                            class="btn btn-primary"
                            onclick="showEditionCreationForm(true, '${product.uuid}')">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
            </td>
            ${Object.keys(product).map(key => {
                if (key === 'imageUrl')
                    return /*html*/`
                        <td>
                            <img style="width: 10rem;"
                                class="card-img-top card-image"
                                src="${product.imageUrl}"
                                alt="${product.name}"/>
                        </td>`;
                else
                    return /*html*/`
                        <td>
                            ${product[key]}
                        </td>`;
            }).join('')}
        </tr>`;
}

document.querySelectorAll('.filters').forEach(filterType =>
    filterType.addEventListener('click', () => {
        let search = document.getElementById('search');
        let searchInput1 = document.getElementById('search-input-1');
        let searchInput2 = document.getElementById('search-input-2');
        filter = filterType.getAttribute('data-filter');
        searchInput1.value = '';
        searchInput2.value = '';
        search.classList.remove('no-display');
        search.classList.add('d-flex');
        searchInput2.classList.add('no-display');
        searchInput1.setAttribute('placeholder', 'Filter by ' + filter);
        if (filter !== 'price')
            return;
        searchInput1.setAttribute('placeholder', 'Min price');
        searchInput2.classList.remove('no-display');
        searchInput2.setAttribute('placeholder', 'Max price');
    })
);

document.getElementById('close-filter')
    .addEventListener('click', () => {
        let search = document.getElementById('search');
        search.classList.add('no-display');
        search.classList.remove('d-flex');
        renderProductsWindow(0, false);
    });

document.getElementById('search')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        let searchInput1 = document.getElementById('search-input-1');
        let searchInput2 = document.getElementById('search-input-2');
        let currFilter;
        if (filter === 'price')
            currFilter = 'min='+ searchInput1.value + '&max=' + searchInput2.value;
        else
            currFilter = filter + '=' + searchInput1.value;
        filterProducts(currFilter);
    });

async function filterProducts(currFilter) {
    let resp = await fetch(`${host}/api/products?${currFilter}`, {
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

document.getElementById('create-product')
    .addEventListener('click', () => {
        showEditionCreationForm(false);
    });

function prepareModal() {
    let fields = document.getElementById('form-fields');
    let buffer = [];
    Object.keys(products[0]).forEach(key => {
        if (key !== '_id') {
            let field = formFieldToHTML(key);
            buffer.push(field);
        }
    });
    fields.innerHTML = buffer.join('');
}

function formFieldToHTML(key) {
    return /*html*/`
        <div ${key === 'uuid' ? 'id="uuid-field"' : ''} class="mb-3">
            <label for="modal-${key}" class="form-label">
                ${key}
            </label>
            <div class="input-group">
                <input
                    ${
                        ['stock', 'pricePerUnit'].includes(key)
                        ? 'pattern="[0-9]+(\\.[0-9]+)?"'
                        : ''
                    }
                    ${
                        key === 'uuid' ? 'disabled' : ''
                    }
                    type="text"
                    class="form-control"
                    name="${key}"
                    id="modal-${key}"
                    aria-describedby="${key}"
                    required/>
            </div>
        </div>`;
}

function showEditionCreationForm(isEdition, uuid) {
    editProduct = isEdition;
    let product = products.find(p => p.uuid === uuid);
    let modal = document.getElementById('product-modal');
    let BSmodal = new bootstrap.Modal(modal, {});
    document.getElementById('modalTitleId').innerHTML
        = isEdition ? 'Product edition' : 'Product creation';
    document.getElementById('submit-form').innerHTML
        = isEdition ? 'Edit' : 'Create';
    Object.keys(products[0]).forEach(key => {
        if (key !== '_id') {
            let input = document.querySelector('#product-modal #modal-' + key);
            let uuidField = document.querySelector('#product-modal #uuid-field');
            input.value = isEdition ? product[key] : '';
            if (key === 'uuid') {
                uuidField.classList.remove('no-display');
                if (!isEdition)
                    uuidField.classList.add('no-display');
            }
        }
    });
    BSmodal.show();
}

document.getElementById('product-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        let input = document.querySelector('#product-modal #modal-uuid');
        editCreateProductAdmin(editProduct, input.value);
    });

async function editCreateProductAdmin(isEdition, uuid) {
    let product = {};
    let spaces = false;
    Object.keys(products[0]).forEach(key => {
        if (!['_id', 'uuid'].includes(key)) {
            let input = document.querySelector('#product-modal #modal-' + key);
            product[key] = input.value;
            if (product[key].replaceAll(' ', '').length === 0)
                spaces = true;
        }
    });
    if (spaces) {
        alert('A field only has spaces');
        return;
    }
    let resp = await fetch(`${host}/api/products${isEdition ? '/'+uuid : ''}`, {
        method: isEdition ? 'PUT' : 'POST',
        headers: {
            'x-expediente': exp,
            'x-auth': 'admin',
            'content-type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    let data = await resp.json();
    if (data.error)
        alert(data.error);
    else {
        document.querySelector('#product-modal #modal-close').click();
        renderPage();
    }
}
