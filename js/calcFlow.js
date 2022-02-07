// list of operations

let operationNameList = ["add","subtract","multiply","divide","percentual","exponential","factorial","roots","ft2m","m2ft","in2cm","cm2in"];

let add;
let subtract;
let multiply;
let divide;
let percentual;
let exponential;
let factorial;
let roots;
let ft2m;
let m2ft;
let in2cm;
let cm2in;

let operationFunctionList = [
add = (n1,n2) => { return parseFloat(n1)+parseFloat(n2); }, //avoid concatenating strings
subtract = (n1,n2) => { return n1-n2; },
multiply = (n1,n2) => { return n1*n2; },
divide = (n1,n2) => { if(n2 != 0) return n1/n2; else return null; },
percentual = (n1,n2) => { return n1*(n2/100); },
exponential = (n1) => { return n1**2; },
factorial = (n1) => { let fat; if(Number.isInteger(parseFloat(n1)) && n1>0){fat=1; for(let i=1; i<=n1; i++){fat *= i}}else{fat=null} return fat; },
roots = (n1) => { if(n1>=0) return Math.sqrt(n1); else return null; },
ft2m = (n1) => { return n1/3.281; },
m2ft = (n1) => { return n1*3.281; },
in2cm = (n1) => { return n1*3.54; },
cm2in = (n1) => { return n1/3.54; }];

// operation variables

let display = new Array();
let historyArray = new Array();
let state = 0;
let firstNumber;
let secondNumber;
let operation;
let result;
let currentDisplayData;

let hasPoint=false;
let hasPlusMinus=false;
let floatDigitCount=0;
let maxFloatDigit = 2;
let inputDigitCount=0;
let maxInputDigit = 10;
class calculatorInput {

    constructor(value,type,id=null) {
        this.value = value;
        this.type = type;
        this.id = id;
    }

    static operationFunction(operationArray){

       return operationFunctionList[operationNameList.findIndex( operation => operation === operationArray.id)];
     
    }

    static limitFloatNumbers(number){

        if (Number.isInteger(number))
            return number;
        else
            return number.toFixed(maxFloatDigit);

    }

    static executeOperation1var(numberArray, operation){

        let value = this.operationFunction(operation)(numberArray.value);

        if (value === null)
            return new calculatorInput( "ERROR","Error");
            
        return new calculatorInput( this.limitFloatNumbers(value), numberArray.type);

    }

    static executeOperation2var(firstNumArray, secondNumArray, operation){

        let value = this.operationFunction(operation)(firstNumArray.value,secondNumArray.value);
        
        if (value === null)
            return new calculatorInput( "ERROR","Error");

        return new calculatorInput( this.limitFloatNumbers(value),firstNumArray.type);

    }

    static concatNumbers(firstNum, secondNum){

        return new calculatorInput(firstNum.value+secondNum.at(-1).value, firstNum.type);

    }

    static deconcatNumbers(concatNum){

        return new calculatorInput(concatNum.value.slice(0,-1), concatNum.type);

    }

    static plusMinustFunction(numberArray){

        return new calculatorInput(numberArray.value *= -1, numberArray.type);
        
    }

    static delElementArray(elementId,array){

        array.reverse();
        let elementIndex = array.findIndex( e => e.id == elementId);
        array.splice(elementIndex,1);
        array.reverse();

    }

    static clearAll(){
        historyArray = [];
        display = [];
        currentDisplayData = "0";
        inputDigitCount = 0;
        floatDigitCount = 0;
        hasPoint = false;
        state = 0;
    }

}

function executeOperation(input){

    if (input.id == "clear"){
        calculatorInput.clearAll();
        putOnScreen(currentDisplayData);
    }
        

    else if (input.id == "backspace"){
        historyArray.pop();
        let newHistoryArray = historyArray;
        calculatorInput.clearAll();
        
        if (historyArray.length == 0)
            putOnScreen(currentDisplayData);
        
        newHistoryArray.forEach( input => operationFlow(input));

    } else 
        operationFlow(input);
    
}

