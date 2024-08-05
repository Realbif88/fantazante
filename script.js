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

// Funzione per inviare il punteggio
function submitScore() {
    const nickname = document.getElementById('nickname').value;
    if (!nickname) {
        alert('Inserisci il tuo nickname!');
        return;
    }

    let score = 0;
    for (let i = 1; i <= 20; i++) {
        const checkbox = document.getElementById('casella' + i);
        if (checkbox && checkbox.checked) {
            score += 10; // Aggiungi il punteggio della casella selezionata
        }
    }

    // Aggiorna la classifica giornaliera
    const dailyRef = database.ref('dailyResults/' + nickname);
    dailyRef.once('value').then(snapshot => {
        const existingScore = snapshot.val() || 0;
        dailyRef.set(existingScore + score);
    });

    // Aggiorna la classifica generale
    const totalRef = database.ref('totalResults/' + nickname);
    totalRef.once('value').then(snapshot => {
        const existingScore = snapshot.val() || 0;
        totalRef.set(existingScore + score);
    });

    alert('Dati inviati con successo!');
}

// Funzione per caricare le classifiche
function loadRankings() {
    const dailyResultsRef = database.ref('dailyResults');
    const totalResultsRef = database.ref('totalResults');

    dailyResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        displayRanking('dailyRanking', data);
    });

    totalResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        displayRanking('totalRanking', data);
    });
}

// Funzione per visualizzare le classifiche
function displayRanking(elementId, data) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    const sortedData = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
    sortedData.forEach(([nickname, score], index) => {
        container.innerHTML += `<p>${index + 1}. ${nickname}: ${score}</p>`;
    });
}

// Funzione per resettare la classifica giornaliera
function resetDailyRanking() {
    if (confirm('Sei sicuro di voler resettare la classifica giornaliera?')) {
        database.ref('dailyResults').remove();
        alert('Classifica giornaliera resettata.');
        loadRankings(); // Ricarica le classifiche dopo il reset
    }
}

// Funzione per resettare la classifica generale
function resetTotalRanking() {
    if (confirm('Sei sicuro di voler resettare la classifica generale?')) {
        database.ref('totalResults').remove();
        alert('Classifica generale resettata.');
        loadRankings(); // Ricarica le classifiche dopo il reset
    }
}

// Funzione per gestire il pulsante Zantiamo
function chooseDayModule() {
    const day = prompt("Inserisci il numero del giorno (1-8):");
    if (day >= 1 && day <= 8) {
        copyDailyRankingToModule(day);
    } else {
        alert('Numero del giorno non valido');
    }
}

// Funzione per copiare la classifica giornaliera in un modulo specifico
function copyDailyRankingToModule(day) {
    database.ref('dailyResults').once('value', snapshot => {
        const data = snapshot.val();
        database.ref(`modules/giorno${day}`).set(data);
        alert(`Classifica giornaliera copiata nel Giorno ${day}`);
    });
}

// Inizializza le classifiche al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadRankings);
