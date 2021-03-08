
let keyboard = document.querySelector('.piano__keyboard'); //Keyboard div
let controls = document.querySelectorAll('.piano__control__option'); //Radio buttons
let playBtn = document.querySelector('.piano__play-btn'); //Play button
let tempoSelect = document.querySelector('.piano__tempo'); //Tempo dropdown
let songSelect = document.querySelector('.piano__song-list');

let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardMap = 
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Z', 'X', 'C', 'V', 'B', 'N'];
let keys = [];

/** Commas are basically pauses in the songs, letter = note, number = octave */
let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5`;

let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                    B3,,D4,,G3,,A3,B3,,,,,,
                    C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,
                    B3,B3,B3,,A3,,A3,,B3,,A3,,,,D4`;

let playSong = (notesString, tempo, callback) => {
    let notes = notesString.split(','); //Make the string into an indexed array!
    console.log(notes);
    let currentNote = 0;
    let mousedown = new Event('mousedown');
    let mouseup = new Event('mouseup');
    let btn;

    let interval = setInterval(() => {
        if (currentNote < notes.length) { //Loop through the notes (TRIM removes empty spaces...)
            if (notes[currentNote].trim() !== '') {
                if (btn) { //if key is pressed
                btn.dispatchEvent(mouseup); //Also generate the mouseup event!
                }
                btn = document.querySelector(`[data-letter-note="${notes[currentNote].trim()}"]`);
                btn.dispatchEvent(mousedown);
            }
            currentNote++;
        } else {
            if (btn) {
                btn.dispatchEvent(mouseup); //Also generate the mouseup event for the last note !
            }
            clearInterval(interval);
            callback();
        }
    }, 300 / tempo);
}

playBtn.addEventListener('mousedown', () => {
    let tempo = +tempoSelect.value; //PLUS SIGNS CONVERT STRINGS TO NUMBERS!!
    let songNum = +songSelect.value;
    playBtn.disabled = true; //Disable the button while playing

    let enablePlayBtn = () => playBtn.disabled = false; //passing the function to enable play button, once playSong function is done

    switch(songNum) {
        case 1: playSong(jingleBells, tempo, enablePlayBtn); break;
        case 2: playSong(happyBirthday, tempo, enablePlayBtn); break;
    }
});

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
