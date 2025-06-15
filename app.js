// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8s1_iQ04S5a6rlzOkLbsg-weoCQzzG50",
  authDomain: "profiles-site.firebaseapp.com",
  projectId: "profiles-site",
  storageBucket: "profiles-site.firebasestorage.app",
  messagingSenderId: "539714982046",
  appId: "1:539714982046:web:d09296102e765bcfcb2b8f"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Переключение между формами
function showRegister() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
}

// Регистрация
function register() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const errorElement = document.getElementById("register-error");

    // Создаём пользователя в Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Сохраняем имя пользователя в Firestore
            db.collection("users").doc(user.uid).set({
                username: username,
                email: email
            }).then(() => {
                alert("Регистрация успешна!");
                // Перенаправляем на главную (позже добавим)
                // window.location.href = "profiles.html";
            }).catch((error) => {
                errorElement.textContent = "Ошибка сохранения данных: " + error.message;
            });
        })
        .catch((error) => {
            errorElement.textContent = "Ошибка регистрации: " + error.message;
        });
}

// Вход
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorElement = document.getElementById("login-error");

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Вход выполнен!");
            // Перенаправляем на главную (позже добавим)
            // window.location.href = "profiles.html";
        })
        .catch((error) => {
            errorElement.textContent = "Ошибка входа: " + error.message;
        });
}
