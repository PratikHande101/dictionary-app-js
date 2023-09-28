const searchBtn = document.getElementById('search-btn');
const apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById('result');
const sound = document.getElementById('sound');

result.style.display = 'none';

function playSound() {
    sound.play();
}

async function searchWord(inputWord) {
    const response = await fetch(`${apiURL}${inputWord}`);
    const data = await response.json();
    
    if(response.status == 404) {
        result.innerHTML = '';
        result.style.display = 'flex';
        result.innerHTML = `
                <div id="wrong-input">
                    <p>No Definitions Found :(</p>
                </div>
            `;
        return;
    }

    let pos = data[0].meanings[0].partOfSpeech;
    let phonetic;

    if (data[0].phonetic == undefined) {
        phonetic = data[0].phonetics[1].text;
        console.log(phonetic);
    } else {
        phonetic = data[0].phonetic;
    }

    if (data[0].phonetics[0].audio != "") {
        console.log(`https:${data[0].phonetics[0].audio}`);
        sound.setAttribute("src",`${data[0].phonetics[0].audio}`);
    }

    result.style.display = 'flex';

    if (data[0].phonetics[0].audio == "" && data[0].meanings[0].definitions[0].example == undefined) {
        result.innerHTML = `
            <div class="word">
                <h3>${inputWord}</h3>
            </div>
            <div class="details">
                <p>${pos}</p>
                <p>/${phonetic}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
        `;
    } else if (data[0].phonetics[0].audio == "") {
        result.innerHTML = `
            <div class="word">
                <h3>${inputWord}</h3>
            </div>
            <div class="details">
                <p>${pos}</p>
                <p>/${phonetic}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
            <div class="word-example">
                <div class="line"></div>
                ${data[0].meanings[0].definitions[0].example || ""}
            </div>
        `;
    } else if (data[0].meanings[0].definitions[0].example != undefined) {
        result.innerHTML = `
            <div class="word">
                <h3>${inputWord}</h3>
                <button onClick="playSound()"><i class="fa-solid fa-volume-high"></i></button>
            </div>
            <div class="details">
                <p>${pos}</p>
                <p>/${phonetic}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
            <div class="word-example">
                <div class="line"></div>
                ${data[0].meanings[0].definitions[0].example}
            </div>
        `;  
    } else {
        result.innerHTML = `
            <div class="word">
                <h3>${inputWord}</h3>
                <button onClick="playSound()"><i class="fa-solid fa-volume-high"></i></button>
            </div>
            <div class="details">
                <p>${pos}</p>
                <p>/${phonetic}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
        `;
    }
}

searchBtn.addEventListener('click', () => {
    const inputWord  = document.getElementById('input-word').value;
    if(inputWord) {
        result.style.display = 'none';
        searchWord(inputWord);
    }
});

document.getElementById('input-word').addEventListener('keydown', ev => {
    if(ev.key == 'Enter') {
        const inputWord  = document.getElementById('input-word').value;
        if(inputWord) {
            result.style.display = 'none';
            searchWord(inputWord);
        }
    }
});