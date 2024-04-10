function renderProductsWindow(window=0, isFilter=false) {
    let array = isFilter ? filtered : products;
    let pages = Math.ceil(array.length / productsWindow);
    if (window < 0)
        window = 0;
    if (window >= pages)
        window = pages - 1;
    let i = Math.max(window * productsWindow, 0);
    let j = Math.min((window + 1) * productsWindow, array.length);
    let buffer = [];
    for (let k = i; k < j; k++)
        buffer.push(productToHTML(array[k]));
    let cardsContainer = document.getElementById('products-container');
    cardsContainer.innerHTML = buffer.join('');
    buffer = [];
    buffer.push(pageBackToHTML(window, isFilter));
    for (let k = 0; k < pages; k++) {
        let pageHTML = '';
        if (k == window)
            pageHTML = pageNumberFocus(k, isFilter);
        else
            pageHTML = pageNumber(k, isFilter);
        buffer.push(pageHTML);
    }
    buffer.push(pageNextToHTML(window, isFilter));
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = buffer.join('');
}

function pageBackToHTML(window, isFilter) {
    return /*html*/`
        <li class="page-item" onclick="renderProductsWindow(${window-1}, ${isFilter})">
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>`;
}

function pageNextToHTML(window, isFilter) {
    return /*html*/`
        <li class="page-item" onclick="renderProductsWindow(${window+1}, ${isFilter})">
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>`;
}

function pageNumber(window, isFilter) {
    return /*html*/`
        <li class="page-item">
            <a class="page-link" href="#"
                    onclick="renderProductsWindow(${window}, ${isFilter})">
                ${window+1}
            </a>
        </li>`;
}

function pageNumberFocus(window, isFilter) {
    return /*html*/`
        <li class="page-item active" aria-current="page">
            <a class="page-link" href="#"
                    onclick="renderProductsWindow(${window}, ${isFilter})">
                ${window+1}
            </a>
        </li>`;
}
