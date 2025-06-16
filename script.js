document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Firebase
    const auth = firebase.auth();
    const db = firebase.firestore();
    
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
    
    // Элементы идей
    const getStartedBtn = document.getElementById('getStartedBtn');
    const featuredIdeasContainer = document.getElementById('featuredIdeas');
    const recentIdeasContainer = document.getElementById('recentIdeas');
    const addIdeaForm = document.getElementById('addIdeaForm');
    const submitIdeaBtn = document.getElementById('submitIdeaBtn');
    const ideaTitle = document.getElementById('ideaTitle');
    const ideaDescription = document.getElementById('ideaDescription');
    const ideaCategory = document.getElementById('ideaCategory');
    
    let currentUser = null;

    // Проверка авторизации
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            authButton.textContent = 'Профиль';
            loadProfileData(user.uid);
            loadIdeas();
            addIdeaForm.style.display = 'block';
        } else {
            currentUser = null;
            authButton.textContent = 'Вход/Регистрация';
            addIdeaForm.style.display = 'none';
        }
    });

    // Открытие модальных окон
    authButton.addEventListener('click', () => {
        if (authButton.textContent === 'Профиль') {
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

    // Кнопка "Начать сейчас"
    getStartedBtn.addEventListener('click', () => {
        if (currentUser) {
            addIdeaForm.scrollIntoView({ behavior: 'smooth' });
        } else {
            modal.style.display = 'block';
        }
    });

    // Регистрация
    registerBtn.addEventListener('click', async () => {
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const errorElement = document.getElementById('registerError');
        
        if (!email || !password) {
            errorElement.textContent = 'Все поля обязательны для заполнения';
            return;
        }
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            await db.collection('users').doc(user.uid).set({
                email: email,
                firstName: '',
                lastName: '',
                occupation: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            modal.style.display = 'none';
            errorElement.textContent = '';
        } catch (error) {
            errorElement.textContent = error.message;
        }
    });

    // Вход
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');
        
        if (!email || !password) {
            errorElement.textContent = 'Все поля обязательны для заполнения';
            return;
        }
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            modal.style.display = 'none';
            errorElement.textContent = '';
        } catch (error) {
            errorElement.textContent = error.message;
        }
    });

    // Управление профилем
    editProfileBtn.addEventListener('click', () => {
        profileView.style.display = 'none';
        profileEdit.style.display = 'block';
        
        // Заполнение полей текущими данными
        if (currentUser) {
            db.collection('users').doc(currentUser.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        firstNameInput.value = userData.firstName || '';
                        lastNameInput.value = userData.lastName || '';
                        occupationInput.value = userData.occupation || '';
                    }
                });
        }
    });
    
    saveProfileBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        
        try {
            await db.collection('users').doc(currentUser.uid).update({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                occupation: occupationInput.value
            });
            
            loadProfileData(currentUser.uid);
            profileEdit.style.display = 'none';
            profileView.style.display = 'block';
        } catch (error) {
            console.error("Ошибка сохранения профиля:", error);
        }
    });
    
    cancelEditBtn.addEventListener('click', () => {
        profileEdit.style.display = 'none';
        profileView.style.display = 'block';
    });

    // Загрузка данных профиля
    function loadProfileData(uid) {
        db.collection('users').doc(uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    viewFirstName.textContent = userData.firstName || 'Не указано';
                    viewLastName.textContent = userData.lastName || 'Не указано';
                    viewOccupation.textContent = userData.occupation || 'Не указано';
                }
            })
            .catch(error => {
                console.error("Ошибка загрузки профиля:", error);
            });
    }

    // Загрузка идей
    function loadIdeas() {
        db.collection('ideas')
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get()
            .then(querySnapshot => {
                const recentIdeas = [];
                querySnapshot.forEach(doc => {
                    recentIdeas.push({ id: doc.id, ...doc.data() });
                });
                
                const featuredIdeas = recentIdeas.slice(0, 3);
                displayIdeas(featuredIdeas, featuredIdeasContainer);
                displayIdeas(recentIdeas, recentIdeasContainer);
            })
            .catch(error => {
                console.error("Ошибка загрузки идей:", error);
            });
    }
    
    // Отображение идей
    function displayIdeas(ideas, container) {
        container.innerHTML = '';
        
        ideas.forEach(idea => {
            const ideaCard = document.createElement('div');
            ideaCard.className = 'idea-card';
            
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
                        <span>${idea.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="idea-category category-${idea.category}">${getCategoryName(idea.category)}</div>
                </div>
            `;
            
            container.appendChild(ideaCard);
        });
    }
    
    // Публикация идеи
    submitIdeaBtn.addEventListener('click', async () => {
        const title = ideaTitle.value.trim();
        const description = ideaDescription.value.trim();
        const category = ideaCategory.value;
        
        if (!title || !description) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!currentUser) {
            alert('Для публикации идеи необходимо авторизоваться');
            return;
        }
        
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            const userData = userDoc.data();
            
            await db.collection('ideas').add({
                title,
                description,
                category,
                author: `${userData.firstName} ${userData.lastName}` || userData.email,
                authorId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes: 0
            });
            
            ideaTitle.value = '';
            ideaDescription.value = '';
            await loadIdeas();
            alert('Идея успешно опубликована!');
        } catch (error) {
            console.error("Ошибка публикации идеи:", error);
            alert('Произошла ошибка при публикации идеи');
        }
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

    // Выход из системы
    function logout() {
        auth.signOut()
            .then(() => {
                currentUser = null;
            })
            .catch(error => {
                console.error("Ошибка выхода:", error);
            });
    }
});
