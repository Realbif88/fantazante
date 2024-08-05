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

// Carica le classifiche al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadRankings();
    loadModules();
    checkAdminAccess();
});

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

// Funzione per caricare i moduli dei giorni
function loadModules() {
    for (let i = 1; i <= 8; i++) {
        const moduleRef = database.ref(`modules/giorno${i}`);
        moduleRef.once('value', snapshot => {
            const data = snapshot.val();
            displayRanking(`giorno${i}`, data);
        });
    }
}

// Funzione per visualizzare le classifiche
function displayRanking(elementId, data) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (data) {
        const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
        sortedData.forEach(([nickname, score], index) => {
            container.innerHTML += `<p>${index + 1}. ${nickname}: ${score}</p>`;
        });
    } else {
        container.innerHTML = '<p>Nessun dato disponibile</p>';
    }
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

// Funzione per resettare un modulo specifico
function resetModule(moduleId) {
    if (confirm(`Sei sicuro di voler resettare il ${moduleId.replace('giorno', 'Giorno ')}?`)) {
        database.ref(`modules/${moduleId}`).remove();
        alert(`${moduleId.replace('giorno', 'Giorno ')} resettato.`);
        loadModules(); // Ricarica i moduli dopo il reset
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

// Funzione per controllare l'accesso dell'admin
function checkAdminAccess() {
    const password = prompt('Inserisci la password Admin:');
    if (password === 'Admin') {
        document.getElementById('adminButtons').style.display = 'block';
    } else {
        alert('Accesso negato');
    }
}
