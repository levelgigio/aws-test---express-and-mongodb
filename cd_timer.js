module.exports = function(game) {
    //-------------------VARIABLES---------------------//
    this.game = game;
    this.timer;
    this.now;
    this.reinit_flag = false;
    //-------------------VARIABLES---------------------//

    //-------------------METHODS---------------------//
    var obj = this;
    this.begin = function() {


        var hours = Math.floor((obj.timer.values.tempo_restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((obj.timer.values.tempo_restante % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((obj.timer.values.tempo_restante % (1000 * 60)) / 1000);
        console.log("TEMPO ATE FECHAR A VOTACAO: " + hours + "h " + minutes + "m " + seconds + "s ");



        delete obj.now;
        obj.now = new Date().getTime();
        var tempo = obj.timer.values.duration + obj.timer.values.reference - obj.now;
        if(tempo <= 0){
            delete obj.timer.values.reference;
            obj.timer.values.reference = new Date().getTime();
            if(obj.game.pool)
                obj.game.pool.close_pool();
            obj.reinit_flag = true;
            setTimeout(obj.begin, 50);
            return;
        }
        obj.timer.values.tempo_restante = tempo;
        if(obj.reinit_flag)
            setTimeout(() => {
                obj.game.get_database().get_essencials((essencials) => {
                    obj.game.get_sockets().emit('essencials', essencials);
                });
            }, 200);
        obj.reinit_flag = false;
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
    //-------------------METHODS---------------------//
}