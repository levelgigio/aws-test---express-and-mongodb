$(document).ready(() => {
    // -----------------------CLIENT VARIABLES AND GAME-------------------- //
    //var nave = new Nave(horse_json);
    //nave.animate("horse_run", true);

    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        orange_red: 'rgb(255, 69, 0)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    var color = Chart.helpers.color;

    var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    var barChartData = {
        labels: [],
        datasets: [{
            label: 'Altitude',
            backgroundColor: color(chartColors.orange_red).alpha(0.5).rgbString(),
            borderColor: chartColors.orange_red,
            borderWidth: 1,
            data: []
        }]
    };

    var ctx = $('#canvas')[0].getContext('2d');
    var myBar = new Chart(ctx, {
        type: 'line',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Altitude no decorrer do jogo'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        stepSize: 20
                    }
                }]
            }
        }
    });

    var date = new Date(); //pra evitar criar toda hora no deadline timer
    var essencials = {};


    setInterval(update, 300);
    // -----------------------SERVER INTERACTIONS------------------------ //
    // -----------------------SOCKET-------------------- //
    var socket = io.connect(window.location.protocol + "//" + window.location.host);

    socket.emit('get_essencials');
    socket.emit('get_chart');
    // -----------------------SOCKET RECEIVERS-------------------- //
    socket.on('update_pool', (response) => {
        essencials.game.pool = response.pool;
    });

    socket.on('add_chart_point', (ponto) => {
        var data = new Date();
        data.setTime(ponto.x);
        barChartData.labels.push(data.getDate() + "/" + (data.getMonth()+1));
        barChartData.datasets[0].data.push(ponto.y);
        if(barChartData.datasets[0].data.length > 200)
            barChartData.datasets[0].data.splice(0, 1);
        myBar.update();
        $(".chartWrapper").scrollLeft($(".chartAreaWrapper").width);
    });

    socket.on('full_chart', (response) => { 
        var data = new Date();
        for(var i = response.chart.length, j = 0; i > response.chart.length - 200; i--, j++) {
            if(j === response.chart.length)
                break;
            data.setTime(response.chart[i-1].x);
            barChartData.labels.push(data.getDate() + "/" + (data.getMonth()+1));
            barChartData.datasets[0].data.push(response.chart[i-1].y);
        }
        myBar.update();
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
        console.log("essencials", essencials);
    });
    //-----------------------PRIZE---------------------------//
    socket.on('update_prize', (response) => {
        essencials.game.prize = response.prize;
    });
    //-----------------------CHART---------------------------//
    // -----------------------SERVER INTERACTIONS------------------------ //
    //-----------------------UPDATE---------------------------//
    function update() {
        show_nave(essencials.game.nave);
        show_background(essencials.game.nave);
        show_pool(essencials.game.pool);
        show_prize(essencials.game.prize);
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

        $('#countdown_time').text("FIM DA VOTACAO EM: " + hours + "h" + minutes + "m" + seconds + "s")
    }

    function show_deadline(deadline) {
        date.setTime(deadline.deadline);
        $('#deadline').text("DEADLINE: " + date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + "h" + date.getMinutes() + "m" + date.getSeconds() + "s");
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
    function show_background(nave) {
        if(nave.altitude > 0)
            $(".jumbotron").attr("style", "background-color: #FAFFB2");
        else if(nave.altitude < 0)
            $(".jumbotron").attr("style", "background-color: #242A2C");
        else
            $(".jumbotron").attr("style", "background-color: #C9CACC");
    }

    function show_pool(pool) {
        $("#pool_subir").text("SUBIR: " + pool.subir);
        $("#pool_descer").text("DESCER: " + pool.descer);
    }

    function show_prize(prize) {
        $("#prize_pot").text(prize);
    }

    // ------------------------CHART-------------------------- //
    // ------------------------WINDOW INTERACTIONS-------------------------- //
    $(window).focus(() => {
        socket.emit('get_essencials');
    });
});