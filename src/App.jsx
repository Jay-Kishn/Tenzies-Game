import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [dieRolls,setDieRolls] = React.useState(0)
    const [time, setTime] = React.useState(0);
    const [highScore,setHighScore] = React.useState({min_time:9999999,min_rolls:9999})

    React.useEffect(()=>{
        let interval;
        if(!tenzies){
        interval = setInterval(function(){
            setTime((prevTime)=>prevTime+10);
        },100);
        }else{
            clearInterval(interval);
        }

        return ()=> clearInterval(interval);
       
    },[tenzies])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    
    function rollDice() {
        if(!tenzies) {
            setDieRolls(rolls=>(rolls+1))
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDieRolls(0)
            setTime(0)
            if(dieRolls < highScore.min_rolls)setHighScore((score)=>({...score,min_rolls:dieRolls}))
            if(time < highScore.min_time)setHighScore((score)=>({...score,min_time:time}))
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <p>Number of Rolls: {dieRolls} High Score : {highScore.min_rolls}</p>
            <div>
                <span>Timer:</span>
                <span>{(Math.floor(time/6000))%60}min </span>
                <span>{(Math.floor(time/100))%60}sec </span>
                <span>High Score:</span>
                <span>{(Math.floor(highScore.min_time/6000))%60}min </span>
                <span>{(Math.floor(highScore.min_time/100))%60}sec </span>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}