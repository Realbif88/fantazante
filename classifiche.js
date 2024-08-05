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

// Inizializza le classifiche al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadRankings);
