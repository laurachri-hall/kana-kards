
// Selecting Elements
const cards = document.querySelectorAll(".card");
const cardSounds = [
  'a.mp3', 'i.mp3', 'u.mp3', 'e.mp3',
  'o.mp3', 'ka.mp3', 'ki.mp3', 'ku.mp3'
];

// Create an object to store Audio objects
const audioObjects = {};

// Required Variables
let matched = 0;
let card1, card2;
let disableDeck = false;
let moveCount = 0;
let startTime,timerInterval;
let timerStarted = false;

// Preload audio files
cardSounds.forEach((sound, index) => {
  audioObjects[index + 1] = new Audio(`assets/sounds/${sound}`);
});

// Start Timer
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(()=>{
    const elapsedTime =new Date() - startTime;
    const minutes = Math.floor(elapsedTime/60000);
    const seconds = Math.floor((elapsedTime%60000)/1000);
    document.getElementById("timer").textContent = `Time: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  },1000);
}

// Move Counter
function updateMoveCounter() {
  moveCount++;
  document.getElementById("moveCounter").textContent = `Moves: ${moveCount}`;
}

// Flip Card function
function flipCard({ target: clickedCard }) {
  if (card1 !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");

    // Add sounds to cards
    const cardNumber = clickedCard.querySelector(".back-view img").src.split('/').pop().split('.')[0];
        audioObjects[cardNumber].play();

    if (!card1) {
      return (card1 = clickedCard);
    }
    if(!timerStarted) {
      startTimer();
      timerStarted = true;
    }
    card2 = clickedCard;
    disableDeck = true;

    let card1Img = card1.querySelector(".back-view img").src;
    let card2Img = card2.querySelector(".back-view img").src;
    matchCards(card1Img, card2Img);
  }
}

// Match Card Function
function matchCards(img1, img2) {
  if (img1 === img2) {
    matched++;
    if (matched == 8) {
      setTimeout(() => {
        return shuffleCard();
      }, 1000);
    }

    card1.removeEventListener("click", flipCard);
    card2.removeEventListener("click", flipCard);
    card1 = card2 = "";
    return (disableDeck = false);
  }

  setTimeout(() => {
    card1.classList.add("shake");
    card2.classList.add("shake");
  }, 400);

  setTimeout(() => {
    card1.classList.remove("shake", "flip");
    card2.classList.remove("shake", "flip");
    card1 = card2 = "";
    disableDeck = false;
  }, 1200);

  updateMoveCounter();

}

// Shuffle Card Function
function shuffleCard() {
  matched = 0;
  disableDeck = false;
  card1 = card2 = "";

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, i) => {
    card.classList.remove("flip");

    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `assets/images/${arr[i]}.webp`;
    card.addEventListener("click", flipCard);
  });
}
shuffleCard();

// Flipcard Event on all cards
cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
