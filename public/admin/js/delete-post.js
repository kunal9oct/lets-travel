// we are wrapping code in curly brackets because we want to ensure that these function & variables declaraed are only accessable in this file
// by doing so even if articlesBlock is declaraed in delete-post.js but it will not created problem
// because by using curly brackets we have incresed it's scope
{
    let articlesBlock = document.querySelector('.articles-list');
// we can't add event listener to those elements which are dynamically added by script or js
// so we use event delegation like in ballon project and we use event delegation on whole article block in which those posts are going to be added

articlesBlock.addEventListener('click', function(e) {
    // so this 'e' is event object which contains all info about what events are taking place
    // so we are going to check whether remove-btn was clicked or not by using target object in 'e'
    // e.target tells what is clicked 
    if(e.target.classList.contains('remove-btn')) {
        // remove-btn button tag is child element to 'td' tag as 'td' tag is its parent 
        // or you can say that 'td' tag is parentnode element - node means child
        // same way 'td' is child to 'tr' tag & 'tr' tag is 'td' tag parent
        // or you can say that 'tr' tag is parentnode element

        // remember 1st parentNode takes you to 'td' element then 3nd parentNode takes you to 'tr' element after we use querySelector to find id class
        let id = e.target.parentNode.parentNode.querySelector('.id').value;
        fetch('/posts/' + id, {
            method: 'DELETE'
        }).then((response) => response.text())
        .then(() => window.history.go());
    }
})
}