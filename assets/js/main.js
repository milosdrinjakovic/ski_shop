window.onload = () => {
    let brands = [];
    let categories = [];
    let genders = [];
    let products = [];

    fetchData("menu", displayMenu)
    fetchData("brands", displayBrands);
    fetchData("genders", displayGenders);
    fetchData("categories", displayCategories);
    setTimeout(() => {
        fetchData("products", displayProducts);
    }, 500)
    $('#sort').change(filterChange);

    $("#tbSearch").keyup(filterChange);
    $("#tbSearch").on('click', filterChange);

    function fetchData(file, callBack) {
        $.ajax({
            url: "assets/data/" + file + ".json",
            method: "get",
            dataType: "json",
            success: (response) => callBack(response),
            error: (xhr) => xhr
        })
    }

    function htmlCheckBox(data, name, divId) {
        let html = ""
        data.forEach(el => {
            html += `
            <div class="form-check">
            <input class="form-check-input" type="checkbox" name="${name}" value="${el.id}" />
            <label class="form-check-label" for="flexCheckDefault">${el.value} (<span id="${name}-${el.id}">0</span>)</label>
            </div>`
        })
        $(divId).html(html)
    }

    function setCheckBoxCount(items, data, name, property) {
        items.forEach(item => {
            const count = data.filter(product => product[property] === item.id).length;
            $(`#${name}-${item.id}`).text(count)
        });
    }

    function displayBrands(data) {
        htmlCheckBox(data, "filterBrands", "#brands", 'brandId');
        brands = data;
        $("input[name=filterBrands]").change(filterChange)
    }

    function displayCategories(data) {

        htmlCheckBox(data, "filterCategories", "#categories", 'categoryId');

        categories = data;
        $("input[name=filterCategories]").change(filterChange)
    }

    function returnCategory(ids) {
        const category = categories.find(x => ids === x.id);
        return category ? category.value : '';
    }

    function returnBrand(ids) {
        const brand = brands.find(x => ids === x.id);
        return brand ? brand.value : '';
    }

    function returnGender(ids) {
        const gender = genders.find(x => ids === x.id);
        return gender ? gender.value : '';
    }

    function displayGenders(data) {

        htmlCheckBox(data, "filterGenders", "#genders", 'gender');
        genders = data;
        $("input[name=filterGenders]").change(filterChange)

    }

    function displayProducts(data) {
        products = data;
        data = brandFilter(data);
        data = categoryFilter(data);

        data = genderFilter(data);
        data = sort(data);
        data = filterSearch(data);
        setCheckBoxCount(brands, data, "filterBrands", 'brandId');
        setCheckBoxCount(categories, data, "filterCategories", 'categoryId');
        setCheckBoxCount(genders, data, "filterGenders", 'gender');
        let html = "";

        data.forEach(el => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = cart.find(item => item.id === el.id);
            const count = cartItem ? cartItem.count : 1;
            html += `<div class="col-6 col-lg-3 pb-3">
                <div class="card product-card">
                    <img src="${el.img.src}" alt="${el.img.alt}"
                         class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <h6 class="card-title">${returnCategory(el.categoryId)}</h6>
                        <p class="card-text"></p>
                        <span class="price">${el.price.newPrice}<small class="h6">RSD</small> </span>
                        <s class="text-danger">${el.price.oldPrice}<small class="h6">RSD</small></s>
                    </div>
                    <div class="card-body col">
                        <div class="d-grid gap-2 mt-2">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal${el.id}" class="btn btn-primary">Pogledaj</button>
                            <button id="${el.id}" class="btn btn-primary card-link add-cart-btn-1">Kupi</button>
                        </div>
                    </div>
                    <div class="card-body col" id="add-to-cart-${el.id}" style="display: none">
                        <label for="exampleFormControlInput1" class="form-label">Količina</label>
                        <input type="number" id="count-${el.id}" class="form-control" id="exampleFormControlInput1" value="${count}">
                        <div class="d-grid gap-2 mt-2">
                          <button data-id="${el.id}" class="btn btn-primary add-cart-btn" type="button">Dodaj u korpu</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="exampleModal${el.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${el.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <img src="${el.img.src}" alt="${el.img.alt}"
                         class="card-img-top">
                    <p class="card-title">Kategorija: <h4>${returnCategory(el.categoryId)}</h4></p>
                    <p class="card-title">Brend: <h4>${returnBrand(el.categoryId)}</h4></p>
                    <p class="card-title">Pol: <h4>${returnGender(el.gender)}</h4></p>
                    <span>Cena:</span>
                    <p>
                        <span class="price">${el.price.newPrice}<small class="h6">RSD</small></span><br/>
                        <s class="text-danger">${el.price.oldPrice}<small class="h6">RSD</small></s>
                    </p>
                    
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                    <button data-id="${el.id}" class="btn btn-primary card-link add-cart-btn-2">Kupi</button>
                  </div>
                </div>
              </div>
            </div>`
        });
        $("#products").html(html || 'Nema rezultata.');
        $('.add-cart-btn-1').each(function () {
            $(this).on('click', function () {
                if (!localStorage.getItem('authenticatedUser')) {
                    window.alert('Samo autorizovani korisnici mogu dodati proizvod u korpu.');
                    return;
                }
                const id = Number($(this).attr('id'));
                $(`#add-to-cart-${id}`).show();
            });
        })

        $('.add-cart-btn').each(function () {
            $(this).on('click', function () {
                if (!localStorage.getItem('authenticatedUser')) {
                    window.alert('Samo autorizovani korisnici mogu dodati proizvod u korpu.');
                    return;
                }
                const id = Number($(this).attr('data-id'));
                const count = $(`#count-${id}`).val();
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const product = products.find(product => product.id === id);
                const cartItem = cart.find(item => item.id === product.id);
                if (cartItem) {
                    cartItem.count = count;
                } else {
                    cart.push({...product, count});
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                $('#cart').text(cart.length)
                window.alert('Proizvod uspešno dodat u korpu.')
            });
        })

        $('.add-cart-btn-2').each(function () {
            $(this).on('click', function () {
                if (!localStorage.getItem('authenticatedUser')) {
                    window.alert('Samo autorizovani korisnici mogu dodati proizvod u korpu.');
                    return;
                }
                const id = Number($(this).attr("data-id"));
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const product = products.find(product => product.id === id);
                const cartItem = cart.find(item => item.id === product.id);
                if (cartItem) {
                    cartItem.count = cartItem.count + 1;
                } else {
                    cart.push({...product, count: 1});
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                $('#cart').text(cart.length)
                window.alert('Proizvod uspešno dodat u korpu.')
            });
        })
    }

    function brandFilter(data) {
        let selectedItems = [];
        $('input[name=filterBrands]:checked').each(function (el) {
            selectedItems.push(parseInt($(this).val()));
        });
        if (selectedItems.length != 0) {
            return data.filter(x => selectedItems.includes(x.brandId));
        }
        return data;

    }

    function categoryFilter(data) {
        let selectedItems = [];
        $('input[name=filterCategories]:checked').each(function (el) {
            selectedItems.push(parseInt($(this).val()));
        });
        // if(selectedItems.length != 0 && (data.filter(x => selectedItems.includes(x.categoryId))).length == 0){
        //         $("#divNoProducts").css("visibility",": visible")
        //
        // }
        if (selectedItems.length != 0) {
            return data.filter(x => selectedItems.includes(x.categoryId));
        }
        return data;
    }

    function filterChange() {
        fetchData("products", displayProducts);

    }

    function genderFilter(data) {
        let selectedItems = [];
        $('input[name=filterGenders]:checked').each(function (el) {
            selectedItems.push(parseInt($(this).val()));
        });
        if (selectedItems.length != 0) {

            return data.filter(x => selectedItems.includes(x.gender));

        }
        return data;
    }

    function sort(data) {
        const sortType = document.getElementById('sort').value;
        if (sortType == 'Asc') {
            return data.sort((a, b) => a.price.newPrice > b.price.newPrice ? 1 : -1);
        }
        if (sortType == 'Desc') {
            return data.sort((a, b) => a.price.newPrice < b.price.newPrice ? 1 : -1);
        }
        if (sortType == 'a-z') {
            return data.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
        }
        if (sortType == 'z-a') {
            return data.sort((a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1);

        }
        return data
    }

    function filterSearch(data) {
        let searchInput = document.querySelector("#tbSearch").value

        if (searchInput != 0)
            return data.filter(x => x.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)

        return data;

    }

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