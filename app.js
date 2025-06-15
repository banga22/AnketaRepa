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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Вход
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("profile-section").style.display = "block";
            loadProfiles();
        })
        .catch(error => alert("Ошибка: " + error.message));
}

// Добавление анкеты
function addProfile() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const experience = document.getElementById("experience").value;
    const direction = document.getElementById("direction").value;

    db.collection("profiles").add({
        name,
        phone,
        experience,
        direction,
        userId: auth.currentUser.uid
    }).then(() => {
        alert("Анкета добавлена!");
        loadProfiles();
    });
}

// Загрузка всех анкет
function loadProfiles() {
    db.collection("profiles").get()
        .then(querySnapshot => {
            let html = "";
            querySnapshot.forEach(doc => {
                const data = doc.data();
                html += `
                    <div>
                        <h3>${data.name}</h3>
                        <p>Телефон: ${data.phone}</p>
                        <p>Стаж: ${data.experience} лет</p>
                        <p>Направление: ${data.direction}</p>
                    </div>
                `;
            });
            document.getElementById("profiles-list").innerHTML = html;
        });
}
