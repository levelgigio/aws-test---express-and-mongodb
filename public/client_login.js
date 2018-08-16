$(document).ready(() => {
    function login() {
        var username = $('#username').val();
        var pwd = $('#pwd').val();
        $.post(window.location.protocol + "//" + window.location.host + '/login', {
            username: username,
            pwd: pwd
        }, (response) => {
            if(response.status === "ok") {
                sessionStorage.setItem("user_id", response.user_id);
                window.location.href = "game.html"
            }
            else
                alert("usuario nao encontrado");
        });
    }
    $('#login').on('click', login);
});