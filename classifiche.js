// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvaKb_04q7AH9p9xAKQft-mb3-IpWTTtM",
    authDomain: "fantazante24.firebaseapp.com",
    databaseURL: "https://fantazante-36bd2-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "fantazante24",
    storageBucket: "fantazante24.appspot.com",
    messagingSenderId: "855297509496",
    appId: "1:855297509496:web:b92ea9f3035ed7e98d458d"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    loadRankings();
    loadModules();
});

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
function showAdminAccess() {
    document.getElementById('adminAccessForm').style.display = 'block';
}

function validateAdminAccess() {
    const adminPassword = document.getElementById('adminPassword').value;
    if (adminPassword === 'Adminsasi') {
        document.getElementById('adminButtons').style.display = 'block';
        document.getElementById('adminAccessForm').style.display = 'none';
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
