window.onload = function () {
    // Catch the inputs from the DOM
    const imageValue = document.querySelector('.image-value')
    const image = document.querySelector('#user-image');
    const name = document.querySelector('#name');
    const lastName = document.querySelector('#last-name');
    const birthdate = document.querySelector('#date');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const repassword = document.querySelector('#confirm-password');
    const form = document.querySelector('.register-form');

    // Declare an empty object to group the validations errors 
    let errors = {};

    // Declare the functions that validate the inputs
    function nameValidation () {
        if (name.value.trim() == "") {
            errors.name = "El campo nombre no puede estar vacio";
        } else if (name.value.length < 2) {
            errors.name = "El nombre debe contener 2 caracteres como mínimo";
        } else {            
            delete errors.name
        }
        // Verificate if errors exist
        let formControl = name.parentElement

        if (errors.name) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.name;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }

    function lastNameValidation () {
        if (lastName.value.trim() == "") {
            errors.lastName = "El campo apellido no puede estar vacio";
        } else if (lastName.value.length < 2) {
            errors.lastName = "El apellido debe contener 2 caracteres como mínimo";
        } else {
            delete errors.lastName
        }        // Verificate if errors exist
        let formControl = lastName.parentElement

        if (errors.lastName) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.lastName;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }


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
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.value)) {
            errors.password = "La contraseña debe contener 8 caracteres como mínimo y un número";
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

    function repasswordValidation () {
        if (repassword.value.trim() == "") {
            errors.repassword = "El campo contraseña no puede estar vacio";
        } else if (password.value != repassword.value) {
            errors.repassword = "Las contraseñas no coinciden"
        } else {
            delete errors.repassword
        }
        // Verificate if errors exist
        let formControl = repassword.parentElement

        if (errors.repassword) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.repassword;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }

    function imageValidation () {
        imageValue.innerText = '';
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(image.value)) {
           errors.image = 'Los tipos de archivos aceptados son: .jpg, .jpeg y .png'; 
        } else {
            delete errors.image;
            let name = image.value.split('\\')
            imageValue.innerText = name[name.length-1];
        }

        let formControl = image.parentElement
        let small = formControl.querySelector('small')
        if (errors.image) {
            small.innerText = errors.image;
            small.style.visibility = "visible";
        } else {
            small.innerText = "";
            small.style.visibility = "hide";
        }

    }

    function birthdateValidation () {
        function calculateAge (birthdateInput) {
            birthdateInput = birthdateInput.value.split('-').join('/'); 
            let today = new Date();
            let birthdateDateFormat = new Date(birthdateInput);
            let year = today.getFullYear() - birthdateDateFormat.getFullYear();
            let month = today.getMonth() - birthdateDateFormat.getMonth();
            if (month < 0 || (month === 0 && today.getDate() < birthdateDateFormat.getDate())) {
                year--;
            }
            return year;
        }
                
        if (birthdate.value == "") {
            errors.birthdate = "El campo edad no puede estar vacio";
        } else if (calculateAge(date) < 18) {
            errors.birthdate = "Eres menor de edad"
        } else {
            delete errors.birthdate;
        }
        // Verificate if errors exist
        let formControl = birthdate.parentElement

        if (errors.birthdate) {
            formControl.classList.add('error');
            formControl.classList.remove('success');
            formControl.querySelector('small').innerText = errors.birthdate;
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            formControl.querySelector('small').innerText = "";
        }
    }

    // validations when the users submit the form

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        nameValidation();
        lastNameValidation();
        emailValidation();
        passwordValidation();
        repasswordValidation();
        imageValidation();
        birthdateValidation ();

        if (!Object.keys(errors).length) form.submit();
    })

    // Validations when the users left an input

    image.addEventListener('change', imageValidation);
    name.addEventListener('blur', nameValidation);
    lastName.addEventListener('blur', lastNameValidation);
    birthdate.addEventListener('blur', birthdateValidation);
    email.addEventListener('blur', emailValidation);
    password.addEventListener('blur', passwordValidation);
    repassword.addEventListener('blur', repasswordValidation);


}