function operationFlow(input){

    switch (state) {
        
        case 0:{ //start
            if (input.type == "number"){
                historyArray.push(input);
                firstNumber = historyArray[0];
                currentDisplayData = firstNumber.value;
                state = 1; //first number
            } else 
                currentDisplayData = "0";
            break;
        }

        case 1:{ //first number
            if (input.type == "number" && inputDigitCount < maxInputDigit - 1 && floatDigitCount<maxFloatDigit - 1){
                inputDigitCount += 1;
                if (hasPoint)
                    floatDigitCount += 1;
                historyArray.push(input);
                firstNumber = calculatorInput.concatNumbers(firstNumber,historyArray);
                currentDisplayData = firstNumber.value;

            } else if (input.id == "point" && !hasPoint){
                historyArray.push(input);  
                firstNumber = calculatorInput.concatNumbers(firstNumber,historyArray);
                currentDisplayData = firstNumber.value;
                hasPoint = true;
                state = 2; //first number float point

            } else if (input.id == "plus-minus") {

                firstNumber = calculatorInput.plusMinustFunction(firstNumber);
                currentDisplayData = firstNumber.value;

                if (hasPlusMinus){
                    calculatorInput.delElementArray(input.id,historyArray);
                    hasPlusMinus = false;
                } else {
                    historyArray.push(input);
                    hasPlusMinus = true;
                }
                
            } else if (input.type == "operation-1var") {
                historyArray.push(input);
                operation = historyArray.at(-1);
                result = calculatorInput.executeOperation1var(firstNumber,operation);
                currentDisplayData = result.value; 
                hasPoint = false;  
                inputDigitCount = 0;
                floatDigitCount = 0;
                state = 6; // equal
                
            } else if (input.type == "operation-2var"){
                historyArray.push(input);
                operation = historyArray.at(-1);
                hasPoint = false;
                inputDigitCount = 0;
                floatDigitCount = 0;
                state = 3; //2 variable operation    
            }
            break;
        }

        case 2: { //first number float point   
            
            if (input.type == "number"){
                historyArray.push(input);
                firstNumber = calculatorInput.concatNumbers(firstNumber,historyArray);
                currentDisplayData = firstNumber.value;
                state = 1; //first number
            }
            break;
        }
        
        case 3: { //2 variable operation 
            if (input.type == "number"){
                historyArray.push(input);
                secondNumber = historyArray.at(-1);
                currentDisplayData = secondNumber.value;
                state = 4; //second number
            }
            break;
        }

        case 4: { //second number
            if (input.type == "number" && inputDigitCount < maxInputDigit - 1 && floatDigitCount<maxFloatDigit - 1){
                inputDigitCount += 1;
                if (hasPoint)
                    floatDigitCount += 1;
                historyArray.push(input);
                secondNumber = calculatorInput.concatNumbers(secondNumber,historyArray);
                currentDisplayData = secondNumber.value;

            } else if (input.id == "point" && !hasPoint){
                historyArray.push(input);  
                secondNumber = calculatorInput.concatNumbers(secondNumber,historyArray);
                currentDisplayData = secondNumber.value;
                hasPoint = true;
                state = 5; //second number float point 

            } else if (input.id == "plus-minus") {

                secondNumber = calculatorInput.plusMinustFunction(secondNumber);
                currentDisplayData = secondNumber.value;

                if (hasPlusMinus){
                    calculatorInput.delElementArray(input.id,historyArray);
                    hasPlusMinus = false;
                } else {
                    historyArray.push(input);
                    hasPlusMinus = true;
                }
                        
            } else if (input.type == "operation-1var" || input.type == "operation-2var") {
                
                operationFlow(new calculatorInput("","","equal"));
                operationFlow(input);
                hasPoint = false;
                inputDigitCount = 0;
                floatDigitCount = 0;
                
            } else if (input.id == "equal"){
                result = calculatorInput.executeOperation2var(firstNumber,secondNumber,operation);
                currentDisplayData = result.value;
                hasPoint = false;
                inputDigitCount = 0;
                floatDigitCount = 0;
                state = 6; //equal    
            }
            break;
        }

        case 5: { //second number float point   
            
            if (input.type == "number"){
                historyArray.push(input);
                secondNumber = calculatorInput.concatNumbers(secondNumber,historyArray);
                currentDisplayData = secondNumber.value;
                state = 4; //second number
            }
            break;
        }

        case 6: { //equal
            if (input.type == "number"){
                calculatorInput.clearAll();
                state = 0;
                operationFlow(input);
                
            } else if (input.id == "plus-minus") {
                historyArray.push(input);
                result = calculatorInput.plusMinustFunction(firstNumber);
                currentDisplayData = result.value;
            
            } else if (input.type == "operation-1var"){
                firstNumber = result;
                state = 1;
                operationFlow(input);
                
            } else if (input.type == "operation-2var"){ 
                historyArray.push(input);  
                operation = historyArray.at(-1);
                firstNumber = result;
                state = 3;
            }
        }
        
    }

    putOnScreen(currentDisplayData);
}

function putOnScreen(currentDisplayData){
    
    document.querySelector("#display-history").textContent = display;

    if (currentDisplayData === "ERROR")
        faceRamdomnizer(false);

    document.querySelector("#display-current").textContent = currentDisplayData;
       
}

export {executeOperation};
export {calculatorInput};