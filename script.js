// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA5CWWuc4bZ3phF5kc_Ewa7f1ccA8oqFW4",
    authDomain: "fantazante-c754f.firebaseapp.com",
    projectId: "fantazante-c754f",
    storageBucket: "fantazante-c754f.appspot.com",
    messagingSenderId: "340578088140",
    appId: "1:340578088140:web:bfdf9e2b2b3daf875cfe69",
    measurementId: "G-H34G804QBT"
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

    // Aggiorna la classifica giornaliera
    const dailyRef = database.ref('dailyResults');
    await dailyRef.push({ nickname, score });

    // Aggiorna la classifica totale
    const totalRef = database.ref('totalResults/' + nickname);
    totalRef.once('value').then(snapshot => {
        const currentScore = snapshot.val() || 0;
        totalRef.set(currentScore + score);
    }).then(() => {
        updateResults();
    }).catch(error => {
        console.error("Error updating total scores:", error);
    });
}

// Funzione per resettare i punteggi giornalieri
function resetDailyScores() {
    database.ref('dailyResults').remove()
        .then(() => {
            updateResults();
            alert("Classifica giornaliera resettata.");
        }).catch(error => {
            console.error("Error resetting daily scores:", error);
        });
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
    const dailyRef = database.ref('dailyResults');
    dailyRef.once('value').then(snapshot => {
        const data = snapshot.val() || {};
        const dailyResults = Object.values(data);
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
    const totalRef = database.ref('totalResults');
    totalRef.once('value').then(snapshot => {
        const data = snapshot.val() || {};
        const sortedTotalResults = Object.keys(data)
            .map(nickname => ({ nickname, score: data[nickname] }))
            .sort((a, b) => b.score - a.score);

        const totalResultDiv = document.getElementById('totalResult');
        totalResultDiv.innerHTML = '<h2>Classifica Totale</h2>';
        sortedTotalResults.forEach((result, index) => {
            totalResultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
        });
    }).catch(error => {
        console.error
