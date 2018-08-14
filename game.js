module.exports = function(database) {
    //--------------------------VARIABLES AND METHODS------------------------- //
    this.database = database;
    //--------------------------TIMER SAVER------------------------- //
    this.Saver = require('./saver.js');
    this.saver = new this.Saver(this.database, 200);
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
        return this.pool;
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
    this.start = function() {
        // ------------------------------NAVE-----------------------------//
        //this.nave.start_new();
        //this.saver.add_nave(this.nave);

        this.database.get_nave((nave) => {
            this.nave.set_nave(nave);
            this.saver.add_nave(this.nave);
        });
        // ------------------------------POOL-----------------------------//
        //this.pool.start_new();
        //this.saver.add_pool(this.pool);

        this.database.get_pool((pool) => {
            this.pool.set_pool(pool);
            this.saver.add_pool(this.pool);
        });
        //--------------------------CD TIMER------------------------- //
        //this.cd_timer.start_new(60000, "countdowntimer"); 
        //setTimeout(this.cd_timer.begin, 100);
        //this.saver.add_timer(this.cd_timer);

        this.database.get_timer("countdowntimer", (timer) => {
            this.cd_timer.set_timer(timer);
            setTimeout(this.cd_timer.begin, 100);
            this.saver.add_timer(this.cd_timer);
        });
        //--------------------------DEADLINE TIMER------------------------- //
        //this.deadline_timer.start_new(365, "deadlinetimer");
        //this.saver.add_timer(this.deadline_timer);

        this.database.get_timer("deadlinetimer", (timer) => {
            this.deadline_timer.set_timer(timer);
            this.saver.add_timer(this.deadline_timer);
        });
        //--------------------------SAVER------------------------- //
        setTimeout(this.saver.save, 10000);
    }
}