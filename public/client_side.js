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
    $.get('http://localhost:3000/countdown_timer', (timer) => {
        var hours = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.values.tempo_restante % (1000 * 60)) / 1000);
        
        $('#countdown_time').text(hours + "h " + minutes + "m " + seconds + "s ")
    })
}

function reduce_reduce_deadline() {
    $.get('http://localhost:3000/reduce_deadline', (timer) => {
        console.log(timer);
    });
}

setInterval(get_countdown_time, 1000);