import processSubtitles from './subtitleProcessor.js';

const form1 = document.querySelector('#form1');
const form2 = document.querySelector('#form2');
const fileInput = document.querySelector('#file-input-step1');
const fileInput2 = document.querySelector('#file-input-step2');

form1.addEventListener('submit', (event) => {
    event.preventDefault();
    processFileEvent(fileInput, 1);

});

form2.addEventListener('submit', (event) => {
    event.preventDefault();
    processFileEvent(fileInput2, 2);

});

function processFileEvent(fileInput, stepNr) {

    const file = fileInput.files[0];

    if (file && file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {

            const text = event.target.result

            let result = processSubtitles(text, stepNr);


            if (result) {
                downloadFile(result, `result${stepNr}.txt`);
            }

        };
        reader.readAsText(file);
    } else {
        console.log('Please select a .txt file.');
    }
}

function downloadFile(textContent, fileName) {
    // Create a Blob object from the text content of the file
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element with the URL as its href attribute
    const link = document.createElement('a');
    link.href = url;

    // Set the filename of the downloaded file
    link.download = fileName;

    // Programmatically click the link element to trigger the download
    link.click();

    // Clean up by revoking the URL and removing the link element
    URL.revokeObjectURL(url);
    link.remove();
}