const REGEX1 = /\d*\n\d{2}:\d{2}:\d{2}\,\d{3} --> \d{2}:\d{2}:\d{2}\,\d{3}\n.*?(?=\n\n\d+.\d{2}:\d{2}:\d{2}\,\d{3} -->)/gsm;
const LAST_DIALOGUE_REGEX = /.*(\d{4}\n\d{2}:\d{2}:\d{2}[.,]\d{3} --> \d{2}:\d{2}:\d{2}[.,]\d{3}\n.*?)$/gms;
const REGEX2 = /\d*\n\d{2}:\d{2}:\d{2}[.,]\d{3} --> \d{2}:\d{2}:\d{2}[.,]\d{3}\n.*?(?=\n\n\d+.\d{2}:\d{2}:\d{2}[.,]\d{3} -->)/gsm;

export default function processSubtitles(textContent, stepNr) {

    let regex = (stepNr == 1) ? REGEX1 : REGEX2;
    let result = "";

    result += `${processMatches(regex, textContent)}`;

    // fix: get last dialogue too
    result += `${processMatches(LAST_DIALOGUE_REGEX, textContent)}`;

    return result;
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
    let result = "";

    text.match(regex).forEach(match => {
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

    return result;
}