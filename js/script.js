import {executeOperation} from "./calcFlow.js";
import {calculatorInput} from "./calcFlow.js";

// sound options
let soundOn = false;

// display options
let userInput;

// face configs
let facePath;
let sadToggle = 1;

// randomizer
let random;
let previousRandom;

function buttonListenner(){

    document.querySelectorAll(".grid-container button").forEach( button => {
        button.addEventListener('click', addOperation);
    });    

    document.querySelector("#sound").removeEventListener('click', addOperation); //remove operation from sound button
    document.querySelector("#sound").addEventListener('click', soundOnOff); 

}

let addOperation = function (event) { userInput = new calculatorInput(event.target.textContent,event.target.className,event.target.id);
                                  faceRamdomnizer(true); executeOperation(userInput); }

function soundOnOff(){

    soundOn = !soundOn;

    if (soundOn) { 

        document.querySelector("#sound img").src = "./image/sound-on.png";
            
        document.querySelectorAll(".grid-container button").forEach( button => {
            button.addEventListener('click', beepOnClick);
        });
         
    } else { 

        document.querySelector("#sound img").src = "./image/sound-off.png";
            
        document.querySelectorAll(".grid-container button").forEach( button => {
            button.removeEventListener('click', beepOnClick);
        });

    };  

}

let beepOnClick = function() {

    document.getElementById("beep").play();

}  

function faceRamdomnizer(isHappy){  

    isHappy ? facePath = `./image/faces/happy/happy${randomNoConsecutive(6)}.png` : facePath = `./image/faces/sad/sad${sadToggle = 1 - sadToggle}.png`;
    
    document.querySelector(".face").src = facePath;
       
    function randomNoConsecutive(maxNumber){
    
        random = Math.floor(Math.random()*maxNumber) // ramdomize from 0 to maxNumber - 1
    
        if (random === previousRandom) {
            randomNoConsecutive(maxNumber);
        }
    
        previousRandom = random;
    
        return random;
    }
    
}

window.onload = function(){

    faceRamdomnizer(true);
    buttonListenner();
 
}

export {faceRamdomnizer};