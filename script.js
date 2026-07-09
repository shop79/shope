// script.js

// Товары
const products = [
    { id: 1, name: 'Футболка', price: 1200 },
    { id: 2, name: 'Джинсы', price: 2500 },
    { id: 3, name: 'Кроссовки', price: 3500 },
    { id: 4, name: 'Рюкзак', price: 1800 },
    { id: 5, name: 'Часы', price: 2200 },
    { id: 6, name: 'Наушники', price: 1600 }
];

// ----- Хранилище -----
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

let currentUser = null;

// ----- UI элементы -----
const authSection = document.getElementById('authSection');
const catalogSection = document.getElementById('catalogSection');
const userStatus = document.getElementById('userStatus');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const productList = document.getElementById('productList');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const clearCartBtn = document.getElementById('clearCartBtn');
const closeCart = document.querySelector('.close');

// ----- Авторизация -----
function login() {
    const login = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    if (!login || !pass) return alert('Введите логин и пароль');
    const users = getUsers();
    if (users[login] && users[login] === pass) {
        currentUser = login;
        userStatus.textContent = login;
        authSection.style.display = 'none';
        catalogSection.style.display = 'block';
        logoutBtn.style.display = 'inline';
        renderProducts();
    } else {
        alert('Неверный логин или пароль');
    }
}

function register() {
    const login = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    if (!login || !pass) return alert('Введите логин и пароль');
    const users = getUsers();
    if (users[login]) {
        alert('Пользователь уже существует');
        return;
    }
    users[login] = pass;
    saveUsers(users);
    alert('Регистрация успешна! Теперь войдите.');
}

function logout() {
    currentUser = null;
    userStatus.textContent = 'Гость';
    authSection.style.display = 'block';
    catalogSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    saveCart([]);
}

loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
logoutBtn.addEventListener('click', logout);

// ----- Каталог -----
function renderProducts() {
    productList.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${p.name}</h3>
            <div class="price">${p.price} ₽</div>
            <button data-id="${p.id}">В корзину</button>
        `;
        card.querySelector('button').addEventListener('click', () => addToCart(p.id));
        productList.appendChild(card);
    });
}

function addToCart(productId) {
    if (!currentUser) return alert('Сначала войдите в систему');
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
}

function updateCartCounter() {
    const cart = getCart();
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cartCount').textContent = count;
}

// ----- Корзина (модалка) -----
cartBtn.addEventListener('click', () => {
    if (!currentUser) return alert('Сначала войдите');
    renderCart();
    cartModal.style.display = 'flex';
});

function renderCart() {
    const cart = getCart();
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        totalPrice.textContent = '0';
        return;
    }
    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        html += `<div class="cart-item">
            <span>${item.name} x${item.qty}</span>
            <span>${item.price * item.qty} ₽</span>
        </div>`;
    });
    cartItems.innerHTML = html;
    totalPrice.textContent = total;
}

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

clearCartBtn.addEventListener('click', () => {
    if (confirm('Очистить корзину?')) {
        saveCart([]);
        renderCart();
    }
});

// Закрытие по клику вне модалки
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// ----- Инициализация -----
updateCartCounter();

// Если есть сохранённая сессия (для простоты — не храним, пусть каждый раз заходит)