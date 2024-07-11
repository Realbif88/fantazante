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

// Funzione per recuperare e visualizzare i dati del profilo
function fetchProfileData() {
    const nickname = document.getElementById('profileNickname').value;
    if (!nickname) {
        alert('Inserisci un nickname per visualizzare il profilo.');
        return;
    }

    const userRef = database.ref(`userProfiles/${nickname}`);
    
    userRef.once('value')
        .then(snapshot => {
            const data = snapshot.val();
            const profileResultsContainer = document.getElementById('profileResultsContainer');
            profileResultsContainer.innerHTML = ''; // Pulisce il contenitore

            if (data) {
                Object.entries(data).forEach(([day, score]) => {
                    profileResultsContainer.innerHTML += `
                        <p>${day}: ${score} punti</p>
                    `;
                });
            } else {
                profileResultsContainer.innerHTML = `<p>Nessun dato trovato per il nickname '${nickname}'.</p>`;
            }
        })
        .catch(error => {
            console.error('Errore durante il recupero dei dati del profilo:', error);
        });
}
