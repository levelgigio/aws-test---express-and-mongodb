module.exports = function() {
    //--------------------------VARIABLES AND METHODS------------------------- //
    this.database;
    this.sockets;

    
    //--------------------------DATABASE------------------------- //
    this.set_database = function(database) {
        this.database = database;
        this.saver.set_database(database);
    }
    
    this.get_database = function() {
        return this.database;
    }
    //--------------------------SOCKETS------------------------- //
    this.set_sockets = function(io) {
        this.sockets = io.sockets;
    }
    
    this.get_sockets = function() {
        return this.sockets;
    }
    //--------------------------TIMER SAVER------------------------- //
    this.Saver = require('./saver.js');
    this.saver = new this.Saver(200);
    // precisa setar a database do saver
    // ------------------------------NAVE-----------------------------//
    this.Nave = require('./nave.js');
    this.nave = new this.Nave();

    this.get_nave = function() {
        return this.nave;
    }
    // ------------------------------POOL-----------------------------//
    this.Pool = require('./pool.js');
    this.pool = new this.Pool(this);

    this.get_pool = function() {
        return this.pool.get_pool();
    }
    //--------------------------CD TIMER------------------------- //
    this.CDTimer = require('./cd_timer.js');
    this.cd_timer = new this.CDTimer(this);

    this.get_cd_timer = function() {
        return this.cd_timer;
    }
    //--------------------------DEADLINE TIMER------------------------- //
    this.Deadline = require('./deadline_timer');
    this.deadline_timer = new this.Deadline();

    this.get_deadline_timer = function() {
        return this.deadline_timer;
    }
    //--------------------------START------------------------- //
    this.start = function(start_new) {
        // ------------------------------NAVE-----------------------------//
        if(start_new) {
            this.nave.start_new();
            this.saver.add_nave(this.nave);
        } 
        else
            this.database.get_nave((nave) => {
                this.nave.set_nave(nave);
                this.saver.add_nave(this.nave);
            });
        // ------------------------------POOL-----------------------------//
        if(start_new) {
            this.pool.start_new();
            this.saver.add_pool(this.pool);
        }
        else
            this.database.get_pool((pool) => {
                this.pool.set_pool(pool);
                this.saver.add_pool(this.pool);
            });
        //--------------------------CD TIMER------------------------- //
        if(start_new) {
            this.cd_timer.start_new(60000, "countdowntimer"); 
            setTimeout(this.cd_timer.begin, 100);
            this.saver.add_timer(this.cd_timer);
        }
        else
            this.database.get_timer("countdowntimer", (timer) => {
                this.cd_timer.set_timer(timer);
                setTimeout(this.cd_timer.begin, 100);
                this.saver.add_timer(this.cd_timer);
            });
        //--------------------------DEADLINE TIMER------------------------- //
        if(start_new) {
            this.deadline_timer.start_new(365, "deadlinetimer");
            this.saver.add_timer(this.deadline_timer);
        }
        else
            this.database.get_timer("deadlinetimer", (timer) => {
                this.deadline_timer.set_timer(timer);
                this.saver.add_timer(this.deadline_timer);
            });
        //--------------------------SAVER------------------------- //
        setTimeout(this.saver.save, 10000);
    }
}