const dailyResults = [];
const totalResults = {};

function submitForm() {
    const nickname = document.getElementById('nickname').value;
    const checkboxes = document.querySelectorAll('input[name="box"]:checked');
    let score = 0;

    checkboxes.forEach((checkbox) => {
        score += parseInt(checkbox.value);
    });

    // Aggiorna la classifica giornaliera
    dailyResults.push({ nickname, score });
    
    // Aggiorna la classifica totale
    if (totalResults[nickname]) {
        totalResults[nickname] += score;
    } else {
        totalResults[nickname] = score;
    }

    updateResults();
}

function resetDailyScores() {
    dailyResults.length = 0; // Resetta l'array dei risultati giornalieri
    updateResults(); // Aggiorna la visualizzazione
}

function updateResults() {
    // Aggiorna la visualizzazione della classifica giornaliera
    const dailyResultDiv = document.getElementById('dailyResult');
    dailyResultDiv.innerHTML = '<h2>Classifica Giornaliera</h2>';

    dailyResults.sort((a, b) => b.score - a.score);
    dailyResults.forEach((result, index) => {
        dailyResultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
    });

    // Aggiorna la visualizzazione della classifica totale
    const totalResultDiv = document.getElementById('totalResult');
    totalResultDiv.innerHTML = '<h2>Classifica Totale</h2>';

    const sortedTotalResults = Object.keys(totalResults)
        .map(nickname => ({ nickname, score: totalResults[nickname] }))
        .sort((a, b) => b.score - a.score);

    sortedTotalResults.forEach((result, index) => {
        totalResultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
    });
}
