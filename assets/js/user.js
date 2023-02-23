const cart = JSON.parse(localStorage.getItem('cart')) || [];
$('#cart').text(cart.length)
const user = localStorage.getItem('authenticatedUser');
if (user) {
    const name = JSON.parse(user).nameSurname
    const initials = name.split(' ').map(name => name.charAt(0)).join('');
    $('#user-initials').text(initials);
    $('#fullName').text(name);
    $('#unauthenticated-avatar').hide();
    $('#unauthenticated-register-avatar').hide();
} else {
    $('#authenticated-avatar').hide();
}
const logout = () => {
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('cart');
    window.location.replace('index.html')
}
$('#logout').on('click', logout);