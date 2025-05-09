const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("#lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generateButton");
const indicator = document.querySelector("[data-strengthIndicator]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "`~!@#$%^&*()_+-=[]{}|;':\",./<>?";
//Initialization of default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
//set strength indicator color to gray
handleSlider();
setIndicator("#ccc");
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow

    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    //to make the indicator visible

}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}



function calcStrength() {
    let score = 0;

    // Add points for character types
    if (uppercaseCheck.checked) score += 1;
    if (lowercaseCheck.checked) score += 1;
    if (numbersCheck.checked) score += 1;
    if (symbolsCheck.checked) score += 1;

    // Add points for length
    if (passwordLength >= 12) {
        score += 2;
    } else if (passwordLength >= 8) {
        score += 1;
    }

    // Set indicator based on total score
    if (score >= 5) {
        setIndicator("#0f0"); // strong - green
    } else if (score >= 3) {
        setIndicator("#ff0"); // medium - yellow
    } else {
        setIndicator("#f00"); // weak - red
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy message disappear after 2 sec
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//Event listeners :-
// input slider
//copy btn
//generate btn

inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value){
        copyContent();
    }
})


function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked) 
            checkCount++;     
    })

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener("change",handleCheckBoxChange);
})

function shufflePassword(array) {
    //Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((element)=>{
        str+=element;
    })
    return str;
}

generateBtn.addEventListener("click",(e)=>{
    //none of the checkbox is selected
    if(checkCount<=0) return;

    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("Start password generation");
    //start password generation
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition of one character from each selected checkbox
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("Password after compulsory addition: "+password);
    //remaining characters
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex = getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }

    console.log("Password after addition of remaining characters: "+password);
    //shuffle the password to make it more random
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
   
})