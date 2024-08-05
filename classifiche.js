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

    dailyResultsRef.on('value', (snapshot) => {
        const dailyResults = snapshot.val();
        if (dailyResults) {
            let dailyRankingHTML = '';
            Object.entries(dailyResults).forEach(([nickname, score]) => {
                dailyRankingHTML += `<p>${nickname}: ${score}</p>`;
            });
            document.getElementById('dailyRanking').innerHTML = dailyRankingHTML;
        }
    });

    totalResultsRef.on('value', (snapshot) => {
        const totalResults = snapshot.val();
        if (totalResults) {
            let totalRankingHTML = '';
            Object.entries(totalResults).forEach(([nickname, score]) => {
                totalRankingHTML += `<p>${nickname}: ${score}</p>`;
            });
            document.getElementById('totalRanking').innerHTML = totalRankingHTML;
        }
    });
}

// Funzione per caricare i moduli dei giorni
function loadModules() {
    for (let i = 1; i <= 7; i++) {
        const dayModuleRef = database.ref(`moduliGiorno/giorno${i}`);
        dayModuleRef.on('value', (snapshot) => {
            const dayData = snapshot.val();
            if (dayData) {
                let dayHTML = '';
                Object.entries(dayData).forEach(([nickname, score]) => {
                    dayHTML += `<p>${nickname}: ${score}</p>`;
                });
                document.getElementById(`giorno${i}`).innerHTML = dayHTML;
            }
        });
    }
}

// Funzione per resettare una classifica specifica
function resetDailyRanking() {
    database.ref('dailyResults').remove();
}

function resetTotalRanking() {
    database.ref('totalResults').remove();
}

function resetModule(day) {
    database.ref(`moduliGiorno/${day}`).remove();
}

// Funzione per controllare l'accesso Admin
function checkAdminAccess() {
    const adminPassword = prompt('Inserisci la password Admin:');
    if (adminPassword === 'Admin') {
        document.getElementById('adminButtons').style.display = 'block';
    } else {
        alert('Accesso negato');
    }
}

// Funzione per gestire il trasferimento dei dati alla sezione corretta
function chooseDayModule() {
    const selectedDay = prompt('Inserisci il numero del giorno (1-7) per salvare la classifica:');
    if (selectedDay >= 1 && selectedDay <= 7) {
        const dailyResultsRef = database.ref('dailyResults');
        dailyResultsRef.once('value', (snapshot) => {
            const dailyResults = snapshot.val();
            if (dailyResults) {
                database.ref(`moduliGiorno/giorno${selectedDay}`).set(dailyResults);
                alert('Classifica salvata nel modulo Giorno ' + selectedDay);
            }
        });
    } else {
        alert('Numero del giorno non valido');
    }
}
