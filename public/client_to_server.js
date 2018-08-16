$(document).ready(() => {

    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    var nave = new Nave(horse_json);
    nave.animate("horse_run", true);
    var essencials;

    setTimeout(() => {
        setInterval(update, 300);
    }, 1000);
    // -----------------------SERVER INTERACTIONS------------------------ //
    // -----------------------SOCKET-------------------- //
    var socket = io.connect(window.location.protocol + "//" + window.location.host);

    // -----------------------SOCKET RECEIVERS-------------------- //
    socket.on('update_pool', (response) => {
        if(essencials)
            essencials.pool = response.pool;
        console.log("pool: ", response.pool);
    });

    socket.on('update_user', (response) => {
        //atualizar o objeto enorme que loopa mostrando na tela (update)
        if(essencials)
            essencials.user = response.user;
        console.log("user: ", response.user);
    });

    socket.on('update_nave', (response) => {
        //atualizar o objeto enorme que loopa mostrando na tela (update)
        if(essencials)
            essencials.nave = response.nave;
        console.log("nave: ", response.nave);
    });

    socket.on('update_deadline', (response) => {
        //atualizar o objeto enorme que loopa mostrando na tela (update)
        if(essencials)
            essencials.deadline = response.deadline;
        console.log("deadline: ", response.deadline);
    });

    socket.on('update_countdown', (response) => {
        //atualizar o objeto enorme que loopa mostrando na tela (update)
        if(essencials)
            essencials.countdown = response.countdown;
        console.log("countdown: ", response.countdown);
    });

    socket.on('essencials', (cessencials) => {
        //atualizar o objeto enorme que loopa mostrando na tela (update)
        essencials = cessencials;
        console.log("essencials: ", cessencials);
    })
    //-----------------------POOL---------------------------//
    function vote(voto) {
        if(essencials)
            socket.emit('vote', {
                user_id: essencials.user.id,
                ip_spent: 1,
                voto: voto
            });
    }
    //-----------------------USER---------------------------//
    function login() {
        var username = $('#username').val();
        var pwd = $('#pwd').val();
        socket.emit('login', {
            username: username,
            pwd: pwd
        });
    }

    function split_pp(user_id, quant) {
        if(essencials)
            socket.emit('split', {
                user_id: user_id,
                pp_to_split: quant
            });
    }
    //-----------------------TIMERS---------------------------//
    function reduce_deadline() {
        socket.emit('reduce');
    }
    //-----------------------NAVE---------------------------//
    //-----------------------UPDATE---------------------------//

    function update() {
        console.log(essencials);
        if(essencials) {
            show_nave(essencials.nave);
            show_pool(essencials.pool);
            show_deadline(essencials.deadline);
            show_countdown_time(essencials.countdown);
        }
    }
    // -----------------------SERVER INTERACTIONS------------------------ //

    // ------------------------SHOW VARIABLES-------------------------- //
    function show_countdown_time(timer) {
        timer.tempo_restante -= 300;
        if (timer.tempo_restante <= 0)
            timer.tempo_restante = 0;
        var hours = Math.floor((timer.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timer.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.tempo_restante % (1000 * 60)) / 1000);

        $('#countdown_time').text("TEMPO ATE FECHAR A VOTACAO: " + hours + "h " + minutes + "m " + seconds + "s ")
    }

    function show_deadline(deadline) {
        $('#deadline').text(deadline.deadline);
    }

    function show_nave(cnave) {
        if( Number($("#altitude-nave").text()))
            if( Number($("#altitude-nave").text()) > cnave.altitude)
                nave.animate("horse_bend");
            else if ( Number($("#altitude-nave").text()) < cnave.altitude )
                nave.animate("horse_jump");

        $("#altitude-nave").text(cnave.altitude);
    }

    function show_pool(pool) {
        $("#pool_subir").text("SUBIR: " + pool.subir);
        $("#pool_descer").text("DESCER: " + pool.descer);
    }

    function show_user(user) {

    }
    // ------------------------WINDOW INTERACTIONS-------------------------- //
    $('#login').on('click', login);
    $('#reduce_deadline').on('click', reduce_deadline);
    $('#split_pp').on('click', () => {
        if(essencials)
            split_pp(essencials.user.id, 1);
    });
    $('#vote_descer').on('click', () => {
        vote("descer"); 
    });
    $('#vote_subir').on('click', () => {
        vote("subir");
    });
    /*$(window).focus(function() {
        if(essencials)
            socket.emit('get_essencials', {
                user_id: essencials.user.id
            });
    })*/
});