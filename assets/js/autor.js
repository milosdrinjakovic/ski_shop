function fetchData(file, callBack) {
    $.ajax({
        url: "assets/data/" + file + ".json",
        method: "get",
        dataType: "json",
        success: (response) => callBack(response),
        error: (xhr) => xhr
    })
}
fetchData("menu",displayMenu)
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
