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

// Definizione dei punteggi associati alle caselle
const scores = {
    "checkbox1": 10,
    "checkbox2": 20,
    "checkbox3": 30,
    "checkbox4": 40,
    "checkbox5": 50,
    "checkbox6": 60,
    "checkbox7": 70,
    "checkbox8": 80,
    "checkbox9": 90,
    "checkbox10": 100,
    "checkbox11": 110,
    "checkbox12": 120,
    "checkbox13": 130,
    "checkbox14": 140,
    "checkbox15": 150,
    "checkbox16": 160,
    "checkbox17": 170,
    "checkbox18": 180,
    "checkbox19": 190,
    "checkbox20": 200
};

// Crea dinamicamente le caselle di controllo
function createCheckboxes() {
    const container = document.getElementById('checkboxContainer');
    for (let i = 1; i <= 20; i++) {
        const checkboxId = `checkbox${i}`;
        const label = `Casella ${i} (Punteggio ${scores[checkboxId]})`;
        container.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${checkboxId}">
                <label class="form-check-label" for="${checkboxId}">
                    ${label}
                </label>
            </div>
        `;
    }
}

// Inizializza le caselle di controllo al caricamento della pagina
document.addEventListener('DOMContentLoaded', createCheckboxes);

// Funzione per inviare i punteggi
function submitScores() {
    const nickname = document.getElementById('nickname').value;
    if (!nickname) {
        alert('Per favore inserisci un nickname.');
        return;
    }

    const selectedScores = Object.keys(scores).filter(id => document.getElementById(id).checked)
                                          .map(id => scores[id]);

    if (selectedScores.length === 0) {
        alert('Per favore seleziona almeno una casella.');
        return;
    }

    const dailyResultsRef = database.ref('dailyResults');
    const totalResultsRef = database.ref('totalResults');
    const userRef = database.ref(`userProfiles/${nickname}`);

    // Calcola il punteggio totale
    const totalScore = selectedScores.reduce((acc, score) => acc + score, 0);

    // Aggiorna i punteggi giornalieri e totali sommando i punteggi esistenti
    dailyResultsRef.child(nickname).transaction(currentScore => (currentScore || 0) + totalScore);
    totalResultsRef.child(nickname).transaction(currentScore => (currentScore || 0) + totalScore);

    // Prepara i dati da salvare
    const data = {};
    Object.keys(scores).forEach(id => {
        if (document.getElementById(id).checked) {
            data[id] = true;
        }
    });

    // Salva i dati del profilo
    userRef.update(data)
        .then(() => {
            alert('Dati inviati con successo!');
        })
        .catch(error => {
            console.error('Errore durante l\'invio dei dati:', error);
        });
}
