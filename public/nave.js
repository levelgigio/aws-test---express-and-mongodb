function Nave(json) {
    this.nave;
    
    //----------------------ANIMATION VARIABLES--------------------//
    this.json = $.parseJSON(json);
    this.img_div = document.getElementById(this.json.object_name);
    this.continuous = false;
    this.current_frame = 0;
    this.current_animation;
    this.previous_animation;
    this.animation_interval;
    //----------------------ANIMATION VARIABLES--------------------//
    
    //----------------------ANIMATION METHODS--------------------//
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
            
            if(!object.current_frame) 
                if(!object.continuous)
                    clearInterval(object.animation_interval);
                else 
                    object.current_animation = object.previous_animation;
        }, this.json.animations[this.current_animation].animation_velocity/this.json.animations[this.current_animation].frames.length);
    }
    //----------------------ANIMATION METHODS--------------------//
}