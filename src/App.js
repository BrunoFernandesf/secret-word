//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//Data
import {wordsList} from './data/words.js';

//Components
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setpickedCategory] = useState("")
  const [letters, setLetter] = useState([])

  const [guessedLetter, setguessedLetter] = useState([])
  const [wrongLetters, setwrongLetter] = useState([])
  const [guesses,setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //Random category
    const categories = Object.keys(words)
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category)
    
    //Random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word, category}
  }, [words]);

  //Inicia o game
  const startGame = useCallback(() => {
    clearLetterStates();

    const {word, category} = pickWordAndCategory();

    //Letter array
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category)
    console.log(wordLetters)

    //fill states
    setPickedWord(word)
    setpickedCategory(category)
    setLetter(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory]);
  
  //Fim de jogo
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //Check if letter has already been utilized
    if(guessedLetter.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter))
    {
      return;
    }
    
    //Push guesssed letters or remove a guess
    if(letters.includes(normalizedLetter)) {
      setguessedLetter((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setwrongLetter((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses -1);
    }

  }

  const clearLetterStates = () => {
    setguessedLetter([])
    setwrongLetter([])
  }

  useEffect(() => {
    if(guesses <= 0) {
      //reset all states
      clearLetterStates()

      setGameStage(stages[2].name);
    }
  }, [guesses])

  //check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    //win condition
    if(guessedLetter.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore += 100) 

      //restart game with new word
      startGame();
    }

  }, [guessedLetter, letters, startGame])

  //Reseta o game
  const restart = () => {
    setScore(0);
    setGuesses(3);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (
        <GameScreen 
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetter={guessedLetter}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <EndScreen restart={restart} score={score}/>}
    </div>
  );
}

export default App;
