window.onload = function () {
    // Catch the inputs from the DOM
    const selectCategory = document.querySelector('[name="categoryId"]');
    const selectType = document.querySelector('[name="typeId"]');
    const selectBrand = document.querySelector('[name="brandId"]');
    const selectColor = document.querySelector('[name="colorId"]');
    // const imageValue = document.querySelector('.image-value')
    // const image = document.querySelector('#user-image');
    // const name = document.querySelector('#name');
    const form = document.querySelector('.CRUD-form');

    // Declare an empty object to group the validations errors 
    let errors = {};

    // Declare the functions that validate the inputs
    function selectValidation (select) {
       
        if ( !select.value ) {   
            errors[select] = "Debes seleccionar una opción"
            console.log(errors)
        } else {
            delete errors[select]
        }

        const feedback = select.nextElementSibling;
        let formControl = select.parentElement;

        if(errors[select]) {
            feedback.innerText = errors[select]
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
    }

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


    // validations when the users submit the form

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // nameValidation();
        // imageValidation();

        if (!Object.keys(errors).length) form.submit();
    })

    // Validations when the users left an input

    // image.addEventListener('change', imageValidation);
    // name.addEventListener('blur', nameValidation);
    selectCategory.addEventListener('blur', function () {
        selectValidation(this)
    });
    selectType.addEventListener('blur', function () {
        selectValidation(this)
    });
    selectBrand.addEventListener('blur', function () {
        selectValidation(this)
    });
    selectColor.addEventListener('blur', function () {
        selectValidation(this)
    });




}