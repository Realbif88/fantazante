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

// Funzione per inviare i dati al database
function sendResults() {
    const nickname = document.getElementById('nickname').value;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const dailyResultsRef = database.ref('dailyResults/' + nickname);
    const totalResultsRef = database.ref('totalResults/' + nickname);

    let totalScore = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalScore += parseInt(checkbox.value);
        }
    });

    // Salva il punteggio totale per il nickname nella classifica giornaliera
    dailyResultsRef.set(totalScore)
        .then(() => {
            alert('Dati giornalieri inviati con successo!');
        })
        .catch(error => {
            console.error('Errore durante l\'invio dei dati giornalieri:', error);
        });

    // Aggiorna il punteggio totale per il nickname nella classifica generale
    totalResultsRef.transaction(currentTotal => {
        return (currentTotal || 0) + totalScore;
    })
    .then(() => {
        console.log('Classifica generale aggiornata con successo!');
    })
    .catch(error => {
        console.error('Errore durante l\'aggiornamento della classifica generale:', error);
    });
}
