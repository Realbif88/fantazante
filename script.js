const firebaseConfig = {
  apiKey: "AIzaSyB5S_sQKbmFUOHZlHbk9SrIhvuCRnuDEAc",
  authDomain: "fantazante-36bd2.firebaseapp.com",
  projectId: "fantazante-36bd2",
  storageBucket: "fantazante-36bd2.appspot.com",
  messagingSenderId: "192840108739",
  appId: "1:192840108739:web:08fead29a92b172cb93076"
};
};

// Inizializza Firebase e Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
        const dailyRef = db.collection('dailyResults');
        await dailyRef.add({ nickname, score });

        // Aggiorna la classifica totale
        const totalRef = db.collection('totalResults').doc(nickname);
        const doc = await totalRef.get();
        const currentScore = doc.exists ? doc.data().score : 0;
        await totalRef.set({ score: currentScore + score });

        updateResults();
    } catch (error) {
        console.error("Error submitting data:", error);
    }
}

// Funzione per resettare i punteggi giornalieri
function resetDailyScores() {
    db.collection('dailyResults').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            doc.ref.delete();
        });
    }).then(() => {
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
        db.collection('totalResults').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            });
        }).then(() => {
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
    db.collection('dailyResults').get().then(querySnapshot => {
        const dailyResults = [];
        querySnapshot.forEach(doc => {
            dailyResults.push(doc.data());
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
    db.collection('totalResults').get().then(querySnapshot => {
        const sortedTotalResults = [];
        querySnapshot.forEach(doc => {
            sortedTotalResults.push({ nickname: doc.id, score: doc.data().score });
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
