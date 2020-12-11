const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-msg");
const figureParts = document.querySelectorAll(".figure-part");

function randomNumGen(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const correctedLetters = [];
const wrongLetters = [];

async function f() {
  let url = "https://random-word-api.herokuapp.com/all/?swear=0";

  let data = await (await fetch(url)).json();
  let selectedWord = data[randomNumGen(178188)];

  function displayWord() {
    wordEl.innerHTML = `
   ${selectedWord
     .split("")
     .map(
       (letter) => `
  <span class="letter">
  ${correctedLetters.includes(letter) ? letter : ""}
  </span>
  `
     )
     .join("")}
   `;
  }
  displayWord();

  // update he wrong letters
  function updateWrongLettersEl() {
    // display wrong letters
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;
    // display parts
    figureParts.forEach((part, index) => {
      const err = wrongLetters.length;

      if (index < err) {
        part.style.display = "block";
      } else {
        part.style.display = "none";
      }
    });

    // check if lost
    if (wrongLetters.length === figureParts.length) {
      finalMessage.innerText =
        "Unfortunately you lost. 😌 \n Find the meaning of this word.";
      popup.style.display = "flex";
      wordEl.innerHTML = `
            ${selectedWord
              .split("")
              .map(
                (letter) => `
                <span class="letter">
                ${letter}
                </span>
                `
              )
              .join("")}
          `;
    }
  }

  // show notification
  function showNotification() {
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  // Keydown letter press
  window.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      if (selectedWord.includes(letter)) {
        if (!correctedLetters.includes(letter)) {
          correctedLetters.push(letter);

          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);

          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  });

  const innerWord = wordEl.innerText.replace(/\n/g, "");
  console.log(wordEl.innerText, innerWord);

  if (innerWord === selectedWord) {
    finalMessage.innerText =
      "Congratulations! You Won! 😃 \n Now find the meaning \n in your dictionary";
    popup.style.display = "flex";
  }

  // restart game and play again
  playAgainBtn.addEventListener("click", () => {
    //empty arrays
    correctedLetters.splice(0);
    wrongLetters.splice(0);

    displayWord();

    updateWrongLettersEl();

    popup.style.display = "none";
  });
}

f();
