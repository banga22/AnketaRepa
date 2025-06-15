// script.js - Дополненная версия
document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const authButton = document.getElementById('authButton');
    const modal = document.getElementById('authModal');
    const profileModal = document.getElementById('profileModal');
    const closeBtns = document.querySelectorAll('.close, .close-profile');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Элементы профиля
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const occupationInput = document.getElementById('occupation');
    const viewFirstName = document.getElementById('viewFirstName');
    const viewLastName = document.getElementById('viewLastName');
    const viewOccupation = document.getElementById('viewOccupation');
    
    // Инициализация базы данных
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }

    // Проверка авторизации при загрузке
    checkAuth();

    // Обработчики для модальных окон
    authButton.addEventListener('click', () => {
        if (authButton.textContent === 'Профиль') {
            loadProfileData();
            profileModal.style.display = 'block';
        } else if (authButton.textContent === 'Выйти') {
            logout();
        } else {
            modal.style.display = 'block';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    });

    // Закрытие модальных окон
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            profileModal.style.display = 'none';
        });
    });

    // Переключение между формами авторизации
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
        
        // Регистрация нового пользователя с пустым профилем
        users[email] = { 
            password,
            firstName: '',
            lastName: '',
            occupation: ''
        };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматический вход после регистрации
        localStorage.setItem('currentUser', email);
        modal.style.display = 'none';
        checkAuth();
        errorElement.textContent = '';
    });

    // Управление профилем
    editProfileBtn.addEventListener('click', () => {
        // Переключение в режим редактирования
        profileView.style.display = 'none';
        profileEdit.style.display = 'block';
        
        // Заполнение полей текущими данными
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users[currentUser];
            
            firstNameInput.value = user.firstName || '';
            lastNameInput.value = user.lastName || '';
            occupationInput.value = user.occupation || '';
        }
    });
    
    saveProfileBtn.addEventListener('click', () => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users[currentUser];
            
            // Обновление данных профиля
            user.firstName = firstNameInput.value;
            user.lastName = lastNameInput.value;
            user.occupation = occupationInput.value;
            
            // Сохранение изменений
            users[currentUser] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновление отображения
            loadProfileData();
            
            // Возврат в режим просмотра
            profileEdit.style.display = 'none';
            profileView.style.display = 'block';
        }
    });
    
    cancelEditBtn.addEventListener('click', () => {
        profileEdit.style.display = 'none';
        profileView.style.display = 'block';
    });

    // Проверка авторизации
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            authButton.textContent = 'Профиль';
        } else {
            authButton.textContent = 'Вход/Регистрация';
        }
    }

    // Загрузка данных профиля
    function loadProfileData() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users[currentUser];
            
            viewFirstName.textContent = user.firstName || 'Не указано';
            viewLastName.textContent = user.lastName || 'Не указано';
            viewOccupation.textContent = user.occupation || 'Не указано';
        }
    }

    // Выход из системы
    function logout() {
        localStorage.removeItem('currentUser');
        checkAuth();
    }
});
