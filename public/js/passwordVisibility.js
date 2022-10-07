const openedEye = document.querySelector('.fa-eye');
const closedEye = document.querySelector('.fa-eye-slash');
const repassword = document.querySelector('#confirm-password');

    // Add event listeners to change password visibility
    openedEye.addEventListener('click', () => {
        let formControl = openedEye.parentElement 
        formControl.classList.add('visible-password');
        password.type = "text"
        if (repassword) {
            repassword.type = "text"
        }
    })
    closedEye.addEventListener('click', () => {
        let formControl = closedEye.parentElement 
        formControl.classList.remove('visible-password');
        password.type = "password"
        if (repassword) {
            repassword.type = "password"
        }
    })