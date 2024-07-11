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

    // Aggiungi 8 moduli per la classifica
   
