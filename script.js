const pairs = [
    { pinyin: 'nǐ hǎo', character: '你好' },
    { pinyin: 'xiè xiè', character: '谢谢' },
    { pinyin: 'zài jiàn', character: '再见' },
    { pinyin: 'qǐng', character: '请' },
    { pinyin: 'wǒ ài nǐ', character: '我爱你' },
    { pinyin: 'hǎo', character: '好' },
];

let attempts = 0;
let timer;
let time = 0;
let selectedPinyin = null;
let score = 0;
const totalPairs = pairs.length;

document.addEventListener('DOMContentLoaded', () => {
    loadPairs();
    startTimer();

    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('add-words').addEventListener('click', addWords);
});

function loadPairs() {
    const pinyinColumn = document.getElementById('pinyin-column');
    const characterColumn = document.getElementById('character-column');
    pinyinColumn.innerHTML = '';
    characterColumn.innerHTML = '';

    // Shuffle the pairs
    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);
    
    // Generate random rows
    const randomRows = Array.from({ length: totalPairs * 2 }, (_, i) => {
        return (i < totalPairs) 
            ? { type: 'pinyin', value: shuffledPairs[i].pinyin, index: i } 
            : { type: 'character', value: shuffledPairs[i - totalPairs].character, index: i - totalPairs };
    }).sort(() => Math.random() - 0.5);

    randomRows.forEach(item => {
        const div = createDiv(item.value, item.type, item.index);
        if (item.type === 'pinyin') {
            pinyinColumn.appendChild(div);
        } else {
            characterColumn.appendChild(div);
        }
    });
}

function createDiv(text, type, index) {
    const div = document.createElement('div');
    div.textContent = text;
    div.className = `pair ${type}`;
    div.setAttribute('data-index', index);
    div.addEventListener('click', () => handleMatch(div, type));
    return div;
}

function handleMatch(div, type) {
    if (type === 'pinyin') {
        if (selectedPinyin) {
            checkMatch(selectedPinyin, div);
            selectedPinyin = null; // Reset selection
        } else {
            selectedPinyin = div; // Select Pinyin
            div.classList.add('selected');
        }
    } else {
        if (selectedPinyin) {
            checkMatch(selectedPinyin, div);
            selectedPinyin = null; // Reset selection
        } else {
            alert("Please select a Pinyin first!");
        }
    }
}

function checkMatch(pinyinDiv, charDiv) {
    attempts++;
    document.getElementById('attempts').textContent = attempts;

    if (pinyinDiv.getAttribute('data-index') === charDiv.getAttribute('data-index')) {
        pinyinDiv.classList.add('match');
        charDiv.classList.add('match');
        score += 10; // Increment score for correct match
    } else {
        pinyinDiv.classList.add('no-match');
        charDiv.classList.add('no-match');
        setTimeout(() => {
            pinyinDiv.classList.remove('no-match');
            charDiv.classList.remove('no-match');
        }, 1000);
    }

    pinyinDiv.classList.remove('selected');
    document.getElementById('score').textContent = score;

    if (document.querySelectorAll('.match').length === totalPairs * 2) {
        endGame();
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        document.getElementById('time').textContent = time;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById('final-score').style.display = 'block';
    document.getElementById('final-score-value').textContent = calculateFinalScore();
}

function calculateFinalScore() {
    // Example scoring logic: base score + time penalty
    return score - Math.floor(time / 10); // Deduct 1 point for every 10 seconds
}

function resetGame() {
    clearInterval(timer);
    time = 0;
    attempts = 0;
    score = 0;
    document.getElementById('time').textContent = time;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('score').textContent = score;
    loadPairs();
    startTimer();
    document.getElementById('final-score').style.display = 'none'; // Hide final score
}

function addWords() {
    const newPinyin = prompt("Enter new Pinyin:");
    const newChar = prompt("Enter corresponding Chinese character:");
    
    if (newPinyin && newChar) {
        pairs.push({ pinyin: newPinyin, character: newChar });
        localStorage.setItem('pairs', JSON.stringify(pairs));
        loadPairs();
    }
}
