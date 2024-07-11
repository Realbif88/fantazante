// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvaKb_04q7AH9p9xAKQft-mb3-IpWTTtM",
    authDomain: "fantazante24.firebaseapp.com",
    databaseURL: "https://fantazante24-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fantazante24",
    storageBucket: "fantazante24.appspot.com",
    messagingSenderId: "855297509496",
    appId: "1:855297509496:web:b92ea9f3035ed7e98d458d"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Funzione per registrare un nuovo utente
function registerUser(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Registrazione completata! Effettua il login.");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error registering user:", error);
            alert("Errore nella registrazione: " + error.message);
        });
}

// Funzione per autenticare un utente
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'classifica.html';
        })
        .catch((error) => {
            console.error("Error logging in user:", error);
            alert("Errore nel login: " + error.message);
        });
}

// Funzione per effettuare il logout
function logoutUser() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Error logging out user:", error);
        alert("Errore nel logout: " + error.message);
    });
}

// Protegge la pagina delle classifiche, consentendo l'accesso solo agli utenti autenticati
auth.onAuthStateChanged((user) => {
    if (!user && window.location.pathname === '/classifica.html') {
        window.location.href = 'index.html';
    }
});

// Funzione per inviare i dati al database
async function submitForm() {
    const nickname = document.getElementById('nickname').value;
    const checkboxes = document.querySelectorAll('input[name="box"]:checked');
    let score = 0;

    checkboxes.forEach((checkbox) => {
        score += parseInt(checkbox.value);
    });

    console.log(`Submitting data - Nickname: ${nickname}, Score: ${score}`);

    try {
        // Aggiorna la classifica giornaliera
        const dailyRef = database.ref('dailyResults/' + nickname);
        const snapshot = await dailyRef.once('value');
        const currentScore = snapshot.val() || 0;
        await dailyRef.set(currentScore + score);

        // Aggiorna la classifica totale
        const totalRef = database.ref('totalResults/' + nickname);
        const totalSnapshot = await totalRef.once('value');
        const totalCurrentScore = totalSnapshot.val() || 0;
        await totalRef.set(totalCurrentScore + score);

        updateResults();
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}

// Funzione per resettare i punteggi giornalieri
function resetDailyScores() {
    database.ref('dailyResults').remove()
        .then(() => {
            updateResults();
            alert("Classifica giornaliera resettata.");
        }).catch(error => {
            console.error("Error resetting daily scores:", error);
        });
}

// Funzione per resettare i punteggi totali
function reset
