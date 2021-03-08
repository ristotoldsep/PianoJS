
let keyboard = document.querySelector('.piano__keyboard');
let controls = document.querySelectorAll('.piano__control__option');
let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardMap = 
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Z', 'X', 'C', 'V', 'B', 'N'];
let keys = [];

/** Function to create all the keys on initialization */
let init = () => {
    for (let i = 1; i <= 5; i++) {
        for (let j = 0; j < 7; j++) {
            let key = createKey('white', pianoNotes[j], i); //type, note, octave
            key.dataset.keyboard = keyboardMap[j + (i - 1) * 7]; //Mapping keyboard values to keys in the loop (i = octave)
            keyboard.appendChild(key); //Make the key child of piano__keyboard div

            if (j != 2 && j != 6) {
                key = createKey('black', pianoNotes[j], i); //type, note, octave
                key.dataset.keyboard = '⇧+' + keyboardMap[j + (i - 1) * 7]; //Mapping keyboard values to keys in the loop
                let emptySpace = document.createElement('div');
                emptySpace.className = 'empty-space';
                emptySpace.appendChild(key);
                keyboard.appendChild(emptySpace);
            }
        }
    }
}

//Function for creating a single piano key
let createKey = (type, note, octave) => {
    let key = document.createElement('button');
    key.className = `piano__key piano__key--${type}`;
    key.dataset.letterNote = type == 'white' ? note + octave : note + '#' + octave;
    key.dataset.letterNoteFileName = type == 'white' ? note + octave : note + 's' + octave; //Since the note files are with "s" (sharp)
    key.textContent = key.dataset.letterNote;
    keys.push(key); //Push the key element to an array (for control handling)

    key.addEventListener('mousedown', () => { //Play sound when key is pressed
        playSound(key);
        key.classList.add('piano__key--playing'); //Add background when pressed
    });
    key.addEventListener('mouseup', () => {
        key.classList.remove('piano__key--playing');
    });
    key.addEventListener('mouseleave', () => {
        key.classList.remove('piano__key--playing');
    });

    return key; //So we could use the key in other functions
}

//Mapping eventlisteners to each keyboard letter
document.addEventListener('keydown', (e) => {
    console.log(e);
    if (e.repeat) { //true or false (check from console)
        return; //Stop fx execution
    }
    pressKey('mousedown', e);
})

//Same fx as above but for keyup
document.addEventListener('keyup', (e) => {
    pressKey('mouseup', e);
});

let pressKey = (mouseEvent, e) => {
    let lastLetter = e.code.substring(e.code.length - 1); //Gets the letter 'P' from "keyP"
    let isShiftPressed = e.shiftKey; //True or false
    let selector;
    if (isShiftPressed) { //is shift and some letter pressed simultaneously
        selector = `[data-keyboard="⇧+${lastLetter}"]`;
    } else {
        selector = `[data-keyboard=${lastLetter}]`;
    }
    let key = document.querySelector(selector);
    // console.log(key);

    /** WHEN RIGHT KEYS ARE PRESSED, these 2 lines of code are eXecuted!
     * key.addEventListener('mouseup', () => { //Play sound when key is pressed
        playSound(key);
        key.classList.add('piano__key--playing'); //Add background when pressed
    });  
     */
    if (key !== null) {
        let event = new Event(mouseEvent);
        key.dispatchEvent(event);
    }
}

/** Function to play the note when key is pressed */
let playSound = (key) => {
    let audio = document.createElement('audio');
    audio.src = 'sounds/' + key.dataset.letterNoteFileName + '.mp3';
    audio.play().then(() => audio.remove()); //After playing the sound, remove the audio element
}

/** Loop to select all the controls*/
controls.forEach((input) => {
    input.addEventListener('input', () => {
        let value = input.value;
        let type;
        switch(value) {
            case 'letterNotes': type = 'letterNote'; break;
            case 'keyboard': type = 'keyboard'; break;
            case 'none': type = '';
        }
        keys.forEach((key) => {
            key.textContent = key.dataset[type];
        })
    })
});

init();
