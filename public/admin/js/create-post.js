let createForm = document.querySelector('.create-post-form');
let title = document.querySelector('#title');
let country = document.querySelector('#country');
let imageURL = document.querySelector('#imageURL');
let text = document.querySelector('#text');
let imageFile = document.querySelector('#image-file');

createForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let createText = text.value;
    let createDescription;
    if(createText.indexOf('.') === -1) {   // '-1' here means that their is no dot(.) in the text, as we will be getting index number so by having its value as -1 means it's not present in text
        createDescription = createText;
    } else {
        createDescription = createText.substring(0, createText.indexOf('.') + 1);
    }
    // formdata format is also used to send data to server but beast is that we can send even binary data like file we choose from input of file type by converting it in binary data
    let data = new FormData();  // every file is binary data and formdata format supports binary data
    data.append('title', title.value);
    data.append('country', country.value);
    data.append('imageURL', imageURL.value);
    data.append('text', createText);
    data.append('description', createDescription);
    data.append('imageFile', imageFile.files[0]);  // input of type file, have text(selected file name) then it's not saved in value key rather in files key which is an array too

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: data
    }).then((response) => response.text()).then((data) => window.history.go());
})

function disableInput(input1, input2) {
    if(input1.value) {
        input2.disabled = true;
    } else {
        input2.disabled = false;
    }
}

imageURL.addEventListener('change', () => disableInput(imageURL, imageFile));
imageFile.addEventListener('change', () => disableInput(imageFile, imageURL));