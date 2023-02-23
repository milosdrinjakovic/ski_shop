window.onload = () => {
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let html = '';
        let totalPrice = 0;
        console.log(cart);
        if(!cart.length) {
            $('#cart-table-box').hide();
            $('#no-items').show();
        }
        cart.forEach((product, i) => {
            totalPrice += product.price.newPrice * product.count;
            html += `<tr>
              <th scope="row">${i + 1}</th>
              <td>${product.title}</td>
              <td id="count-${product.id}">${product.count}</td>
              <td>${product.price.newPrice * product.count} RSD</td>
              <td id="actions-primary-${product.id}">
                  <button data-id="${product.id}" class="btn btn-primary cart-item-update">Izmeni</button>
                  <button id="${product.id}" class="btn btn-primary cart-item">Obriši</button>
              </td>
              <td id="actions-secondary-${product.id}" style="display: none">
                  <button data-id="${product.id}" class="btn btn-primary cart-item-save">Sačuvaj</button>
                  <button data-id="${product.id}" class="btn btn-primary cart-item-cancel">Otkaži</button>
              </td>
            </tr>`
        })
        $('#cart-table').html(html);
        $('#total-price').text(totalPrice.toFixed(3) + " RSD")
        $('.cart-item').each(function () {
            $(this).on('click', function () {
                const id = Number($(this).attr('id'));
                const index = cart.findIndex(product => product.id === id);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            })
        });
        $('.cart-item-update').each(function () {
            $(this).on('click', function () {
                const id = Number($(this).attr('data-id'));
                const product = cart.find(product => product.id === id);
                const html = `<input type="number" id="count-input-${id}" class="form-control" id="exampleFormControlInput1" value="${product.count}">`
                $(`#count-${id}`).html(html);
                $(`#actions-primary-${id}`).hide();
                $(`#actions-secondary-${id}`).show();
            })
        });
        $('.cart-item-save').each(function () {
            $(this).on('click', function () {
                const id = Number($(this).attr('data-id'));
                const product = cart.find(product => product.id === id);
                product.count = $(`#count-input-${id}`).val();
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            })
        });
        $('.cart-item-cancel').each(function () {
            $(this).on('click', function () {
                const id = Number($(this).attr('data-id'));
                $(`#actions-primary-${id}`).show();
                $(`#actions-secondary-${id}`).hide();
            })
        });

    }

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

    displayCart();
    $('#finish-order').on('click', function () {
        $('#cart-table-box').hide();
        $('#checkout-form').show();
        const user = localStorage.getItem('authenticatedUser');
        if (user) {
            const name = JSON.parse(user).nameSurname
            $('#fullNameControl').val(name);
        }

    })
    $('#finish-order-btn').on('click', function () {
        const fullName = $('#fullNameControl').val();
        const address = $('#addressControl').val();
        const street = $('#streetControl').val();
        const phone = $('#contactControl').val();
        const regexImePrezime = /(^[A-ZĐŠĆČ][a-zđšćč]{3,13}[\s][A-ZĐŠĆČ][a-zđšćč]{3,13}[\s]?([A-ZĐŠĆČ][a-zđšćč]{3,13})?)$/;
        const phoneRegex = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
        let errors = [];
        if (!regexImePrezime.test(fullName) || !fullName.length) {
            errors.push('1');
            $('#fullNameControlErr').removeClass('d-none');
            $('#fullNameControlErr').html('Niste uneli ime i prezime u željenom formatu, moraju početi velikim karakterima');
        } else {
            $('#fullNameControlErr').addClass('d-none');
        }
        if (!address.length) {
            errors.push('1');
            $('#addressControlErr').removeClass('d-none');
            $('#addressControlErr').html('Ime grada je obavezno');
        } else {
            $('#addressControlErr').addClass('d-none');
        }
        if (!street.length) {
            errors.push('1');
            $('#streetControlErr').removeClass('d-none');
            $('#streetControlErr').html('Ulica i broj su obavezni');
        } else {
            $('#streetControlErr').addClass('d-none');
        }
        if (!phoneRegex.test(phone) || !phone.length) {
            errors.push('1');
            $('#contactControlErr').removeClass('d-none');
            $('#contactControlErr').html('Niste uneli broj telefona željenom formatu');
        } else {
            $('#contactControlErr').addClass('d-none');
        }
        if (!errors.length) {
            localStorage.removeItem('cart');
            window.alert('Uspešno ste obavili kupovinu.');
            setTimeout(() => {
                $('#cart-table-box').show();
                $('#checkout-form').hide();
            }, 200)
            displayCart();
        }
    });
}