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

// Funzione per ottenere i dati del profilo
function fetchProfileData() {
    const nickname = document.getElementById('profileNickname').value;
    if (!nickname) {
        alert('Per favore inserisci un nickname.');
        return;
    }

    const userRef = database.ref(`userProfiles/${nickname}`);

    userRef.once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (data) {
                displayProfileData(data);
            } else {
                alert('Nessun dato trovato per questo nickname.');
            }
        })
        .catch(error => {
            console.error('Errore durante il recupero dei dati:', error);
        });
}

// Funzione per visualizzare i dati del profilo
function displayProfileData(data) {
    const container = document.getElementById('profileResultsContainer');
    container.innerHTML = '';

    // Definisci i nomi delle caselle per visualizzare i dati
    const checkboxes = [
        'Casella 1', 'Casella 2', 'Casella 3', 'Casella 4', 'Casella 5',
        'Casella 6', 'Casella 7', 'Casella 8', 'Casella 9', 'Casella 10',
        'Casella 11', 'Casella 12', 'Casella 13', 'Casella 14', 'Casella 15',
        'Casella 16', 'Casella 17', 'Casella 18', 'Casella 19', 'Casella 20'
    ];

    checkboxes.forEach((label, index) => {
        const checkboxId = `checkbox${index + 1}`;
        if (data[checkboxId]) {
            container.innerHTML += `<p>${label} - Spuntata</p>`;
        }
    });
}
