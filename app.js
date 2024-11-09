// scripts.js
const firebaseConfig = {
    apiKey: "AIzaSyCDLunNOxuRoJQzGmP2Wid2mHQYz4sG5XI",
    authDomain: "my-first-project-7ad41.firebaseapp.com",
    projectId: "my-first-project-7ad41",
    storageBucket: "my-first-project-7ad41.firebasestorage.app",
    messagingSenderId: "976716784305",
    appId: "1:976716784305:web:83d5543dc0dc68d4443890"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const sendBtn = document.getElementById('send-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

auth.onAuthStateChanged(user => {
    if (user) {
        loginScreen.style.display = 'none';
        chatScreen.style.display = 'block';
        loadMessages();
    } else {
        loginScreen.style.display = 'block';
        chatScreen.style.display = 'none';
    }
});

loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error.message));
});

signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .catch(error => alert(error.message));
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message !== '') {
        db.collection('messages').add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: auth.currentUser.uid
        });
        messageInput.value = '';
    }
});

function loadMessages() {
    db.collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            messagesDiv.innerHTML = '';
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageDiv = document.createElement('div');
                messageDiv.textContent = message.text;
                messagesDiv.appendChild(messageDiv);
            });
        });
}

