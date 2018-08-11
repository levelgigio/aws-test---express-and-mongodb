module.exports = function() {

    this.timer;
    //this._months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    this.reduce_deadline = function() {
        this.timer.values.deadline.setMilliseconds(this.timer.values.deadline.getMilliseconds()-this.timer.values.current_reduction);
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
                current_reduction: 15000
            }
        };
        this.timer.values.deadline = new Date();
        this.timer.values.deadline.setDate(this.timer.values.deadline.getDate() + tempo_max_dias);
    }

}

