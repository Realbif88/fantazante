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

// Funzione per inviare i punteggi
function submitScores() {
    const nickname = document.getElementById('nickname').value;
    const scores = document.getElementById('scores').value.split(',').map(Number);

    if (nickname && scores.length > 0) {
        const dailyResultsRef = database.ref('dailyResults');
        const totalResultsRef = database.ref('totalResults');
        const userRef = database.ref(`userProfiles/${nickname}`);
        
        let totalScore = 0;
        const updates = {};

        scores.forEach((score, index) => {
            const dayKey = `day${index + 1}`;
            totalScore += score;
            updates[dayKey] = score;
        });

        // Aggiorna i punteggi giornalieri
        dailyResultsRef.child(nickname).set(totalScore);
        // Aggiorna i punteggi totali
        totalResultsRef.child(nickname).set(totalScore);
        // Aggiorna il profilo utente
        userRef.set(updates)
            .then(() => {
                alert('Dati inviati con successo!');
            })
            .catch(error => {
                console.error('Errore durante l\'invio dei dati:', error);
            });
    } else {
        alert('Per favore inserisci un nickname e i punteggi.');
    }
}
