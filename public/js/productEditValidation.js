window.onload = function () {
    // Catch the inputs from the DOM
    const selectCategory = document.querySelector('[name="categoryId"]');
    const selectType = document.querySelector('[name="typeId"]');
    const description = document.querySelector('#description');
    const image = document.querySelector('#product-image');
    const price = document.querySelector('#price');
    const discount = document.querySelector('#discount');
    const selectBrand = document.querySelector('[name="brandId"]');
    const model = document.querySelector('#model');
    const selectColor = document.querySelector('[name="colorId"]');
    const form = document.querySelector('.CRUD-form');

    // Declare an empty object to group the validations errors 
    let errors = {};

    // Declare the functions that validate the inputs
    function selectValidation (select) {
       
        if ( !select.value ) {   
            errors[select] = "Debes seleccionar una opción"
        } else {
            delete errors[select]
        }

        const feedback = select.nextElementSibling;
        let formControl = select.parentElement;

        if(errors[select]) {
            feedback.innerText = errors[select];
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
    }

    function descriptionValidation () {
        if (description.value.trim() == "") {
            errors.description = "El campo descripción no puede estar vacio";
        } else if (description.value.length < 8) {
            errors.description = "La descripción debe contener 8 caracteres como mínimo";
        } else {            
            delete errors.description
        }
        // Verificate if errors exist
        let formControl = description.parentElement;
        const feedback = description.nextElementSibling;

        if (errors.description) {
            feedback.innerText = errors.description
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
    }

    function imageValidation () {
        let allowedExtensions = /(\.jpg|\.jpeg|\.png.)$/i;
        if (!image.value) {
           errors.image = 'Debes ingresar una imagen'
        } else if (!allowedExtensions.exec(image.value)) {
           errors.image = 'Los tipos de archivos aceptados son: .jpg, .jpeg y .png'; 
        } else {
            delete errors.image;
        }

        // Verificate if errors exist
        let formControl = image.parentElement;
        const feedback = image.nextElementSibling;

        if (errors.image) {
            feedback.innerText = errors.image;
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }

    }

    function priceValidation () {
        
        if (price.value.trim() == "") {
          errors.price = "El precio no puede estar vacio";
        } else if (price.value <= 0) {
            errors.price = "El precio no puede ser menor a cero";
        } else {
            delete errors.price;
        }
      
        // Verificate if errors exist
        let formControl = price.parentElement;
        const feedback = price.nextElementSibling;

        if (errors.price) {
            feedback.innerText = errors.price;
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
      };

      function discountValidation () {
        
        if (discount.value.trim() == "") {
          errors.discount = "El descuento no puede estar vacio";
        } else if (discount.value < 0 || discount.value > 100) {
            errors.discount = "El descuento no puede ser menor a 0%, ni mayor a 100%";
        } else {
            delete errors.discount;
        }
      
        // Verificate if errors exist
        let formControl = discount.parentElement;
        const feedback = discount.nextElementSibling;

        if (errors.discount) {
            feedback.innerText = errors.discount;
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
      };

      function modelValidation () {
        if (model.value.trim() == "") {
            errors.model = "El campo modelo no puede estar vacio";
        } else if (model.value.length < 2) {
            errors.model = "El modelo debe contener 2 caracteres como mínimo";
        } else {            
            delete errors.model
        }
        // Verificate if errors exist
        let formControl = model.parentElement;
        const feedback = model.nextElementSibling;

        if (errors.model) {
            feedback.innerText = errors.model
            formControl.classList.add('error');
            formControl.classList.remove('success');
        } else {
            formControl.classList.remove('error');
            formControl.classList.add('success');
            feedback.innerText = "";
        }
    };


    // validations when the users submit the form

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // selectValidation(selectCategory);
        // selectValidation(selectType);
        // descriptionValidation();
        // imageValidation();
        // priceValidation();
        // discountValidation();
        // selectValidation(selectBrand);
        // modelValidation();
        // selectValidation(selectColor);

        if (!Object.keys(errors).length) form.submit();
    })

    // Validations when the users left an input

    selectCategory.addEventListener('blur', function () {
        selectValidation(this)
    });
    selectType.addEventListener('blur', function () {
        selectValidation(this)
    });
    description.addEventListener('blur', descriptionValidation);
    image.addEventListener('change', imageValidation);
    price.addEventListener('blur', priceValidation);
    discount.addEventListener('blur', discountValidation);
    selectBrand.addEventListener('blur', function () {
        selectValidation(this)
    });
    model.addEventListener('blur', modelValidation);
    selectColor.addEventListener('blur', function () {
        selectValidation(this)
    });




}