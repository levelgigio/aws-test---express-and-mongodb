module.exports = function() {
    //-------------------VARIABLES---------------------//
    this.timer;
    //this._months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    //-------------------VARIABLES---------------------//
    
    //-------------------METHODS---------------------//
    this.reduce_deadline = function() {
       var data = new Date();
        data.setTime(this.timer.values.deadline);
       data.setTime(this.timer.values.deadline-this.timer.values.current_reduction);
        
        this.timer.values.deadline = data.getTime();
    }

    this.set_timer = function(timer) {
        this.timer = timer;
    }

    this.get_timer = function() {
        return this.timer;
    }

    this.start_new = function(tempo_max_dias, label) {
        this.timer = {
            timer_label: label,
            values: {
                deadline: null,
                current_reduction: 3233000
            }
        };
        var data = new Date();
        data.setDate(data.getDate() + tempo_max_dias);
        this.timer.values.deadline = data.getTime();
    }
    //-------------------METHODS---------------------//
}

