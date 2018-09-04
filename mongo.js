// TODO: ELSE IF(ARRAY) NOS FIND.TOARRAY

module.exports = class Mongo {

    constructor() {
        this.mongo = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId; 

        this.db; // RECEBE A DATABASE E MANTEM A CONEXAO ABERTA (ver this.connect)
        this.essencials_obj = {};
    }

    //------------------------POOL---------------------------//
    get_pool(callback) {
        this.db.db('prizeship').collection('pool').find( { pool: { $exists: true } }).toArray( (error, array) => {
            if(error)
                console.log("error: ", error);
            else if(callback) {
                if(array.length)
                    callback(array[0].pool); // precisa existir apenas um objeto com a key "pool"
                else
                    console.log("MONGO NAO ACHOU A POOL");
            }
            else
                console.log("CALLBACK INVALIDA");
        });
    } 

    save_pool(cpool) {
        this.db.db('prizeship').collection('pool').update( { pool: {$exists: true}}, {$set : {pool : cpool}});
    }
    //-----------------------------USER------------------------------//
    // testar, se funfar, arrumar a pool_state pq ta usando find em vez de findOne
    search_user_by_id(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.db.db('prizeship').collection('users').find( { _id: id } ).toArray( (error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
            else if(callback) {
                if(array.length)
                    callback({
                        status: "ok",
                        user: array[0].user
                    });
                else
                    callback({
                        status: "user not found"
                    });
            }
            else
                console.log("CALLBACK INVALIDA");
        });
    }
    
    user_final_guess(guess_min) {
        
    }

    update_user(user_id, user) {
        var id = new this.ObjectId(user_id);
        if(user && user_id)
            this.db.db('prizeship').collection('users').update( { _id : id}, {$set: {user: user}});
    }

    user_spent_ip(user_id, quant, callback) {
        if(user_id && quant) {
            var id = new this.ObjectId(user_id);
            this.db.db('prizeship').collection('users').update( { _id : id}, {$inc: {"user.ip": -quant, "user.ip_spent": quant}});
            if (callback)
                callback();
        } 
    }

    user_bought_pp(user_id, quant) {
        if(user_id && quant) {
            var id = new this.ObjectId(user_id);
            this.db.db('prizeship').collection('users').update( { _id : id}, {$inc: {"user.pp": Number(quant)}} );
        }   
    }

    user_login(profile_id, callback) {
        if(profile_id) {
            this.db.db('prizeship').collection('users').find( {"secret.profile_id": profile_id} ).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
                else if(callback)
                    if(array.length)
                        callback({
                            status: "returning",
                            user: array[0].user,
                            user_id: array[0]._id
                        });
                    else
                        this.db.db('prizeship').collection('users').insert({
                            secret: {
                                profile_id: profile_id,
                                entry_date: new Date().getTime()
                            },
                            user: {
                                ip: 0,
                                ip_spent: 0,
                                pp: 0,
                                pp_spent: 0,
                                daily_guess_min: 0,
                                final_guess_min: 0
                            }
                        }, (error, obj) => {
                            callback({
                                status: "new",
                                user: obj.user,
                                user_id: obj._id
                            });
                        });
                else
                    console.log("CALLBACK INVALIDA");
            });
        }
    }

    distribute_ip_winners(pool) {

    }

    split_pp(user_id, quant, callback) {
        if(user_id && quant) {
            this.search_user_by_id(user_id, (response) => {
                if(callback)
                    if(response.status === "ok")
                        if(response.user.pp >= quant) {
                            response.user.pp -= quant;
                            response.user.pp_spent += quant;
                            response.user.ip += quant*10;
                            this.update_user(user_id, response.user);
                            callback({
                                status: "ok",
                                user: response.user
                            });
                        } 
                        else
                            callback({
                                status: "not enough pp"
                            });
                    else
                        callback({
                            status: "user not found"
                        });
                else
                    console.log("CALLBACK INVALIDA");
            });
        }
    }
    //---------------------------TIMERS---------------------------------//
    // TODO: TALVEZ TIRAR O UPSERT
    save_time(timer) {
        if(timer)
            this.db.db('prizeship').collection('timers').update({timer_label: timer.timer_label}, {$set: {values: timer.values}}, {upsert: true}, (error) => {
                if(error)
                    console.log("ERRO AO SALVAR TIMERS: ", err);
            });
        else
            console.log("SAVING UNDEFINED TIMER");
    }

    get_timer(label, callback) {
        if(label)
            this.db.db('prizeship').collection('timers').find( { timer_label: label }).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS TIMERS", error);
                else
                    if(array.length)
                        if(callback)
                            callback(array[0]);
                        else
                            console.log("CALBACK INVALIDA");
                else
                    console.log("TIMER NOT FOUND");
            });
        else
            console.log("LABEL INVALIDA");
    }
    //----------------------------------NAVE-------------------------------------//
    get_nave(callback) {
        this.db.db('prizeship').collection('nave').find( { nave: {$exists: true} } ).toArray((error, array) => {
            if(error)
                console.log("ERRO AO PASSAR PRA ARRAY A NAVE", error);
            else
                if(array.length)
                    if(callback)
                        callback(array[0].nave);
                    else
                        console.log("CALBACK INVALIDA");
            else
                console.log("NAVE NOT FOUND");
        });
    }

    save_nave(nave) {
        if(nave)
            this.db.db('prizeship').collection('nave').update( { nave: {$exists: true}}, {$set : {nave: nave}});
        else
            console.log("SAVING UNDEFINED NAVE");
    }
    //------------------------------ESSENCIALS--------------------------------//
    // TODO: ASSINCRONO TA FUDENDO
    get_essencials(callback) {
        this.db.db('prizeship').collection('pool').find({ pool: {$exists: true}}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY POOL: ", error);
            else if(array.length)
                this.essencials_obj.pool = array[0].pool;
            else
                console.log("POOL NOT FOUND");
        });

        this.db.db('prizeship').collection('timers').find({ timer_label: "deadlinetimer"}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY DL TIMER: ", error);
            else if(array.length)
                this.essencials_obj.deadline = array[0].values;
            else
                console.log("TIMER NOT FOUND");
        });

        this.db.db('prizeship').collection('timers').find({ timer_label: "countdowntimer"}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY CD TIMER: ", error);
            else if(array.length)
                this.essencials_obj.countdown = array[0].values;
            else
                console.log("TIMER NOT FOUND");
        });

        this.db.db('prizeship').collection('prize').find({prize: {$exists: true}}).toArray((error, array) => {
            if(error)
                console.log("ERROR AO COLOCAR O PRIZE EM ARRAY: ", error);
            else if(array.length)
                this.essencials_obj.prize = array[0].prize;
        });

        this.db.db('prizeship').collection('nave').find({ nave: {$exists: true}}).toArray((error, array) => {
            if (error)
                console.log("ERRO AO COLOCAR EM ARRAY NAVE: ", error);
            else if(array.length)
            {
                this.essencials_obj.nave = array[0].nave;
                if(callback)
                    callback(this.essencials_obj);
                else
                    console.log("CALLBACK INVALIDA");
            }
            else
                console.log("NAVE NOT FOUND");
        });
    }
    //------------------------CHART------------------------//
    save_chart_point(ponto) {
        if(ponto)
            this.db.db('prizeship').collection('chart').insert({ponto: ponto});
        else
            console.log("SAVING UNDEFINED PONTO");
    }

    get_chart_points(callback) {
        this.db.db('prizeship').collection('chart').find({ponto: {$exists: true}}).toArray((error, array) => {
            if(error)
                console.log("ERROR AO COLOCAR OS PONTOS EM ARRAY: ", error);
            else if(callback)
                callback(array);
            else
                console.log("CALLBACK INVALIDA");
        });
    }

    clear_chart() {
        this.db.db('prizeship').collection('chart').drop();
    }
    //------------------------PRIZE------------------------//
    increase_prize(quant, callback) {
        this.db.db('prizeship').collection('prize').update({prize: {$exists: true}}, {$inc: {prize: Number(quant)}});
        if(callback)
            callback();
    }
    reset_prize() {
        this.db.db('prizeship').collection('prize').update({prize: {$exists: true}}, {prize: 0}, {$upsert: true});
    }
    get_prize(callback) {
        if(callback)
            this.db.db('prizeship').collection('prize').find({prize: {$exists: true}}).toArray((error, array) => {
                if(error)
                    console.log("ERROR AO COLOCAR O PRIZE EM ARRAY: ", error);
                else if(array.length)
                    callback(array[0].prize);
            });
        else
            console.log("CALLBACK INVALIDA");
    }
    //------------------------CONNECTION------------------------//
    connect(callback) {
        var obj = this;
        this.mongo.connect('mongodb://localhost:27017/prizeship', { useNewUrlParser: true }, (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else {
                obj.db = db;
                if(callback)
                    callback(db);
                else
                    console.log("CALLBACK INVALIDA");
            }    
            //db.close();
        });
    }
}