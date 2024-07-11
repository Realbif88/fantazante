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

let resetTarget = '';

// Funzione per recuperare e visualizzare le classifiche
function fetchResults() {
    fetchDailyResults();
    fetchTotalResults();
    fetchDailyModules();
}

// Funzione per recuperare e visualizzare i risultati giornalieri
function fetchDailyResults() {
    const dailyResultsRef = database.ref('dailyResults');

    dailyResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const dailyResultsContainer = document.getElementById('dailyResultsContainer');
        dailyResultsContainer.innerHTML = ''; // Pulisce il contenitore

        if (data !== null) {
            const sortedResults = Object.entries(data).sort((a, b) => b[1] - a[1]);
            sortedResults.forEach(([nickname, score]) => {
                dailyResultsContainer.innerHTML += `
                    <p>${nickname}: ${score} punti</p>
                `;
            });
        } else {
            dailyResultsContainer.innerHTML = `<p>Nessun dato trovato.</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei dati giornalieri:', error);
    });
}

// Funzione per recuperare e visualizzare i risultati generali
function fetchTotalResults() {
    const totalResultsRef = database.ref('totalResults');

    totalResultsRef.once('value', snapshot => {
        const data = snapshot.val();
        const totalResultsContainer = document.getElementById('totalResultsContainer');
        totalResultsContainer.innerHTML = ''; // Pulisce il contenitore

        if (data !== null) {
            const sortedResults = Object.entries(data).sort((a, b) => b[1] - a[1]);
            sortedResults.forEach(([nickname, score]) => {
                totalResultsContainer.innerHTML += `
                    <p>${nickname}: ${score} punti</p>
                `;
            });
        } else {
            totalResultsContainer.innerHTML = `<p>Nessun dato trovato.</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei dati generali:', error);
    });
}

// Funzione per recuperare e visualizzare i moduli giornalieri
function fetchDailyModules() {
    const dailyModulesRef = database.ref('dailyModules');

    dailyModulesRef.once('value', snapshot => {
        const data = snapshot.val();
        const dailyModulesContainer = document.getElementById('dailyModulesAccordion');
        dailyModulesContainer.innerHTML = ''; // Pulisce il contenitore

        if (data !== null) {
            for (let i = 1; i <= 8; i++) {
                const dayData = data[`day${i}`];
                let content = '';
                if (dayData) {
                    const sortedResults = Object.entries(dayData).sort((a, b) => b[1] - a[1]);
                    sortedResults.forEach(([nickname, score]) => {
                        content += `<p>${nickname}: ${score} punti</p>`;
                    });
                } else {
                    content = '<p>Nessun dato trovato.</p>';
                }
                dailyModulesContainer.innerHTML += `
                    <div class="card">
                        <div class="card-header" id="heading${i}">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                    Giorno ${i}
                                </button>
                            </h2>
                        </div>
                        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#dailyModulesAccordion">
                            <div class="card-body">
                                ${content}
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            dailyModulesContainer.innerHTML = `<p>Nessun dato trovato.</p>`;
        }
    }).catch(error => {
        console.error('Errore durante il recupero dei moduli giornalieri:', error);
    });
}

// Funzione per aprire il modal di Zantiamo
function openZantiamoModal() {
    $('#zantiamoModal').modal('show');
}

// Funzione per copiare i risultati giornalieri in uno dei moduli selezionati
function copyDailyResults() {
    const dayIndex = document.getElementById('moduleSelect').value;
    const dailyResultsRef = database.ref('dailyResults');
    const dailyModulesRef = database.ref(`dailyModules/day${dayIndex}`);

    dailyResultsRef.once('value')
        .then(snapshot => {
            const dailyData = snapshot.val();
            if (dailyData) {
                dailyModulesRef.set(dailyData)
                    .then(() => {
                        alert(`Risultati copiati nel modulo Giorno ${dayIndex}`);
                        fetchDailyModules();
                        $('#zantiamoModal').modal('hide');
                    })
                    .catch(error => {
                        console.error('Errore durante la copia dei risultati giornalieri:', error);
                    });
            } else {
                alert('Nessun dato giornaliero da copiare.');
            }
        }).catch(error => {
            console.error('Errore durante il recupero dei dati giornalieri:', error);
        });
}

// Funzione per aprire il modal di inserimento password
function promptPassword(target) {
    resetTarget = target;
    $('#passwordModal').modal('show');
}

// Funzione per verificare la password
function verifyPassword() {
    const password = document.getElementById('adminPassword').value;
    if (password === 'Admin') {
        if (resetTarget === 'daily') {
            resetDailyResults();
        } else if (resetTarget === 'total') {
            resetTotalResults();
        }
        $('#passwordModal').modal('hide');
    } else {
        alert('Password errata!');
    }
}

// Funzione per resettare la classifica giornaliera
function resetDailyResults() {
    const dailyResultsRef = database.ref('dailyResults');
    dailyResultsRef.remove()
        .then(() => {
            alert('Classifica giornaliera resettata!');
            fetchDailyResults();
        })
        .catch(error => {
            console.error('Errore durante il reset della classifica giornaliera:', error);
        });
}

// Funzione per resettare la classifica generale
function resetTotalResults() {
    const totalResultsRef = database.ref('totalResults');
    totalResultsRef.remove()
        .then(() => {
            alert('Classifica generale resettata!');
            fetchTotalResults();
        })
        .catch(error => {
            console.error('Errore durante il reset della classifica generale:', error);
        });
}

// Recupera i risultati quando la pagina viene caricata
window.onload = fetchResults;
