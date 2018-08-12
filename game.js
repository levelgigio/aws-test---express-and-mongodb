module.exports = function(database) {
    this.database = database;
    
    //--------------------------TIMER SAVER------------------------- //
    this.TimeSaver = require('./time_saver.js');
    this.saver = new this.TimeSaver(this.database, 200);
    //--------------------------TIMER SAVER------------------------- //
    
    //--------------------------CD TIMER------------------------- //
    this.CDTimer = require('./cd_timer.js');
    this.cd_timer = new this.CDTimer();

    //this.cd_timer.start_new(24*60*60*1000, "countdowntimer"); 
    //this.cd_timer.begin();
    //this.saver.add_timer(this.cd_timer);
    
    this.database.get_timer("countdowntimer", (timer) => {
        this.cd_timer.set_timer(timer);
        this.cd_timer.begin();
        this.saver.add_timer(this.cd_timer);
    });
    
    this.get_cd_timer = function() {
        return this.cd_timer;
    }
    //--------------------------CD TIMER------------------------- //
    
    //--------------------------DEADLINE TIMER------------------------- //
    this.Deadline = require('./deadline_timer');
    this.deadline_timer = new this.Deadline();
    
    //this.deadline_timer.start_new(365, "deadlinetimer");
    //this.saver.add_timer(this.deadline_timer);
    
    this.database.get_timer("deadlinetimer", (timer) => {
        this.deadline_timer.set_timer(timer);
        this.saver.add_timer(this.deadline_timer);
    });
    
    this.get_deadline_timer = function() {
        return this.deadline_timer;
    }
    //--------------------------DEADLINE TIMER------------------------- //
    
    this.saver.save();
}

