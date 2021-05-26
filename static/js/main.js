const URL = 'https://pokeapi.co/api/v2/pokemon'
const extraNames = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon',
    'charizard', 'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
    'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate'
]
let Score = 0

const synth = window.speechSynthesis;

async function getData(URL) {
    let results = await fetch(URL)
    let res = await results.json()
    return res
}

function getRandomPokemon(data) {
    // Find a random data from fetched results
    let randomPokemon = data.results[Math.floor(Math.random() * data.results.length)]
    return randomPokemon.url
}

function renderPokemonImageAndOptions(res) {
    let imgDiv = document.querySelector('.pokemon')
    let answerOptions = document.querySelector('.answers')
    let imgElement = document.createElement('img')
    let imageUrl = res.sprites.front_default
    let originalAnswer = res.name

    //make an array with the original and some random answers

    let answers = [originalAnswer]

    for (let index = 0; index < 6; index++){
       let selected = extraNames[Math.floor(Math.random() * extraNames.length)]
       while(answers.includes(selected)) {
           selected = extraNames[Math.floor(Math.random() * extraNames.length)]
        }
        answers.push(selected)
    }

    // shuffle the answer array

    for (var i = answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }

    imgElement.setAttribute('src', imageUrl)
    imgDiv.append(imgElement)

    //create radio elements

    for(i of answers) {
        let radioButton = document.createElement('input', {target :'radio'})
        let lebel = document.createElement('label')
        lebel.setAttribute('for', i)

        lebel.textContent = i

        radioButton.setAttribute('type', 'radio')
        radioButton.setAttribute('name', 'answers')
        radioButton.setAttribute('id', i)
        radioButton.setAttribute('value', i)

        answerOptions.appendChild(radioButton)
        answerOptions.appendChild(lebel)
        answerOptions.appendChild(document.createElement('br'))
    }

    return originalAnswer
}

function checkForCorrectAnswer(originalAnswer) {

    // check for the original answer and store the score
    let postAnswerButton = document.querySelector('.pos-answer-btn')
    let socreText = document.querySelector('.score')

    if(localStorage.getItem('score')) {
        Score =  localStorage.getItem('score')
        socreText.textContent = 'Score : ' + Score
        localStorage.removeItem('score')
    }else {
        socreText.textContent = "Score : 0"
    }

    postAnswerButton.addEventListener('click', () => {
        if(!document.querySelector('input[name="answers"]:checked')) {
            return
        }
        let userAnswer = document.querySelector('input[name="answers"]:checked').value
        // check for the answer and make decisions based on that
        if(userAnswer == originalAnswer){
             let utterThis = new SpeechSynthesisUtterance("Hifi Bro");
            synth.speak(utterThis)
            Score++;
            localStorage.setItem('score', Score)
        }
        else {
            localStorage.setItem('score', Score)
            let utterThis = new SpeechSynthesisUtterance("Try Again Bro");
            synth.speak(utterThis)
        }
        socreText.textContent = socreText
        window.location.reload()
    })
}

getData(URL)
    .then(showPokemons)
    .then(getRandomPokemon)
    .then(renderPokemonImageAndOptions)
    .then(checkForCorrectAnswer)
