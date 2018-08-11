module.exports = function() {
    
    this.timer;
    this.now;
    
    var obj = this;
    this.begin = function() {
        delete obj.now;
        obj.now = new Date().getTime();
        var tempo = obj.timer.values.duration + obj.timer.values.reference - obj.now;
        if(tempo <= 0){
            delete obj.timer.values.reference;
            obj.timer.values.reference = new Date().getTime();
            setTimeout(obj.begin, 50);
            return;
        }
        obj.timer.values.tempo_restante = tempo;
        setTimeout(obj.begin, 50);
        return;
    }
    
    this.set_timer = function(timer) {
        this.timer = timer;
    }

    this.get_timer = function() {
        return this.timer;
    }
    
    this.start_new = function(tempo_max, label) {
        this.timer = {
            timer_label: label,
            values: {
                reference: new Date().getTime(),
                duration: tempo_max,
                tempo_restante: null
            }
        };
    }

}