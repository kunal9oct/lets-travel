// we are wrapping code in curly brackets because we want to ensure that these function & variables declaraed are only accessable in this file
// by doing so even if articlesBlock is declaraed in delete-post.js but it will not created problem
// because by using curly brackets we have incresed it's scope
{
    let articlesBlock = document.querySelector('.articles-list');
    // we can't add event listener to those elements which are dynamically added by script or js
    // so we use event delegation like in ballon project and we use event delegation on whole article block in which those posts are going to be added

    let updateBtn = document.querySelector('#v-pills-update-post-tab');
    let updateForm = document.querySelector('.update-post-form');

    let titleInput = document.querySelector('#update-title');
    let textArea = document.querySelector('#update-text');

    let id;

    articlesBlock.addEventListener('click', async function (e) {
        // so this 'e' is event object which contains all info about what events are taking place
        // so we are going to check whether edit-btn was clicked or not by using target object in 'e'
        // e.target tells what is clicked 
        if (e.target.classList.contains('edit-btn')) {
            id = e.target.parentNode.parentNode.querySelector('.id').value;
            let postInfo = await fetch('http://localhost:3000/posts/' + id)
                .then((response) => response.json())
                .then((data) => data);
            titleInput.value = postInfo.title;
            textArea.value = postInfo.text;

            updateBtn.click();
        }
    })

    updateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let updateDescription;
        if (textArea.value.indexOf('.') === -1) {   // '-1' here means that their is no dot(.) in the text, as we will be getting index number so by having its value as -1 means it's not present in text
            updateDescription = textArea.value;
        } else {
            updateDescription = textArea.value.substring(0, textArea.value.indexOf('.') + 1);
        }
        fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                title: titleInput.value,
                text: textArea.value,
                description: updateDescription
            })
        }).then((resp) => resp.text())
            .then(() => window.history.go());
    })
}