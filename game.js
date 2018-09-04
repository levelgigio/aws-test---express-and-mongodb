module.exports = function() {
    //--------------------------VARIABLES AND METHODS------------------------- //
    this.database;
    this.sockets;
    this.guess_range = 200;
    this.get_guess_range = function() {
        return this.guess_range;
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
    //--------------------------DATABASE------------------------- //
    this.set_database = function(database) {
        this.database = database;
        this.saver.set_database(database); // setando database do saver
    }
    
    this.get_database = function() {
        return this.database;
    }
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
    //--------------------------CHART------------------------- //
    this.Chart = require('./chart.js');
    this.chart = new this.Chart();
    
    this.get_chart = function() {
        return this.chart;
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
            this.cd_timer.start_new(20000, "countdowntimer"); 
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
        //--------------------------CHART------------------------- //
        if(start_new) {
            this.chart.start_new();
            this.saver.add_chart(this.chart);
            this.database.clear_chart();
        }
        else
            this.database.get_chart_points((pontos) => {
                for(var i = 0; i < pontos.length; i++)
                    this.chart.add_ponto(pontos[i].ponto);
                this.saver.add_chart(this.chart);
            });
        //--------------------------PRIZE------------------------- //
        if(start_new)
            this.database.reset_prize();
        //--------------------------SAVER------------------------- //
        setTimeout(this.saver.save, 5000);
    }
}