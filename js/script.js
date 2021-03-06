import {displayBoundaries} from "./calcFlow.js";
import {executeOperation} from "./calcFlow.js";
import {calculatorInput} from "./calcFlow.js";


//keyboard keycodes
let keyboardCodes = [8,13,17,96,97,98,99,100,101,102,103,104,105,106,107,109,110,111,192,219,223];

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

function keyboardListenner(){   

    document.addEventListener("keydown", event => {
       
        if (keyboardCodes.indexOf(event.keyCode) != -1)
            addKeyboardOperation(document.querySelector(`button[label="${event.keyCode}"]`));
        
    });

}

let addKeyboardOperation = function (event) { userInput = new calculatorInput(event.textContent,event.className,event.id);
    faceRamdomnizer(true); executeOperation(userInput); }

function buttonListenner(){

    document.querySelectorAll(".grid-container button").forEach( button => {
        button.addEventListener('click', addButtonOperation);
    });    

    document.querySelector("#sound").removeEventListener('click', addButtonOperation); //remove operation from sound button
    document.querySelector("#sound").addEventListener('click', soundOnOff); 

    document.querySelector("#right").addEventListener('click', rightDisplayPosition);
    document.querySelector("#left").addEventListener('click', leftDisplayPosition);

}

let rightDisplayPosition = function (event) {displayBoundaries(true)};
let leftDisplayPosition = function (event) {displayBoundaries(false)};

let addButtonOperation = function (event) { if (event.target.id == "back-img")
    userInput = new calculatorInput(event.target.parentElement.textContent,event.target.parentElement.className,event.target.parentElement.id);
    else userInput = new calculatorInput(event.target.textContent,event.target.className,event.target.id);     
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
    keyboardListenner();
 
}

export {faceRamdomnizer};