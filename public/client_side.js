var user_id = '5b6cdd1e1879441f10bb345f';

function get_pool() {
    $.get('http://localhost:3000/get-pool', (pool) => {
        console.log(pool);
    });
}

function login() {
    var username = $('#username').val();
    var pwd = $('#pwd').val();
    $.post('http://localhost:3000/login', {
        username: username,
        pwd: pwd
    }, (response) => {
        console.log(response);
    });
}

function vote() {
    $.post('http://localhost:3000/vote', {
        user: user_id,
        ip: 2,
        voto: "descer"
    }, (response) => {
        console.log(response);
    });
}

function get_countdown_time() {
    $.get('http://localhost:3000/countdown_timer', (time) => {
        var hours = Math.floor((time.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((time.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((time.values.tempo_restante % (1000 * 60)) / 1000);
        console.log(hours + "h " + minutes + "m " + seconds + "s ");
    })
}