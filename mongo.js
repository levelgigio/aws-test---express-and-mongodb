module.exports = class Mongo {

    constructor() {
        this.mongo = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId; 
    }
    
    //------------------------POOL---------------------------//
    get_pool(callback) {
        this.connect((db) => {
            db.db('prizeship').collection('pool').find( { pool: { $exists: true } }).toArray( (error, array) => {
                if(error)
                    console.log("error: ", error);
                else
                    //TESTAR O PONTO POOL
                    callback(array[0].pool); // precisa existir apenas um objeto com a key "pool"
            });
        }); 
    }
    
    save_pool(cpool) {
        this.connect((db) => {
            db.db('prizeship').collection('pool').update( { pool: {$exists: true}}, {$set : {pool : cpool}});
        });
    }
    //---------------------------POOL------------------------------//

    //-----------------------------USER------------------------------//
    // testar, se funfar, arrumar a pool_state pq ta usando find em vez de findOne
    search_user_by_id(user_id, callback) {
        var id = new this.ObjectId(user_id);
        this.connect((db) => {
            db.db('prizeship').collection('users').find( { _id: id } ).toArray( (error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
                else
                    callback(array[0].user);
            });
        });
    }
    
    update_user(user_id, user) {
        var id = new this.ObjectId(user_id);
        this.connect((db) => {
            db.db('prizeship').collection('users').update( { _id : id}, {user: user});
        })
    }
    
    user_spent_ip(user_id, quant, callback) {
        var id = new this.ObjectId(user_id);
        this.connect((db) => {
            db.db('prizeship').collection('users').update( { _id : id}, {$inc: {"user.ip": -quant, "user.ip_spent": quant}});
            callback();
        });
    }
    
    user_login(user, callback) {
        this.connect((db) => {
            db.db('prizeship').collection('users').find( { "user.username": user.username, "user.pwd": user.pwd} ).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS USERS", error);
                else
                    if(array.length)
                        callback({
                            status: array[0]._id
                        }); // retorna o id do usuario com esse username e senha
                    else
                        callback({
                            status: "not found"
                        });
            })
        });
    }
    
    distribute_ip_winners(pool) {
        
    }
    
    split_pp(user_id, quant, callback) {
        this.search_user_by_id(user_id, (user) => {
            if(user.pp >= quant) {
                user.pp -= quant;
                user.ip += quant*10;
                this.update_user(user_id, user);
                console.log("user depois de split: ", user);
                callback("splitou " + quant + " pp");
            } else
                callback("nao tinha pp o suficiente")
        });
    }
    //-----------------------------USER---------------------------------//
    
    //---------------------------TIMERS---------------------------------//
    // TODO: TALVEZ TIRAR O UPSERT
    save_time(timer) {
        this.connect((db) => {
            db.db('prizeship').collection('timers').update({timer_label: timer.timer_label}, {$set: {values: timer.values}}, {upsert: true}, (error, result) => {
                if(error)
                    console.log("ERRO AO SALVAR TIMERS: ", err);
                /*else
                    console.log("RESULTADO SALVAR TIMERS: ", result);*/
            });
        });
    }
    
    get_timer(label, callback) {
        this.connect((db) => {
            db.db('prizeship').collection('timers').find( { timer_label: label }).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY OS TIMERS", error);
                else
                    if(array.length)
                        callback(array[0]);
            });
        });
    }
    //-------------------------------TIMERS---------------------------------//
    
    //----------------------------------NAVE-------------------------------------//
    get_nave(callback) {
        this.connect((db) => {
            db.db('prizeship').collection('nave').find( { nave: {$exists: true} } ).toArray((error, array) => {
                if(error)
                    console.log("ERRO AO PASSAR PRA ARRAY A NAVE", error);
                else
                    if(array.length)
                        callback(array[0].nave);
            });
        });
    }
    
    save_nave(nave) {
        // TODO: ADD UPSERT MAYBE
        this.connect((db) => {
            db.db('prizeship').collection('nave').update( { nave: {$exists: true}}, {$set : {nave: nave}});
        });
    }
    //------------------------------NAVE----------------------------------//
    
    //------------------------------EVERYTHING--------------------------------//
    get_everything(user_id, callback) {
        var everything_obj = {};
        this.connect((db) => {
            db.db('prizeship').collection('nave').find({ nave: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY NAVE: ", error);
                else
                    everything_obj.nave = array[0];
            });
            
            db.db('prizeship').collection('pool').find({ pool: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY POOL: ", error);
                else
                    everything_obj.pool = array[0];
            });
            
            db.db('prizeship').collection('timers').find({ timer_label: {$exists: true}}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY TIMERS: ", error);
                else
                    everything_obj.timers = array;
            });
            
            var id = new this.ObjectId(user_id);
            db.db('prizeship').collection('users').find({ _id: id}).toArray((error, array) => {
                if (error)
                    console.log("ERRO AO COLOCAR EM ARRAY USER: ", error);
                else {
                    everything_obj.user = array[0];
                    callback(everything_obj);
                }
            });
        });
    }
    //------------------------------EVERYTHING----------------------------//
    
    //------------------------CONNECTION------------------------//
    connect(callback) {
        this.mongo.connect('mongodb://localhost:27017/prizeship', { useNewUrlParser: true }, (error, db) => {
            if (error)
                console.log("ERRO AO CONECTAR AO MONGO DB: ", error);
            else
                callback(db);
            db.close();
        });
    }
    //-----------------------CONNECTION----------------------------//
}