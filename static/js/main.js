const URL = "https://pokeapi.co/api/v2/pokemon";
const extraNames = [
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",
  "caterpie",
  "metapod",
  "butterfree",
  "weedle",
  "kakuna",
  "beedrill",
  "pidgey",
  "pidgeotto",
  "pidgeot",
  "rattata",
  "raticate",
];
let Score = 0;
const loader = document.querySelector(".loader-container");

const synth = window.speechSynthesis;

async function getPokemons(URL) {
  let results = await fetch(URL);
  let res = await results.json();
  return res;
}

function getRandomPokemonUrl(data) {
  let randomPokemon =
    data.results[Math.floor(Math.random() * data.results.length)];
  return randomPokemon.url;
}

function renderPokemonImageAndOptions(res) {
  let imgDiv = document.querySelector(".pokemon");
  let answerOptions = document.querySelector(".answers");
  let imgElement = document.createElement("img");
  let imageUrl = res.sprites.front_default;
  let originalAnswer = res.name;

  let answers = [originalAnswer];

  for (let index = 0; index < 3; index++) {
    let selected = extraNames[Math.floor(Math.random() * extraNames.length)];
    while (answers.includes(selected)) {
      selected = extraNames[Math.floor(Math.random() * extraNames.length)];
    }
    answers.push(selected);
  }

  for (var i = answers.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = answers[i];
    answers[i] = answers[j];
    answers[j] = temp;
  }

  imgElement.setAttribute("src", imageUrl);
  imgDiv.append(imgElement);

  for (i of answers) {
    let answer_wrapper = document.createElement("div");
    answer_wrapper.classList.add("answer-wrapper");
    let lebel = document.createElement("label");
    lebel.setAttribute("for", i);

    lebel.textContent = i;

    answer_wrapper.append(lebel);
    answer_wrapper.setAttribute("data-answer", i);
    answerOptions.append(answer_wrapper);

    answer_wrapper.addEventListener("click", () => {
      const allansWrappers = document.querySelectorAll(".answer-wrapper");
      allansWrappers.forEach((ans) => {
        ans.classList.remove("selected");
      });
      answer_wrapper.classList.toggle("selected");
      window.answer = answer_wrapper.getAttribute("data-answer");
    });
  }

  loader.style.display = "none";

  return originalAnswer;
}

function checkForCorrectAnswer(originalAnswer) {
  // check for the original answer and store the score
  let postAnswerButton = document.querySelector(".pos-answer-btn");
  let socreText = document.querySelector(".score");

  if (localStorage.getItem("score")) {
    Score = localStorage.getItem("score");
    socreText.textContent = Score;
    localStorage.removeItem("score");
  } else {
    socreText.textContent = "0";
  }

  postAnswerButton.addEventListener("click", () => {
    // check for the answer and make decisions based on that
    if (!window.answer) return;

    if (window.answer == originalAnswer) {
      let utterThis = new SpeechSynthesisUtterance("Right Answer");
      synth.speak(utterThis);
      Score++;
      localStorage.setItem("score", Score);
    } else {
      localStorage.setItem("score", Score);
      let utterThis = new SpeechSynthesisUtterance("Try Again");
      synth.speak(utterThis);
    }
    socreText.textContent = Score;
    console.log(Score);
    window.location.reload();
  });
}

getPokemons(URL)
  .then(getRandomPokemonUrl)
  .then(getPokemons)
  .then(renderPokemonImageAndOptions)
  .then(checkForCorrectAnswer);
