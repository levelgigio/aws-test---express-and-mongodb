var user_id;

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
        if(response.status !== "not found")
            user_id = response.status;
        console.log(response.status);     
    });
}

//NAO FUNCIONA
function update_slider() {
    $.post('/user', {
        user_id: user_id
    }, (user) => {
        $('#ip_spent').slider({
            max: user.ip
        });
        console.log(user);
    });
}

function vote(voto) {
    $.post('http://localhost:3000/vote', {
        user: user_id,
        ip: 1,
        voto: voto
    }, (response) => {
        /*if(response.status === "ok")
            update_slider();*/
            
        console.log(response);
    });
}

function show_countdown_time() {
    $.get('http://localhost:3000/countdown_timer', (timer) => {
        var hours = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.values.tempo_restante % (1000 * 60)) / 1000);
        
        $('#countdown_time').text("TEMPO ATE FECHAR A VOTACAO: " + hours + "h " + minutes + "m " + seconds + "s ")
    });
}

function reduce_reduce_deadline() {
    $.get('http://localhost:3000/reduce_deadline', (timer) => {
        console.log(timer);
    });
}

function show_deadline() {
    $.get('http://localhost:3000/deadline', (deadline) => {
        $('#deadline').text(deadline);
    });
}

function update() {
    show_countdown_time();
    show_deadline();
}


setInterval(update, 1000);