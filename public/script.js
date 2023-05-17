import processSubtitles from './subtitleProcessor.js';

const form1 = document.querySelector('#form1');
const form2 = document.querySelector('#form2');
const fileInput = document.querySelector('#file-input-step1');
const fileInput2 = document.querySelector('#file-input-step2');

fileInput.addEventListener('change', (event) => checkFile(event, 1));
fileInput2.addEventListener('change', (event) => checkFile(event, 2));

function checkFile(event, buttonNumber) {
  // Get the uploaded file
  const file = event.target.files[0];

  let button = document.querySelector('#upload-button-' + buttonNumber);

  // Check if a file was uploaded successfully
  if (file) {
    // Change the button style to blue
    button.classList.remove('grey');
    button.classList.add('blue'); 
    toggleOffErrorUpload(buttonNumber);
  } else {
    button.classList.add('grey');
    button.classList.remove('blue'); 
  }
}

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
        toggleOffErrorUpload(stepNr);
        const reader = new FileReader();
        reader.onload = (event) => {

            const text = event.target.result

            let result = processSubtitles(text, stepNr);


            if (result) {
                downloadFile(result, `result${stepNr}.txt`);
                showSuccessStep(stepNr);
            }

        };
        reader.readAsText(file);
    } else {
        showErrorUpload(stepNr);
        console.log('Please select a .txt file.');
        showAlert('Por favor sube un archivo .txt')
    }
}

function showAlert(text){
    window.alert(text);
}

function showErrorUpload(number){
    let input = document.querySelector('#file-input-step' + number);
    input.classList.add('error');
}

function toggleOffErrorUpload(number){
    let input = document.querySelector('#file-input-step' + number);
    input.classList.remove('error');
}

function showSuccessStep(stepNr) {
    let step = document.querySelector('#step-' + stepNr);
    step.classList.add('success');
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