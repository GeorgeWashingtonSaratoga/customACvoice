// Define an object that maps numbers to their word form
const numbersToWords = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
};

var letter_graphs = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
    "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6",
    "7", "8", "9"
];

var digraphs = [
    "ch", "sh", "ph", "th", "wh"
];

var bebebese = "res/audio/bebebese_slow.wav";

var playbackSpeedMin = 2.5;
var playbackSpeedMax = 3.0;
var playbackSpeed = null;
var sentence = '';

function onSpeakButtonClick() {
    playbackSpeed = Math.random() * (playbackSpeedMax-playbackSpeedMin) + playbackSpeedMin;
    sentence = document.getElementById("txtPhrase").value;
    sentence = buildSentence(sentence);
    speakSentence();
}

function speakSentence() {
    speakNextCharacter();
}

function speakNextCharacter() {
    if (sentence.length == 0) return;

    var character = sentence[0];
    sentence = sentence.substring(1, sentence.length);

    var characterFile = getCharacterAudioFile(character);
    var player = new Audio();
    player.src = characterFile;
    player.mozPreservesPitch = false;
    player.playbackRate = playbackSpeed;
    player.play();
    setTimeout(speakNextCharacter, 50);
}

function getCharacterAudioFile(character) {
    if (character.match(/[a-z]/i)) {
        return "res/audio/" + character + ".wav";
    } else if (character == " ") {
        return null;
    } else {
        return bebebese;
    }
}

function buildSentence(sentence) {
    sentence = sentence.toLowerCase();
    sentence = replaceSwearWords(sentence);
    sentence = replaceParentheses(sentence);
    sentence = replaceNumTime(sentence);
    sentence = removeSpaces(sentence);
    return sentence
}

function replaceSwearWords(sentence) {
    var swearWords = ["fuck", "shit", "piss", "crap", "bugger", "dick", "pussy", "cunt", "scrotum", "urethra", "penis", "vagina", "testicles", "boobs", "tits", "boob", "tit", "boobies", "titties", "porn", "porno", "pornography", "shitsticks", "bullshit", "batshit", "apeshit", "huge big booty latina bitches", "bitch", "motherfucker"]
    for (var eachWord = 0; eachWord < swearWords.length; eachWord++) {
        sentence = sentence.replace(swearWords[eachWord], "*".repeat(swearWords[eachWord].length));
    }
    return sentence;
}

function replaceParentheses(sentence) {
    while (sentence.includes("(") || sentence.includes(")")) {
        var start = sentence.indexOf("(");
        var end = sentence.indexOf(")");
        sentence = sentence.substring(0, start) + 
            "*".repeat(end-start-1) + 
            sentence.substring(end + 1, sentence.length);
    }

    return sentence;
}

function replaceNumTime(sentence) {
    sentence = sentence.replace(":00", "o'clock");
    
    let matches = sentence.match(/\d+/g);

    console.log(matches)

    if (matches != null) {
        for (var i = 0; i < matches.length; i ++) {
            sentence = sentence.replace(matches[i], numToWord(matches[i]));
        }
        console.log(sentence)
    }

    return sentence;
}

function removeSpaces(sentence) {
    sentence = sentence.replace(" ", "");
    return sentence;
}

function numToWord(number) {
    // if number present in object no need to go further
    if (number in numbersToWords) return numbersToWords[number];
  
    // Initialize the words variable to an empty string
    let words = "";
  
    // If the number is greater than or equal to 100, handle the hundreds place (ie, get the number of hundres)
    if (number >= 100 && number <= 999) {
      // Add the word form of the number of hundreds to the words string
      words += numToWord(Math.floor(number / 100)) + " hundred";
  
      // Remove the hundreds place from the number
      number %= 100;
    }
  
    // If the number is greater than zero, handle the remaining digits
    if (number > 0) {
      // If the words string is not empty, add "and"
      if (words !== "") words += " and ";
  
      // If the number is less than 20, look up the word form in the numbersToWords object
      if (number < 20) words += numbersToWords[number];
      else {
        // Otherwise, add the word form of the tens place to the words string
        //if number = 37, Math.floor(number /10) will give you 3 and 3 * 10 will give you 30
        words += numbersToWords[Math.floor(number / 10) * 10];
  
        // If the ones place is not zero, add the word form of the ones place
        if (number % 10 > 0) {
          words += "-" + numbersToWords[number % 10];
        }
      }
    }
    
    console.log(words)
    // Return the word form of the number
    return words;
}
