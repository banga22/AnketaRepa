// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const authButton = document.getElementById('authButton');
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Инициализация базы данных в localStorage
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }

    // Проверка авторизации при загрузке
    checkAuth();

    // Открытие модального окна
    authButton.addEventListener('click', () => {
        if (authButton.textContent === 'Выйти') {
            logout();
        } else {
            modal.style.display = 'block';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Переключение между формами
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Обработка входа
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');
        
        if (!email || !password) {
            errorElement.textContent = 'Все поля обязательны для заполнения';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users[email] && users[email].password === password) {
            // Успешный вход
            localStorage.setItem('currentUser', email);
            modal.style.display = 'none';
            checkAuth();
            errorElement.textContent = '';
        } else {
            errorElement.textContent = 'Неверный email или пароль';
        }
    });

    // Обработка регистрации
    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const errorElement = document.getElementById('registerError');
        
        if (!email || !password) {
            errorElement.textContent = 'Все поля обязательны для заполнения';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users[email]) {
            errorElement.textContent = 'Пользователь с таким email уже существует';
            return;
        }
        
        // Регистрация нового пользователя
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматический вход после регистрации
        localStorage.setItem('currentUser', email);
        modal.style.display = 'none';
        checkAuth();
        errorElement.textContent = '';
    });

    // Проверка авторизации
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            authButton.textContent = 'Выйти';
        } else {
            authButton.textContent = 'Вход/Регистрация';
        }
    }

    // Выход из системы
    function logout() {
        localStorage.removeItem('currentUser');
        checkAuth();
    }
});
