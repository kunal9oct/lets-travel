async function getPosts() {
    return await fetch('/posts')
                    .then((response) => response.json())
                    .then((data) => data);
}

async function getCallbackRequests() {
    return await fetch('/callback-requests')
                    .then((response) => response.json())
                    .then((data) => data);
}

async function getEmails() {
    return await fetch('/emails')
                    .then((response) => response.json())
                    .then((data) => data);
}

document.addEventListener('DOMContentLoaded', async function() {
    // we don't add await in front of these functions because these functions can be loaded simultaenously
    addPosts();
    addCallbackRequests();
    addEmails();

    // CREATE POST
    let addPostBtn = document.querySelector('.add-post');
    let createPostBtn = document.querySelector('#v-pills-add-post-tab');
    addPostBtn.addEventListener('click', () => createPostBtn.click());
})

async function addPosts() {
    let posts = await getPosts();   // here getPosts() is now asynchornous so we use await, earlier fetch() function inside was asynchronous
    let articles = document.querySelector('.articles-list tbody');  // because tbody tag is automatically getting created, so we directly paste our html inside tbody
    articles.innerHTML = '';
    let order = 1;
    posts.forEach((post) => {   // this is 'value' argument in forEach() function
        // we have added order variable which will first display order value then increase & it will increase each time new post created & then taken from database to this html
        // also we want to have uniqid for every post & for this we have added a hidden input with value = post.id which has uniqid() in app.js
        let postHTML = `<tr>
        <td>${order++}<input class="id" type="hidden" value="${post.id}"></td>
        <td class="title">${post.title}</td>
        <td class="date">${post.date}</td>
        <td class="country">${post.country}</td>
        <td><button class="edit-btn btn btn-link p-0 text-decoration-none">Edit</button></td>
        <td><button class="remove-btn btn btn-link p-0 text-decoration-none">X</button></td>
    </tr>`;
    articles.insertAdjacentHTML('beforeend', postHTML);
    })
}

async function addCallbackRequests() {
    let requests = await getCallbackRequests();   // here getCallbackRequests() is now asynchornous so we use await, earlier fetch() function inside was asynchronous
    let requestsBlock = document.querySelector('#v-pills-requests tbody');  // because tbody tag is automatically getting created, so we directly paste our html inside tbody
    requestsBlock.innerHTML = '';
    let order = 1;
    requests.forEach((request) => {   // this is 'value' argument in forEach() function
        // we have added order variable which will first display order value then increase & it will increase each time new post created & then taken from database to this html
        // also we want to have uniqid for every post & for this we have added a hidden input with value = post.id which has uniqid() in app.js
        let requestHTML = `<tr>
        <td>${order++}<input class="id" type="hidden" value="${request.id}"></td>
        <td class="phoneNumber">${request.phoneNumber}</td>
        <td class="date">${request.date}</td>
        <td><button class="remove-btn btn btn-link p-0 text-decoration-none">X</button></td>
    </tr>`;
    requestsBlock.insertAdjacentHTML('beforeend', requestHTML);
    })
}

let requestsBlock = document.querySelector('#v-pills-requests');
// we can't add event listener to those elements which are dynamically added by script or js
// so we use event delegation like in ballon project and we use event delegation on whole article block in which those posts are going to be added

requestsBlock.addEventListener('click', function(e) {
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
        fetch('/callback-requests/' + id, {
            method: 'DELETE'
        }).then((response) => response.text())
        .then(() => window.history.go());
    }
})

async function addEmails() {
    let emails = await getEmails();   // here getCallbackRequests() is now asynchornous so we use await, earlier fetch() function inside was asynchronous
    let emailsBlock = document.querySelector('#v-pills-mails tbody');  // because tbody tag is automatically getting created, so we directly paste our html inside tbody
    emailsBlock.innerHTML = '';
    let order = 1;
    emails.forEach((email) => {   // this is 'value' argument in forEach() function
        // we have added order variable which will first display order value then increase & it will increase each time new post created & then taken from database to this html
        // also we want to have uniqid for every post & for this we have added a hidden input with value = post.id which has uniqid() in app.js
        let emailHTML = `<tr>
        <td>${order++}<input class="id" type="hidden" value="${email.id}"></td>
        <td class="name">${email.name}</td>
        <td class="email">${email.email}</td>
        <td class="date">${email.date}</td>
        <td><button class="remove-btn btn btn-link p-0 text-decoration-none">X</button></td>
    </tr>
    <tr>
        <td colspan="5" class="text">${email.text}</td>
    </tr>`;
    emailsBlock.insertAdjacentHTML('beforeend', emailHTML);
    })
}

let emailsBlock = document.querySelector('#v-pills-mails');
// we can't add event listener to those elements which are dynamically added by script or js
// so we use event delegation like in ballon project and we use event delegation on whole article block in which those posts are going to be added

emailsBlock.addEventListener('click', function(e) {
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
        fetch('/emails/' + id, {
            method: 'DELETE'
        }).then((response) => response.text())
        .then(() => window.history.go());
    }
})

let logOutBtn = document.querySelector('.log-out-btn');

logOutBtn.addEventListener('click', function() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = '/';
})