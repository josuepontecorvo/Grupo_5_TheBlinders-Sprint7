window.onload = function () {
    // Catch the inputs from the DOM
    
    const email = document.querySelector('#username');
    const password = document.querySelector('#password');
    const form = document.querySelector('.login-form');

    // Declare an empty object to group the validations errors 
    let errors = {};

    // Declare the functions that validate the inputs
   
    function emailValidation () {
        if (email.value.trim() == "") {
            errors.email = "El campo email no puede estar vacio";
        } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email.value)) {
            errors.email = "Debe ingresar un email con formato válido";
        } else {
            delete errors.email
        }
        // Verificate if errors exist
        let formControl = email.parentElement

        if (errors.email) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.email;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }

    function passwordValidation () {
        if (password.value.trim() == "") {
            errors.password = "El campo contraseña no puede estar vacio";
        } else if (password.value.length < 8 ) {
            errors.password = "La contraseña debe contener 8 caracteres como mínimo";
        } else {
            delete errors.password
        }
        // Verificate if errors exist
        let formControl = password.parentElement

        if (errors.password) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.password;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }

    // validations when the users submit the form

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        emailValidation();
        passwordValidation();
        
        if (!Object.keys(errors).length) form.submit();
    })

    // Validations when the users left an input

    email.addEventListener('blur', emailValidation);
    password.addEventListener('blur', passwordValidation);


}