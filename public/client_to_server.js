$(document).ready(() => {
    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    //var nave = new Nave(horse_json);
    //nave.animate("horse_run", true);

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {},
        // Configuration options go here
        options: {}
    });

    var essencials = {};
    var user = {}
    var login_flag = false;
    if(sessionStorage.getItem("user_id"))
        login_flag = true;

    if(login_flag) {

        setInterval(update, 300);
        // -----------------------SERVER INTERACTIONS------------------------ //
        // -----------------------SOCKET-------------------- //
        var socket = io.connect(window.location.protocol + "//" + window.location.host);

        socket.emit('get_user', {
            user_id: sessionStorage.getItem("user_id")
        });
        socket.emit('get_essencials');
        socket.emit('get_chart');
        // -----------------------SOCKET RECEIVERS-------------------- //
        socket.on('update_pool', (response) => {
            essencials.game.pool = response.pool;
            //console.log("essencials: ", essencials);
        });

        socket.on('add_chart_point', (ponto) => {
            if(ponto)
                chart.data.datasets.forEach((dataset) => {
                    dataset.data.push(ponto);
                });
            chart.update();
        });

        socket.on('update_user', (response) => {
            if(response.status === "ok") {
                essencials.user = response.user;
                essencials.user.id = sessionStorage.getItem("user_id");
            }
        });

        socket.on('full_chart', (response) => { 
            console.log("chart: ", response);
            var labels = [1, 2, 4];
            var data = [20, 40, 60];

            /*for (var i = 0; i < response.chart.length; i++) {
                labels.push(response.chart[i].x);
                data.push(response.chart[i].y);
            }*/

            chart.data.labels.pop();
            chart.data.labels.push(labels);
            
            chart.data.datasets.push({
                data: data});
            
            chart.update();
            
            console.log(chart);
        });

        socket.on('update_nave', (response) => {
            essencials.game.nave = response.nave;
        });

        socket.on('update_deadline', (response) => {
            essencials.game.deadline = response.deadline;
        });

        socket.on('update_countdown', (response) => {
            essencials.game.countdown = response.countdown;
        });

        socket.on('essencials', (cessencials) => {
            essencials.game = cessencials;
            console.log("essencials: ", essencials);
        });
        //-----------------------POOL---------------------------//
        function vote(voto) {
            socket.emit('vote', {
                user_id: essencials.user.id,
                ip_spent: 1,
                voto: voto
            });
        }
        //-----------------------USER---------------------------//
        function split_pp(user_id, quant) {
            socket.emit('split', {
                user_id: user_id,
                pp_to_split: quant
            });
        }
        //-----------------------TIMERS---------------------------//
        function reduce_deadline() {
            socket.emit('reduce');
        }
        //-----------------------CHART---------------------------//
        // -----------------------SERVER INTERACTIONS------------------------ //
        //-----------------------UPDATE---------------------------//
        function update() {
            show_nave(essencials.game.nave);
            show_pool(essencials.game.pool);
            show_deadline(essencials.game.deadline);
            show_countdown_time(essencials.game.countdown);
        }
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
            /*if( Number($("#altitude-nave").text()))
                if( Number($("#altitude-nave").text()) > cnave.altitude)
                    nave.animate("horse_bend");
                else if ( Number($("#altitude-nave").text()) < cnave.altitude )
                    nave.animate("horse_jump");
                    */
            $("#altitude-nave").text(cnave.altitude);
        }

        function show_pool(pool) {
            $("#pool_subir").text("SUBIR: " + pool.subir);
            $("#pool_descer").text("DESCER: " + pool.descer);
        }

        function show_user(user) {

        }
        // ------------------------CHART-------------------------- //
        // ------------------------WINDOW INTERACTIONS-------------------------- //
        $('#reduce_deadline').on('click', reduce_deadline);
        $('#split_pp').on('click', () => {
            split_pp(essencials.user.id, 1);
        });
        $('#vote_descer').on('click', () => {
            vote("descer"); 
        });
        $('#vote_subir').on('click', () => {
            vote("subir");
        });
        $(window).focus(() => {
            socket.emit('get_essencials');
        });
    }
});