window.onload = () => {
    $('#login-btn').on('click', login);
    $('#register-btn').on('click', register);

    function fetchData(file, callBack) {
        $.ajax({
            url: "assets/data/" + file + ".json",
            method: "get",
            dataType: "json",
            success: (response) => callBack(response),
            error: (xhr) => xhr
        })
    }

    fetchData("menu", displayMenu)

    function displayMenu(data) {
        let html = "";
        data.forEach(x => {
            html += `<li class="nav-item">
                    <a class="nav-link" href="${x.href}">${x.title}</a>
                </li>
                `
        })
        $("#navbar").html(html);
    }
}


const login = event => {
    event.preventDefault();
    const email = $('#exampleInputEmail1').val();
    const password = $('#exampleInputPassword1').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => {
        return user.email === email && user.password === password;
    })
    if(user) {
        localStorage.setItem('authenticatedUser', JSON.stringify(user));
        window.location.replace('index.html')
    }
}

const register = event => {
    event.preventDefault();
    const regexImePrezime = /(^[A-ZĐŠĆČ][a-zđšćč]{3,13}[\s][A-ZĐŠĆČ][a-zđšćč]{3,13}[\s]?([A-ZĐŠĆČ][a-zđšćč]{3,13})?)$/;
    const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const regPassword = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const nameSurnameVal = $('#nameLastName').val();
    const emailVal = $('#email').val();
    const passwordVal = $('#password').val();
    const confirmPasswordVal = $('#confirmPassword').val();
    const nameSurname = $('#nameLastName').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword');
    var errors = [];
    if (!regexImePrezime.test(nameSurnameVal) || nameSurnameVal.length == 0) {
        errors.push()
        $('#nameLastNameErr').removeClass('d-none');
        $('#nameLastNameErr').html('Niste uneli ime i prezime u željenom formatu, moraju početi velikim karakterima')

    } else {
        $('#nameLastNameErr').addClass('d-none');
    }
    if (!regexMail.test(emailVal) || emailVal.length == 0) {
        errors++
        $('#emailErr').removeClass('d-none');
        $('#emailErr').html('Niste dobro uneli mejl adresu');

    } else {
        $('#emailErr').addClass('d-none');
    }
    if (!regPassword.test(passwordVal) || passwordVal.length == 0) {
        errors++
        $('#passwordErr').removeClass('d-none');
        $('#passwordErr').html('Niste dobro uneli password mora imati barem 8 karaktera, od toga jedan broj i jedno slovo')
    } else {
        $('#passwordErr').addClass('d-none');
    }


    if (passwordVal !== confirmPasswordVal) {
        errors++
        $('#confirmPasswordErr').removeClass('d-none');
        $('#confirmPasswordErr').html('Morate ponoviti lozinku')
    } else {
        $('#confirmPasswordErr').addClass('d-none');
    }
    if (errors.length != 0) {
        console.log(errors);
    } else {
        console.log(123)
        $('#confirmPasswordErr').removeClass('d-none text-danger');
        $('#confirmPasswordErr').addClass(' text-success');
        $('#confirmPasswordErr').html('Uspesno ste se registrovali');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            console.log('user exists');
            return;
        }
        users.push({nameSurname, email, password});
        localStorage.setItem('users', JSON.stringify(users));
    }
}