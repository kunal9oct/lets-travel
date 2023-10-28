let signInForm = document.querySelector('.sign-in-form');
let registerForm = document.querySelector('.register-form');

signInForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let email = document.querySelector('#sign-in-email').value;
    let password = document.querySelector('#sign-in-password').value;

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }).then((resp) => resp.json()).then((data) => {
        // window.history.go();
        let redirectURL = data.redirectURL;
        if(redirectURL) {     // here we are checking whether redirectURL object was being sent or message object
            window.location.href = redirectURL;
        } else {
            alert('Your password and email do not match. Please try again')
        }
    });
})

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let email = document.querySelector('#register-email').value;
    let password = document.querySelector('#register-password').value;
    let rePassword = document.querySelector('#register-re-enter-password').value;

    if(password !== rePassword) {
        alert('Password not same, password should be same to re-enter password');
        return;
    }
    fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }).then((resp) => resp.json()).then((data) => {
        window.history.go();
        alert(data.message)});
})