// TODO: LIMITAR O CORS PRO SITE FINAL
var cors = require('cors');
var path = require('path');
var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);

var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cors());

app.use(express.static('public'));

var io = socket(server);

var Mongo = require('./mongo.js');
var database = new Mongo();

var Game = require('./game.js');
var game = new Game();

game.set_database(database);
game.set_sockets(io);

database.connect((db) => {
    game.start(false); // FLAG TO RESET STUFF IN THE DB
});

//----------------------------------USER-------------------------------------//
app.post('/login', (request, response) => {
    database.user_login(request.body.profile_id, (user) => {
        response.send(user);
    }); 
});


// ---------------------ADMIN------------------- //
app.post('/giveppf0af17449a83681de22db7ce16672f16f3731bec002237d4ace5d1854301e0', (request, response) => {
    database.user_bought_pp(request.body.user_id, request.body.quant);
    database.increase_prize(request.body.quant/2, () => {
        var prize_atual;
        game.database.get_prize((prize) => {
            prize_atual = prize;
            console.log("prize atual " + prize_atual);
            game.get_sockets().emit('update_prize', {
                prize: prize_atual
            });
        });
    });
});
// ---------------------SOCKETS------------------- //
io.sockets.on('connection', (socket) => {
    // ---------------------USER------------------- //
    socket.on('daily_guess', (data) => {
        if(data) 
            if(!isNaN(data.guess_min))
                database.user_daily_guess(data.user_id, data.guess_min, game.get_guess_range(), (response) => {
                    if(response.status === "ok")
                        io.to(socket.id).emit('update_user', {
                            status: "ok",
                            user: response.user
                        });
                    else
                        io.to(socket.id).emit('status_error', response.status);
                });

    });

    socket.on('final_guess', (data) => {
        if(data) 
            if(!isNaN(data.guess_min))
                database.user_final_guess(data.user_id, data.guess_min, game.get_guess_range(), (response) => {
                    if(response.status === "ok")
                        io.to(socket.id).emit('update_user', {
                            status: "ok",
                            user: response.user
                        });
                    else
                        io.to(socket.id).emit('status_error', response.status);
                });


    });

    /*socket.on('login', (data) => {
        if(data) {
            var user_credentials = {
                username: data.username,
                pwd: data.pwd
            };
            // funcao mongo retorna um objeto com status e possivelmente um id
            database.user_login(user_credentials, (response) => {
                if(response.status === "ok")
                    database.get_essencials((essencials) => {
                        essencials.user = response.user;
                        essencials.user.id = response.user_id;
                        io.to(socket.id).emit('essencials', essencials);
                    });
            });
        }
        else
            console.log("SOCKET DATA INVALID");
    }); */

    socket.on('get_user', (data) => {
        if(data)
            database.search_user_by_id(data.user_id, (response) => {
                if(response.status === "ok")
                    io.to(socket.id).emit('update_user', {
                        status: "ok",
                        user: response.user
                    });
            });
        else
            console.log("SOCKET DATA INVALID");
    });

    socket.on('get_chart', () => {
        io.to(socket.id).emit('full_chart', {
            chart: game.get_chart().get_pontos()
        });
    });

    socket.on('split', (data) => {
        if(data)
            database.split_pp(data.user_id, data.pp_to_split, (result) => {
                if(result.status === "ok")
                    io.to(socket.id).emit('update_user', {
                        status: "ok",
                        user: result.user
                    });
                else
                    console.log("not enough pp");
            });
        else
            console.log("SOCKET DATA INVALID");
    });

    // ---------------------POOL------------------- //
    socket.on('vote', (data) => {
        if(data)
            database.search_user_by_id(data.user_id, (result) => {
                if(result.status === "ok") {
                    // se tem, tira do usuario e coloca na pool
                    if(result.user.ip >= data.ip_spent) {
                        switch(data.voto) {
                            case "subir":
                                game.pool.subir(data.ip_spent);
                                break;
                            case "descer":
                                game.pool.descer(data.ip_spent);
                        }
                        //mongo function to update users ip
                        database.user_spent_ip(data.user_id, data.ip_spent, () => {
                            result.user.ip = result.user.ip - data.ip_spent;
                            result.user.ip_spent = result.user.ip_spent + data.ip_spent;
                            io.to(socket.id).emit('update_user', {
                                status: "ok",
                                user: result.user
                            });
                            io.sockets.emit('update_pool', {
                                pool: game.get_pool()
                            });
                        });
                    } 
                    else
                        io.to(socket.id).emit('update_user', {
                            status: "not enough ip"
                        });
                }
            });
        else
            console.log("SOCKET DATA INVALID");
    });
    // ---------------------TIMERS------------------- //
    // TODO: user has to spend pp
    socket.on('reduce', (data) => {
        if(data)
            database.search_user_by_id(data.user_id, (result) => {
                if(result.status === "ok") {
                    // se tem, tira do usuario e coloca na pool
                    if(result.user.ip > 0) {
                        game.get_deadline_timer().reduce_deadline();
                        io.sockets.emit('update_deadline', {
                            deadline: game.get_deadline_timer().get_timer().values
                        });
                        database.user_spent_ip(data.user_id, 1, () => {
                            result.user.ip -= 1;
                            result.user.ip_spent += 1;
                            io.to(socket.id).emit('update_user', {
                                status: "ok",
                                user: result.user
                            });
                        });
                    }
                    else
                        io.to(socket.id).emit('update_user', {
                            status: "not enough ip"
                        });
                }
            });
    });

    socket.on('get_essencials', () => {
        database.get_essencials((essencials) => {
            io.to(socket.id).emit('essencials', essencials);
        });
    });
});