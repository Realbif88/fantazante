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
async function submitForm() {
    const nickname = document.getElementById('nickname').value;
    const checkboxes = document.querySelectorAll('input[name="box"]:checked');
    let score = 0;

    checkboxes.forEach((checkbox) => {
        score += parseInt(checkbox.value);
    });

    console.log(`Submitting data - Nickname: ${nickname}, Score: ${score}`);

    try {
        // Aggiorna la classifica giornaliera
        const dailyRef = database.ref('dailyResults/' + nickname);
        const snapshot = await dailyRef.once('value');
        const currentScore = snapshot.val() || 0;
        await dailyRef.set(currentScore + score);

        // Aggiorna la classifica totale
        const totalRef = database.ref('totalResults/' + nickname);
        const totalSnapshot = await totalRef.once('value');
        const totalCurrentScore = totalSnapshot.val() || 0;
        await totalRef.set(totalCurrentScore + score);

        updateResults();
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}

// Funzione per resettare i punteggi giornalieri
function resetDailyScores() {
    const password = prompt("Inserisci la password per resettare la classifica giornaliera:");
    if (password === "Zante") {
        database.ref('dailyResults').remove()
            .then(() => {
                updateResults();
                alert("Classifica giornaliera resettata.");
            }).catch(error => {
                console.error("Error resetting daily scores:", error);
            });
    } else {
        alert("Password errata.");
    }
}

// Funzione per resettare i punteggi totali
function resetTotalScores() {
    const password = prompt("Inserisci la password per resettare la classifica totale:");
    if (password === "fantazanteok") {
        database.ref('totalResults').remove()
            .then(() => {
                updateResults();
                alert("Classifica totale resettata con successo.");
            }).catch(error => {
                console.error("Error resetting total scores:", error);
            });
    } else {
        alert("Password errata.");
    }
}

// Funzione per aggiornare i risultati
function updateResults() {
    // Recupera i risultati giornalieri
    database.ref('dailyResults').once('value').then(snapshot => {
        const dailyResults = [];
        snapshot.forEach(childSnapshot => {
            dailyResults.push({ nickname: childSnapshot.key, score: childSnapshot.val() });
        });

        const dailyResultDiv = document.getElementById('dailyResult');
        dailyResultDiv.innerHTML = '<h2>Classifica Giornaliera</h2>';
        dailyResults.sort((a, b) => b.score - a.score);
        dailyResults.forEach((result, index) => {
            dailyResultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
        });
    }).catch(error => {
        console.error("Error retrieving daily scores:", error);
    });

    // Recupera i risultati totali
    database.ref('totalResults').once('value').then(snapshot => {
        const sortedTotalResults = [];
        snapshot.forEach(childSnapshot => {
            sortedTotalResults.push({ nickname: childSnapshot.key, score: childSnapshot.val() });
        });

        sortedTotalResults.sort((a, b) => b.score - a.score);

        const totalResultDiv = document.getElementById('totalResult');
        totalResultDiv.innerHTML = '<h2>Classifica Totale</h2>';
        sortedTotalResults.forEach((result, index) => {
            totalResultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
        });
    }).catch(error => {
        console.error("Error retrieving total scores:", error);
    });
}

// Aggiorna le classifiche al caricamento della pagina
document.addEventListener('DOMContentLoaded', updateResults);
