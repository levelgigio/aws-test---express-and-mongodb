function Nave(json) {
    this.window_x = 20;
    this.window_y = 20;
    
    
    this.game_y = 0;
    this.gas_padrao = 20;
    this.gas_extra = 0;
    this.json = $.parseJSON(json);
    this.img_div = document.getElementById(this.json.object_name);
    this.continuous = false;
    this.current_frame = 0;
    this.current_animation;
    this.previous_animation;
    this.animation_interval;
    
    //------------------------------------------------ //
    
    this.animate = function(animation, continuous) {

        if(continuous != null)
            this.continuous = continuous;
        
        if (this.current_animation !== animation) {
            this.previous_animation = this.current_animation;
            this.current_animation = animation;
            if(!this.previous_animation)
                this.previous_animation = this.current_animation;
            this.current_frame = 0;
            clearInterval(this.animation_interval);
        }

        var object = this;
        
        this.animation_interval = setInterval(function() {
            object.img_div.src = object.json.animations[object.current_animation].frames[object.current_frame].file;
            object.current_frame = (object.current_frame+1)%object.json.animations[object.current_animation].frames.length;

            //object.update();
            
            if(!object.current_frame) 
                if(!object.continuous)
                    clearInterval(object.animation_interval);
                else 
                    object.current_animation = object.previous_animation;
 
        }, this.json.animations[this.current_animation].animation_velocity/this.json.animations[this.current_animation].frames.length);
        
    }
    
    this.extra_gas = function(valor) {
        this.gas_extra = valor;
    }
    
    this.get_altitude = function() {
        return this.game_y;
    }
    
    this.subir = function() {
        this.animate("horse_jump");
        this.gas_extra = 0;
    }
    
    this.descer = function() {
        this.animate("horse_bend");
        this.gas_extra = 0;
    }
    
}