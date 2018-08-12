$(document).ready(() => {

    // -----------------------SERVER INTERACTIONS------------------------ //
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

            console.log("aqui? ", response);
        });
    }

    function show_countdown_time(timer) {
        var hours = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.values.tempo_restante % (1000 * 60)) / 1000);

        $('#countdown_time').text("TEMPO ATE FECHAR A VOTACAO: " + hours + "h " + minutes + "m " + seconds + "s ")
    }

    function reduce_deadline() {
        $.get('http://localhost:3000/reduce_deadline', (timer) => {
            //console.log(timer);
        });
    }

    function show_deadline(deadline) {
        $('#deadline').text(deadline.values.deadline);
    }

    function show_altitude(updated_nave) {
        var altitude = updated_nave.nave.altitude;

        if( Number($("#altitude-nave").text()))
           if( Number($("#altitude-nave").text()) > altitude)
                nave.animate("horse_bend");
            else if ( Number($("#altitude-nave").text()) < altitude )
                nave.animate("horse_jump");

        $("#altitude-nave").text(altitude);
    }

    function get_nave() {
        $.get('http://localhost:3000/nave', (nave) => {

        });
    }

    function get_deadline() {

    }

    function get_countdown_timer() {

    }

    function get_everything(callback) {
        $.post('http://localhost:3000/everything', { user_id: user_id }, (everything) => {
            callback(everything);
        });
    }

    function update() {
        get_everything((everything) => {
            show_countdown_time(everything.timers[0]);
            show_deadline(everything.timers[1]);
            show_altitude(everything.nave);
        });

    }
    // -----------------------SERVER INTERACTIONS------------------------ //

    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    var user_id = '5b6cdd1e1879441f10bb345f';
    var nave = new Nave(horse_json);
    nave.animate("horse_run", true);

    update();
    setInterval(update, 300);
    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    
    // ------------------------WINDOW INTERACTIONS-------------------------- //
    $('#pool_status').on('click', get_pool);
    $('#login').on('click', login);
    $('#reduce_deadline').on('click', reduce_deadline);
    $('#vote_descer').on('click', () => {
        vote("descer") 
    });
    $('#vote_subir').on('click', () => {
        vote("subir")
    });
    // ------------------------WINDOW INTERACTIONS-------------------------- //
});