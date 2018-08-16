// TODO: LIMITAR O CORS PRO SITE FINAL
var cors = require('cors');
var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);

var io = socket(server);

var Mongo = require('./mongo.js');
var database = new Mongo();

var Game = require('./game.js');
var game = new Game();

game.set_database(database);
game.set_sockets(io);

database.connect((db) => {
    game.start(false);
});

io.sockets.on('connection', (socket) => {

    socket.on('login', (data) => {

        var user_credentials = {
            username: data.username,
            pwd: data.pwd
        };

        // funcao mongo retorna um objeto com status e possivelmente um id
        database.user_login(user_credentials, (response) => {
            console.log("user: ", response.user);
            if(response.status === "ok")
                database.get_essencials((essencials) => {
                    essencials.user = response.user;
                    essencials.user.id = response.user_id;
                    io.to(socket.id).emit('essencials', essencials);
                });
        });
    }); 


    socket.on('split', (data) => {
        database.split_pp(data.user_id, data.pp_to_split, (result) => {
            console.log(result.user);
            if(result.status === "ok")
                io.to(socket.id).emit('update_user', result.user);
            else
                console.log("not enough pp");
        });
    });

    socket.on('vote', (data) => {
        database.search_user_by_id(data.user_id, (user) => {
            // se tem, tira do usuario e coloca na pool
            if(user.ip >= data.ip_spent) {
                switch(data.voto) {
                    case "subir":
                        game.pool.subir(data.ip_spent);
                        break;
                    case "descer":
                        game.pool.descer(data.ip_spent);
                }
                //mongo function to update users ip
                database.user_spent_ip(data.user_id, data.ip_spent, () => {
                    user.ip = user.ip - data.ip_spent;
                    user.ip_spent = user.ip_spent + data.ip_spent;
                    io.to(socket.id).emit('update_user', {
                        status: "ok",
                        user: user
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
        });
    });

    socket.on('reduce', () => {
        game.get_deadline_timer().reduce_deadline();
        io.sockets.emit('update_deadline', {
            deadline: game.get_deadline_timer().get_timer().values
        });
    });

    socket.on('get_essencials', (data) => {
        database.get_essencials(data.user_id, (essencials) => {
            io.to(socket.id).emit('essencials', essencials);
        });
    });


});






var body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cors());

app.use(express.static('public'));

//----------------------------------INDEX-------------------------------------//
//var project_path = 'C:/Users/Giovanni/Documents/webdev/aws_test/';
app.get('/', (request, response) => {
    //response.sendFile(project_path + 'index.html');
});
//----------------------------------POOL-------------------------------------//
//----------------------------------USER-------------------------------------//
//----------------------------------TIMERS-------------------------------------//

//----------------------------------NAVE-------------------------------------//

//----------------------------------ESSENCIALS-------------------------------------//
