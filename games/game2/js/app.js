function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function main() {

  const MULTIPLIER_PRIZE = 2;
  const MAX_PRIZE = 1000000;
  const MIN_PRIZE = 100;

  let questionHTML = document.getElementById('question');
  let skipQuestionHTML = document.getElementById('skipQuestion');
  let cardsHTML = document.getElementById('cards');
  let prizeHTML = document.getElementById('prize');
  let totalPrizeHTML = document.getElementById('totalPrize');
  let currentResultsHTML = document.querySelector('.current-results');

  //fill out the map holds key-value pairs
  let storage = window.localStorage;
  let questionsStorage = JSON.parse(storage.getItem('array'));
  let questionsAll = new Map();
  let index = 0;
  for (let question of questionsStorage) {
    questionsAll[index] = question;
    index++;
  }
  let keyCurrent;
  let prize = MIN_PRIZE;
  let totalPrize = 0;
  let lengthArray;
  let randomKey;
  let randomIndexForKeys;
  let keysAll = [];
  let keysArrayCurrent = [];

  let getRandomNumber = (min, max) => {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  document.getElementById('game').addEventListener('click', (event) => {
    let generateQuestion = (array) => {
      for (const card of cardsHTML.children) {
        card.innerText = '';
      }
      //find new lendth of array with keys
      lengthArray = array.length;
      randomIndexForKeys = getRandomNumber(0, lengthArray - 1);
      randomKey = array[randomIndexForKeys];
     
      //generating cards with answers
      for (let i = 0; i < questionsAll[randomKey].content.length; i++) {
        cardsHTML.children[i].innerText = questionsAll[randomKey].content[i];
        cardsHTML.children[i].setAttribute('id', i);
      }
      //showing question
      questionHTML.innerHTML = questionsAll[randomKey].question;
      currentResultsHTML.style.display = 'block';
      return randomKey;
    }
    
    let userClickID = event.target.id;

    if (userClickID.toString() === 'startNewGame') {
      prize = MIN_PRIZE;
      totalPrize = 0;
      keysAll = Object.keys(questionsAll);
      prizeHTML.innerHTML = prize;
      totalPrizeHTML.innerHTML = totalPrize;
      prizeHTML.style.display = 'inline';
      totalPrizeHTML.style.display = 'inline';
      skipQuestionHTML.style.display = 'block';
      for (const card of cardsHTML.children) {
        card.innerText = '';
      }
     
      questionHTML.style.display = 'block';
      cardsHTML.style.display = 'flex';
      keyCurrent = generateQuestion(keysAll);
     
      for (let i = 0; i < keysAll.length; i++) {
        keysArrayCurrent[i] = keysAll[i]; 
      }

    } else if (userClickID.toString() === 'skipQuestion') {
      keysArrayCurrent.splice(keyCurrent, 1);
      skipQuestionHTML.disabled = true;
      keyCurrent = generateQuestion(keysArrayCurrent);

    } else if (parseInt(userClickID) === questionsAll[keyCurrent].correct) {
      totalPrize += prize;
      if (totalPrize >= MAX_PRIZE) {
        for (const card of cardsHTML.children) {
          card.innerText = '';
        }
        currentResultsHTML.style.display = 'none';
        skipQuestionHTML.style.display = 'none';
        questionHTML.innerHTML = 'Congratulations! You won 10000000'; 
      } else {
        prize *= MULTIPLIER_PRIZE;
        prizeHTML.innerHTML = prize;
        totalPrizeHTML.innerHTML = totalPrize;
        // delete key from array with keys
        keysArrayCurrent.splice(keyCurrent, 1);
        keyCurrent = generateQuestion(keysArrayCurrent);
      }
    } else {
      questionHTML.innerHTML = `Game over. Your prize is: ${totalPrize}`;
      skipQuestionHTML.style.display = 'none';
      currentResultsHTML.style.display = 'none';
      cardsHTML.style.display = 'none';
    }
  });
}

ready(main);