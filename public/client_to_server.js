$(document).ready(() => {

    // -----------------------SERVER INTERACTIONS------------------------ //
    //-----------------------POOL---------------------------//
    function get_pool() {
        $.get(window.location.protocol + "//" + window.location.host + '/get-pool', (pool) => {
            console.log(pool);
        });
    }

    function vote(voto) {
        $.post(window.location.protocol + "//" + window.location.host + '/vote', {
            user: user_id,
            ip: 1,
            voto: voto
        }, (response) => {
            console.log("user: ", response);
        });
    }
    //-----------------------USER---------------------------//
    function login() {
        var username = $('#username').val();
        var pwd = $('#pwd').val();
        $.post(window.location.protocol + "//" + window.location.host + '/login', {
            username: username,
            pwd: pwd
        }, (response) => {
            if(response.status !== "not found")
                user_id = response.status;
            console.log(response.status);     
        });
    }
    
    function get_user_by_id(user_id, callback) {
        $.post(window.location.protocol + "//" + window.location.host + '/user', {
            user_id: user_id,
        }, (user) => {
            callback(user)
        });
    }

    function split_pp(user_id, quant) {
        $.post(window.location.protocol + "//" + window.location.host + '/split', {
            user_id: user_id,
            pp_to_split: quant
        }, (response) => {
            console.log(response);
        })
    }
    //-----------------------TIMERS---------------------------//
    function reduce_deadline() {
        $.get(window.location.protocol + "//" + window.location.host + '/reduce_deadline', (timer) => {
            console.log(timer);
        });
    }

    function get_deadline() {

    }

    function get_countdown_timer(callback) {
        $.get(window.location.protocol + "//" + window.location.host + '/countdown_timer', (timer) => {
            cd_timer = timer;
            //console.log(cd_timer.values.tempo_restante);
            if(callback)
                callback();
        });
    }
    //-----------------------NAVE---------------------------//
    function get_nave_status() {
        $.get(window.location.protocol + "//" + window.location.host + '/nave', (nave) => {
            nave_status = nave.nave;
        });
    }
    //-----------------------UPDATE---------------------------//
    function get_essencials(callback) {
        $.post(window.location.protocol + "//" + window.location.host + '/essencials', { user_id: user_id }, (everything) => {
            callback(everything);
        });
    }

    function update() {
        if(cd_timer) {
            cd_timer.values.tempo_restante -= 300;
            if(cd_timer.values.tempo_restante <= 0) {
                cd_timer.values.tempo_restante = 0;
                get_countdown_timer();
                get_nave_status();
            } 
            else
                show_countdown_time(cd_timer);
        }
        show_altitude(nave_status.altitude);
        get_essencials((essencials) => {
            show_deadline(essencials.deadline);
            show_pool(essencials.pool);
        });
    }
    // -----------------------SERVER INTERACTIONS------------------------ //

    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    var user_id = '5b70b7beab615423d8261bab';
    var cd_timer;
    var nave_status;
    get_nave_status();
    var nave = new Nave(horse_json);
    //nave.animate("horse_run", true);

    setTimeout(() => {
        get_countdown_timer(() => {
            setInterval(update, 300);
        })
    }, 1000);
    // ------------------------SHOW VARIABLES-------------------------- //
    function show_countdown_time(timer) {
        var hours = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timer.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timer.values.tempo_restante % (1000 * 60)) / 1000);

        $('#countdown_time').text("TEMPO ATE FECHAR A VOTACAO: " + hours + "h " + minutes + "m " + seconds + "s ")
    }

    function show_deadline(deadline) {
        $('#deadline').text(deadline.values.deadline);
    }

    function show_altitude(altitude) {
        if( Number($("#altitude-nave").text()))
            if( Number($("#altitude-nave").text()) > altitude)
                nave.animate("horse_bend");
            else if ( Number($("#altitude-nave").text()) < altitude )
                nave.animate("horse_jump");

        $("#altitude-nave").text(altitude);
    }

    function show_pool(pool) {
        $("#pool_subir").text("SUBIR: " + pool.pool.subir);
        $("#pool_descer").text("DESCER: " + pool.pool.descer);
    }
    
    function show_user(user) {
        
    }
    // ------------------------WINDOW INTERACTIONS-------------------------- //
    $('#pool_status').on('click', get_pool);
    $('#login').on('click', login);
    $('#reduce_deadline').on('click', reduce_deadline);
    $('#split_pp').on('click', () => {
        split_pp(user_id, 1);
    });
    $('#vote_descer').on('click', () => {
        vote("descer"); 
    });
    $('#vote_subir').on('click', () => {
        vote("subir");
    });
    $(window).focus(function() {
        get_countdown_timer();
        get_nave_status();
    })
});