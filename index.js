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
    "7", "8", "9", "\u0430", "\u0431", "\u0432", "\u0433", 
    "\u0434", "\u0435", "\u0436", "\u0437", "\u0438", "\u0439", 
    "\u043A", "\u043B", "\u043C", "\u043D", "\u043E", "\u043F", 
    "\u0440", "\u0441", "\u0442", "\u0443", "\u0444", "\u0445", 
    "\u0446", "\u0447", "\u0448", "\u0449", "\u044A", "\u044B", 
    "\u044C", "\u044D", "\u044E", "\u044F", "\u0451", "\u3041", 
    "\u3042", "\u3043", "\u3044", "\u3045", "\u3046", "\u3047", 
    "\u3048", "\u3049", "\u304A", "\u304B", "\u304C", "\u304D", 
    "\u304E", "\u304F", "\u3050", "\u3051", "\u3052", "\u3053", 
    "\u3054", "\u3055", "\u3056", "\u3057", "\u3058", "\u3059", 
    "\u305A", "\u305B", "\u305C", "\u305D", "\u305E", "\u305F", 
    "\u3060", "\u3061", "\u3062", "\u3063", "\u3064", "\u3065", 
    "\u3066", "\u3067", "\u3068", "\u3069", "\u306A", "\u306B", 
    "\u306C", "\u306D", "\u306E", "\u306F", "\u3070", "\u3071", 
    "\u3072", "\u3073", "\u3074", "\u3075", "\u3076", "\u3077", 
    "\u3078", "\u3079", "\u307A", "\u307B", "\u307C", "\u307D", 
    "\u307E", "\u307F", "\u3080", "\u3081", "\u3082", "\u3083",
    "\u3084", "\u3085", "\u3086", "\u3087", "\u3088", "\u3089", 
    "\u308A", "\u308B", "\u308C", "\u308D", "\u308E", "\u308F", 
    "\u3090", "\u3091", "\u00FE", "\u00F1", "\u00DF", "\u0153", 
    "\u00F8", "\u00E5", "\u00E6" 
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
    if (character.match(/[a-z\u3041-\u3094\u0451\u0430-\u044F\u00FE\u00F1\u00DF\u0153\u00F8\u00E5\u00E6]/i)) {
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
    sentence = delatinise(sentence);
    sentence = removeSpaces(sentence);
    console.log(sentence)
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

    if (matches != null) {
        for (var i = 0; i < matches.length; i ++) {
            sentence = sentence.replace(matches[i], numToWord(matches[i]));
        }
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
    
    // Return the word form of the number
    return words;
}

function delatinise (sentence) {
    sentence = sentence.replace(/[\u00E0-\u00E4\u0100-\u0105]/g, 'a');
    sentence = sentence.replace(/[\u00E7\u0106-\u010D]/g, 'c');
    sentence = sentence.replace(/[\u00E8-\u00EB\u0112-\u011B]/g, 'e');
    sentence = sentence.replace(/[\u00EC-\u00EF\u0128-\u0133]/g, 'i');
    sentence = sentence.replace(/[\u00F0]/g, 'th');
    sentence = sentence.replace(/[\u017F]/g, /[\u00DF]/g);
    sentence = sentence.replace(/[\u00F2-\u00F6\u00F9-\u00FD\u00FF\u014C-\u0151]/g, 'o');
    sentence = sentence.replace(/[\u00F7]/g, 'divided by');
    sentence = sentence.replace(/[\u00F9-\u00FC\u00FF\u0168-\u0172]/g, 'u');
    sentence = sentence.replace(/[\u00FD\u00FF\u0176-\u0178\u0233]/g, 'y');
    sentence = sentence.replace(/[\u010E-\u0111]/g, 'd');
    sentence = sentence.replace(/[\u011C-\u0123]/g, 'g');
    sentence = sentence.replace(/[\u0124-\u0127]/g, 'h');
    sentence = sentence.replace(/[\u0134-\u0135]/g, 'j');
    sentence = sentence.replace(/[\u0136-\u0138]/g, 'k');
    sentence = sentence.replace(/[\u0124-\u0127]/g, 'h');
    sentence = sentence.replace(/[\u0139-\u0142]/g, 'l');
    sentence = sentence.replace(/[\u0143-\u014B]/g, 'n');
    sentence = sentence.replace(/[\u0154-\u0159]/g, 'r');
    sentence = sentence.replace(/[\u015A-\u0161]/g, 's');
    sentence = sentence.replace(/[\u0162-\u0167]/g, 't');
    sentence = sentence.replace(/[\u0174-\u0175]/g, 'w');
    sentence = sentence.replace(/[\u0179-\u017E]/g, 'z');
    return sentence;
}