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

    //элементы главной страницы
    const getStartedBtn = document.getElementById('getStartedBtn');
    const featuredIdeasContainer = document.getElementById('featuredIdeas');
    const recentIdeasContainer = document.getElementById('recentIdeas');
    const addIdeaForm = document.getElementById('addIdeaForm');
    const submitIdeaBtn = document.getElementById('submitIdeaBtn');
    const ideaTitle = document.getElementById('ideaTitle');
    const ideaDescription = document.getElementById('ideaDescription');
    const ideaCategory = document.getElementById('ideaCategory');
    
    // Инициализация базы данных
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }
        // Инициализация идей в localStorage
    if (!localStorage.getItem('ideas')) {
        localStorage.setItem('ideas', JSON.stringify([]));
    }

    // Проверка авторизации при загрузке
    checkAuth();

        // Кнопка "Начать сейчас"
    getStartedBtn.addEventListener('click', () => {
        if (localStorage.getItem('currentUser')) {
            addIdeaForm.scrollIntoView({ behavior: 'smooth' });
        } else {
            modal.style.display = 'block';
        }
    });

    // Загрузка и отображение идей
    function loadIdeas() {
        const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
        
        // Сортируем по дате (новые сначала)
        const recentIdeas = [...ideas].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        
        // "Популярные" - просто первые 3 из недавних для примера
        const featuredIdeas = recentIdeas.slice(0, 3);
        
        displayIdeas(featuredIdeas, featuredIdeasContainer);
        displayIdeas(recentIdeas, recentIdeasContainer);
        
        // Показываем форму добавления для авторизованных
        if (localStorage.getItem('currentUser')) {
            addIdeaForm.style.display = 'block';
        }
    }
    
    // Отображение идей в контейнере
    function displayIdeas(ideas, container) {
        container.innerHTML = '';
        
        ideas.forEach(idea => {
            const ideaCard = document.createElement('div');
            ideaCard.className = 'idea-card';
            
            // Случайное изображение для демо
            const images = [
                'linear-gradient(135deg, #1abc9c, #16a085)',
                'linear-gradient(135deg, #3498db, #2980b9)',
                'linear-gradient(135deg, #9b59b6, #8e44ad)',
                'linear-gradient(135deg, #34495e, #2c3e50)',
                'linear-gradient(135deg, #f1c40f, #f39c12)',
                'linear-gradient(135deg, #e74c3c, #c0392b)'
            ];
            
            const randomImage = images[Math.floor(Math.random() * images.length)];
            
            ideaCard.innerHTML = `
                <div class="idea-image" style="background: ${randomImage};"></div>
                <div class="idea-content">
                    <h3 class="idea-title">${idea.title}</h3>
                    <p class="idea-description">${idea.description.substring(0, 100)}${idea.description.length > 100 ? '...' : ''}</p>
                    <div class="idea-meta">
                        <span>${idea.author}</span>
                        <span>${new Date(idea.date).toLocaleDateString()}</span>
                    </div>
                    <div class="idea-category category-${idea.category}">${getCategoryName(idea.category)}</div>
                </div>
            `;
            
            container.appendChild(ideaCard);
        });
    }
    
    // Отправка новой идеи
    submitIdeaBtn.addEventListener('click', () => {
        const title = ideaTitle.value.trim();
        const description = ideaDescription.value.trim();
        const category = ideaCategory.value;
        const currentUser = localStorage.getItem('currentUser');
        
        if (!title || !description) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!currentUser) {
            alert('Для публикации идеи необходимо авторизоваться');
            return;
        }
        
        const newIdea = {
            id: Date.now(),
            title,
            description,
            category,
            author: currentUser,
            date: new Date().toISOString()
        };
        
        const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
        ideas.push(newIdea);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        
        // Очистка формы
        ideaTitle.value = '';
        ideaDescription.value = '';
        
        // Обновление ленты
        loadIdeas();
        
        alert('Идея успешно опубликована!');
    });

    // Вспомогательная функция для названий категорий
    function getCategoryName(category) {
        const categories = {
            'design': 'Дизайн',
            'tech': 'Технологии',
            'art': 'Искусство',
            'business': 'Бизнес',
            'education': 'Образование'
        };
        return categories[category] || 'Другое';
    }

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
    loadIdeas();
});
