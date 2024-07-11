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

// Funzione per recuperare e visualizzare le classifiche
function fetchResults() {
    fetchDailyResults();
    fetchTotalResults();
}

// Funzione per recuperare e visualizzare i risultati giornalieri
function fetchDailyResults() {
    const dailyResultsRef = database.ref('dailyResults');

    dailyResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const dailyResultsContainer = document.getElementById('dailyResultsContainer');
        dailyResultsContainer.innerHTML = ''; // Pulisce il contenitore

        if (data !== null) {
            const sortedResults = Object.entries(data).sort((a, b) => b[1] - a[1]);
            sortedResults.forEach(([nickname, score]) => {
                dailyResultsContainer.innerHTML += `
                    <p>${nickname}: ${score} punti</p>
                `;
            });
        } else {
            dailyResultsContainer.innerHTML = `<p>Nessun dato trovato.</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei dati giornalieri:', error);
    });
}

// Funzione per recuperare e visualizzare i risultati generali
function fetchTotalResults() {
    const totalResultsRef = database.ref('totalResults');

    totalResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const totalResultsContainer = document.getElementById('totalResultsContainer');
        totalResultsContainer.innerHTML = ''; // Pulisce il contenitore

        if (data !== null) {
            const sortedResults = Object.entries(data).sort((a, b) => b[1] - a[1]);
            sortedResults.forEach(([nickname, score]) => {
                totalResultsContainer.innerHTML += `
                    <p>${nickname}: ${score} punti</p>
                `;
            });
        } else {
            totalResultsContainer.innerHTML = `<p>Nessun dato trovato.</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei dati generali:', error);
    });
}

// Recupera i risultati quando la pagina viene caricata
window.onload = fetchResults;
