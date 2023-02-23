// function fetchData(filename, result) {
//     $.ajax({
//         url: "assets/data/" + filename,
//         method: "get",
//         dataType: "json",
//         success: result,
//         error: (err) => err
//     })
// }
//
// window.onload = () => {
//     fetchData("products.json", products => showProduct(products));
// };
//
// const showProduct = products => {
//     const url = new URL(window.location.href);
//     const id = Number(url.searchParams.get("id"));
//     const product = products.find(product => product.id === id);
//     const html = `<div class="col-3">
//                      <img src="${product.img.src}" alt="${product.img.alt}"/>
//                   </div>
//                   <div class="col-9">
//                      ${product.title}<br/>${product.description}
//                   </div>`
//     $('#product').html(html);
// }