module.exports = function(database) {
    this.database = database;
    
    //--------------------------CD TIMER------------------------- //
    this.CDTimer = require('./cd_timer.js');
    this.cd_timer = new this.CDTimer();

    //<-- (1) : ative para nao carregar o antigo do banco de dados
    //this.cd_timer.start_new(24*60*60*1000, "countdowntimer"); 
    //this.cd_timer.begin();
    //--> (1) : ative para nao carregar o antigo do banco de dados

    this.TimeSaver = require('./time_saver.js');
    this.saver = new this.TimeSaver(this.database, this.cd_timer);

    //<-- (1) : ative para nao carregar o antigo do banco de dados
    //this.saver.save(); 
    //--> (1) : ative para nao carregar o antigo do banco de dados

    // <-- (1) : desative para nao carregar o antigo do banco de dados
    this.database.get_timer("countdowntimer", (timer) => {
        this.cd_timer.set_timer(timer);
        this.cd_timer.begin();

        this.saver.save();
    });
    // --> (1) : desative para nao carregar o antigo do banco de dados
    
    this.get_cd_timer = function() {
        return this.cd_timer;
    }
    //--------------------------CD TIMER------------------------- //
    
    //--------------------------DEADLINE TIMER------------------------- //
    this._deadline = new Date();
    this._deadline.setDate(this._deadline.getDate() + 365);
    this._months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    //--------------------------DEADLINE TIMER------------------------- //
    
    
}

