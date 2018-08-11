module.exports = function(tempo_max, label) {
    
    this.timer = {
        timer_label: label,
        values: {
            reference: new Date().getTime(),
            duration: tempo_max
        }
    };
    
    this.tempo_restante;
    this.now;
    
    var obj = this;
    this.countdown_timer = function() {
        delete obj.now;
        obj.now = new Date().getTime();
        var tempo = obj.timer.values.duration + obj.timer.values.reference - obj.now;
        if(tempo <= 0){
            delete obj.timer.values.reference;
            obj.timer.values.reference = new Date().getTime();
            setTimeout(obj.countdown_timer, 50);
            return;
        }
        obj.tempo_restante = tempo;
        setTimeout(obj.countdown_timer, 50);
        return;
    }

    this.get_timer = function() {
        return this.timer;
    }

}