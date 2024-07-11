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

// Funzione per recuperare e visualizzare i risultati
function fetchResults() {
    const nickname = document.getElementById('nicknameInput').value;

    fetchDailyResults(nickname);
    fetchTotalResults(nickname);
}

// Funzione per recuperare e visualizzare i risultati giornalieri
function fetchDailyResults(nickname) {
    const dailyResultsRef = database.ref('dailyResults/' + nickname);

    dailyResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const dailyResultsContainer = document.getElementById('dailyResultsContainer');

        if (data !== null) {
            dailyResultsContainer.innerHTML = `
                <h3>Classifica Giornaliera per ${nickname}</h3>
                <p>Punteggio Totale: ${data}</p>
            `;
        } else {
            dailyResultsContainer.innerHTML = `<p>Nessun dato trovato per il nickname "${nickname}".</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei dati giornalieri:', error);
    });
}

// Funzione per recuperare e visualizzare i risultati generali
function fetchTotalResults(nickname) {
    const totalResultsRef = database.ref('totalResults/' + nickname);

    totalResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const totalResultsContainer = document.getElementById('totalResultsContainer');

        if (data !
