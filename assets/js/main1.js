function fetchData(filename, result) {
    $.ajax({
        url: "assets/data/" + filename,
        method: "get",
        dataType: "json",
        success: result,
        error: err => err
    })
}

let categories = [];
window.onload = () => {
    fetchData("brands.json", function (result) {
        showCheckBoxes(result, "#brands", "filterBrands");
    })
    fetchData("categories.json", function (result){
        categories.push(...result);
    })
    fetchData("categories.json", result => showCheckBoxes(result, "#categories", "filterCategories"))
    fetchData("products.json", result => showProducts(result))
    fetchData("genders.json", result => showCheckBoxes(result, "#genders", "filterGenders"))
}


function showCheckBoxes(data, divId, name) {
    let html = "";
    data.forEach(el => {
        html += `<div class="form-check">
  <input class="form-check-input" type="checkbox" name="filterCategories" value="${el.id}" />

  
  <label class="form-check-label " for="flexCheckDefault">${el.value}</label>
</div>`
    })

    $('input[name=filterCategories]').change(filterChange);
    $('input[name=filterBrands]').change(filterChange);
    $('input[name=filterGenders]').change(filterChange)



    $(divId).html(html);

}

function showProducts(data) {
    let html = "";
    data = filterChange(data);
    data.forEach(el => {
        html += `<div class="col-3 pb-3">
                <div class="card product-card">
                    <img src="${el.img.src}" alt="${el.img.alt}"
                         class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <p class="card-text"></p>
                        <p class="">${el.price.newPrice} <s>${el.price.oldPrice}</s></p>

                    </div>
                    <div class="card-body">
                        <a href="product.html?id=${el.id}" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>
            </div>`

        $("#products").html(html);
    })
}

function filter(data){
    let selectedCategories = [];
    console.log(selectedCategories);
    $('input[name=filterCategories]:checked').each(function(el){
        selectedCategories.push(parseInt($(this).val()));
    });
    if(selectedCategories.length != 0){
        return data.filter(x => selectedCategories.includes(x.categoryId));
    }
    return data;
}

function filterChange(data) {

}