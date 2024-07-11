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

// Funzione per caricare i nickname
function loadNicknames() {
    database.ref('dailyResults').once('value').then(snapshot => {
        const nicknames = [];
        snapshot.forEach(childSnapshot => {
            const nickname = childSnapshot.key;
            if (!nicknames.includes(nickname)) {
                nicknames.push(nickname);
            }
        });

        const nicknameSelect = document.getElementById('nicknameSelect');
        nicknames.forEach(nickname => {
            const option = document.createElement('option');
            option.value = nickname;
            option.textContent = nickname;
            nicknameSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error loading nicknames:", error);
    });
}

// Funzione per caricare la classifica per un nickname selezionato
function loadNicknameClassifica() {
    const nickname = document.getElementById('nicknameSelect').value;
    const classificaSezioni = document.getElementById('classificaSezioni');
    
    classificaSezioni.innerHTML = '';

    // Aggiungi 8 sezioni per la classifica
    for (let i = 1; i <= 8; i++) {
        const section = document.createElement('div');
        section.classList.add('result-section');
        section.innerHTML = `<h2>Classifica Sezione ${i}</h2>`;
        classificaSezioni.appendChild(section);
    }

    database.ref('dailyResults').once('value').then(snapshot => {
        const results = [];
        snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            if (key === nickname) {
                results.push({ nickname: key, score: childSnapshot.val() });
            }
        });

        results.sort((a, b) => b.score - a.score);

        // Distribuisci i risultati nelle 8 sezioni
        const sections = document.querySelectorAll('#classificaSezioni .result-section');
        results.forEach((result, index) => {
            const sectionIndex = index % 8;
            const section = sections[sectionIndex];
            section.innerHTML += `<p>${result.nickname} - ${result.score} punti</p>`;
        });
    }).catch(error => {
        console.error("Error retrieving daily scores:", error);
    });
}

// Carica i nickname quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadNicknames);
