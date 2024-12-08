// HTML Element References
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let search = document.getElementById('search');

// Initialize the Product Management Data
let dataPro = JSON.parse(localStorage.getItem('product')) || [];
let mood = 'create';
let tmp;

// Get elements
let loginForm = document.getElementById('loginForm');
let loginUsername = document.getElementById('loginUsername');
let loginPassword = document.getElementById('loginPassword');
let errorMessage = document.getElementById('error');
let loginSection = document.getElementById('loginSection');
let crudSection = document.getElementById('crudSection');
let logoutButton = document.getElementById('logoutButton');

// Check if the user is logged in
window.onload = function() {
    let loggedIn = localStorage.getItem('loggedIn');  // Check if there's a login state
    if (loggedIn === 'true') {
        loginSection.style.display = 'none';
        crudSection.style.display = 'block';
        showData();  // Load PMS data after login
    } else {
        loginSection.style.display = 'block';
        crudSection.style.display = 'none';
    }
};

// Login form submit
loginForm.onsubmit = function (e) {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let foundUser = users.find(user => user.username === loginUsername.value && user.password === loginPassword.value);

    if (foundUser) {
        // If credentials are correct, save login state and show the PMS
        localStorage.setItem('loggedIn', 'true');  // Save loggedIn state
        loginSection.style.display = 'none';
        crudSection.style.display = 'block';
        showData();  // Load PMS data after login
    } else {
        // Show error if credentials are incorrect
        errorMessage.style.display = 'block';
    }
};

// Logout button click handler
logoutButton.onclick = function() {
    // Clear login state and show the login section again
    localStorage.setItem('loggedIn', 'false');  // Remove login state
    loginSection.style.display = 'block';
    crudSection.style.display = 'none';
    errorMessage.style.display = 'none';  // Hide error message
};



// Create Product
submit.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
        status: 'Available',
    };

    if (title.value !== '' && price.value !== '' && category.value !== '' && newPro.count < 100) {
        if (mood === 'create') {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = 'Create';
            count.style.display = 'block';
        }
        clearData();
    }
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
};

// Clear Input Fields
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Show Data
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td>${dataPro[i].status}</td>
                <td><button onclick="updateData(${i})">Update</button></td>
                <td><button onclick="deleteData(${i})">Delete</button></td>
                <td><button onclick="toggleStatus(${i})">${dataPro[i].status === 'Available' ? 'Mark Out of Stock' : 'Mark Available'}</button></td>
            </tr>`;
    }
    document.getElementById('tbody').innerHTML = table;
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

// Toggle Product Availability (Status)
function toggleStatus(i) {
    dataPro[i].status = dataPro[i].status === 'Available' ? 'Out of Stock' : 'Available';
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// Delete Product
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// Delete All Products
function deleteAll() {
    localStorage.clear();
    dataPro = [];
    showData();
}

// Update Product
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get Total Price Calculation
function getTotal() {
    if (price.value !== '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

// Search Products by Title or Category
let searchMood = 'title';

function getSearchMood(id) {
    if (id === 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.placeholder = 'Search by ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}

function searchData(value) {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood === 'title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${dataPro[i].title}</td>
                        <td>${dataPro[i].price}</td>
                        <td>${dataPro[i].taxes}</td>
                        <td>${dataPro[i].ads}</td>
                        <td>${dataPro[i].discount}</td>
                        <td>${dataPro[i].total}</td>
                        <td>${dataPro[i].category}</td>
                        <td>${dataPro[i].status}</td>
                        <td><button onclick="updateData(${i})">Update</button></td>
                        <td><button onclick="deleteData(${i})">Delete</button></td>
                    </tr>`;
            }
        } else {
            if (dataPro[i].category.includes(value.toLowerCase())) {
                table += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${dataPro[i].title}</td>
                        <td>${dataPro[i].price}</td>
                        <td>${dataPro[i].taxes}</td>
                        <td>${dataPro[i].ads}</td>
                        <td>${dataPro[i].discount}</td>
                        <td>${dataPro[i].total}</td>
                        <td>${dataPro[i].category}</td>
                        <td>${dataPro[i].status}</td>
                        <td><button onclick="updateData(${i})">Update</button></td>
                        <td><button onclick="deleteData(${i})">Delete</button></td>
                    </tr>`;
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}
