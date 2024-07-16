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

// Funzione per resettare la classifica
function resetRanking(type) {
    const password = prompt("Inserisci la password per resettare la classifica:");
    if (password === "Admin") {
        const ref = database.ref(type === 'daily' ? 'dailyResults' : 'totalResults');
        ref.remove()
            .then(() => {
                alert('Classifica resettata con successo.');
                loadRankings();
            })
            .catch(error => {
                console.error('Errore durante il reset della classifica:', error);
            });
    } else {
        alert("Password errata.");
    }
}

// Funzione per copiare la classifica giornaliera nei moduli dei giorni
function copyDailyToModule() {
    const password = prompt("Inserisci la password per copiare la classifica giornaliera:");
    if (password === "Admin") {
        const module = prompt("Inserisci il numero del modulo (1-8):");
        if (module >= 1 && module <= 8) {
            const dailyResultsRef = database.ref('dailyResults');
            const moduleRef = database.ref(`modules/day${module}`);

            dailyResultsRef.once('value', snapshot => {
                const data = snapshot.val();
                moduleRef.set(data)
                    .then(() => {
                        alert('Classifica copiata con successo.');
                    })
                    .catch(error => {
                        console.error('Errore durante la copia della classifica:', error);
                    });
            });
        } else {
            alert("Numero del modulo non valido.");
        }
    } else {
        alert("Password errata.");
    }
}

// Inizializza le classifiche al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadRankings);
