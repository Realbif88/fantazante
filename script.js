const results = [];

function submitForm() {
    const nickname = document.getElementById('nickname').value;
    const checkboxes = document.querySelectorAll('input[name="box"]:checked');
    let score = 0;

    checkboxes.forEach((checkbox) => {
        score += parseInt(checkbox.value);
    });

    results.push({ nickname, score });
    updateResults();
}

function updateResults() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Classifica</h2>';

    results.sort((a, b) => b.score - a.score);
    results.forEach((result, index) => {
        resultDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.score} punti</p>`;
    });
}
