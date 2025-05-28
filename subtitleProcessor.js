const REGEX1 = /\d*\n\d{2}:\d{2}:\d{2}\,\d{3} --> \d{2}:\d{2}:\d{2}\,\d{3}\n.*?(?=\n\n\d+.\d{2}:\d{2}:\d{2}\,\d{3} -->)/gms;
const REGEX1_ALT = /\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n.*?(?=\n\d+\n|\n$)/gms;
const LAST_DIALOGUE_REGEX = /.*(\d{4}\n\d{2}:\d{2}:\d{2}[.,]\d{3} --> \d{2}:\d{2}:\d{2}[.,]\d{3}\n.*?)$/gms;
const REGEX2 = /\d*\n\d{2}:\d{2}:\d{2}[.,]\d{3} --> \d{2}:\d{2}:\d{2}[.,]\d{3}\n.*?(?=\n\n\d+.\d{2}:\d{2}:\d{2}[.,]\d{3} -->)/gsm;
const STEP1_REGEX = /\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n.*?(?=\n\d+\n|\n$)/sgm;

export default function processSubtitles(textContent, stepNr) {

    let regex = (stepNr == 1) ? REGEX1_ALT : REGEX2;
    let result = "";
    let useText = cleanseText(textContent);

    result += `${processMatches(regex, useText)}`;
    return result;
}

function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

function getSecondGroup(textcontent, regex) {
    return getMatches(textcontent, regex, 1)
}


// Returns how many times a 'char' appears in 'text'
function charCount(char, text) {

    let arr = text.split(char);
    return arr.length - 1;
}

// Returns whether this piece of text correspondes to more that one line of diialogue
function isMultiLineDialogue(text) {
    return charCount("-", text) >= 2
}

function processMatches(regex, text) {
    const re = new RegExp("/\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n.*?(?=\n\d+\n|\n$)", 'gms');
    let result = "";
    let matches = String(text).match(regex);

    if (matches && matches.length > 0) {
        matches.forEach(match => {
            let textsArray = match.split("\n");

            let dialogueNr = textsArray[0]; // "23"
            let timestamp = textsArray[1].replace('.', ',').replace('.', ','); // "00:04:10,046 --> 00:04:15,005"
            let dialogue = textsArray.slice(2,); // ["When my mother finds out about the plan", "you played with Osman Bey, it won't be good."]
            let joinedDialogue = dialogue.join(" "); // "When my mother finds out about the plan you played with Osman Bey, it won't be good."
            result += `${dialogueNr}\n${timestamp}\n`;
            // when is multi-line dialogue, just add each line separately
            if (isMultiLineDialogue(joinedDialogue)) {
                dialogue.forEach(line => {
                    result += `${line}\n`;
                });
                result += `\n`;
            } else { // if not, join all in one single line
                result += `${joinedDialogue}\n\n`;
            }
        });
    }


    return result;
}

// clears text of special characters
function cleanseText(text) {
    return text.replace(/﻿/g, "");
}
