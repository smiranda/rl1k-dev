/*
 * Bot Module
 */
var BotModule = (function () {
    
    // Bot Class
    var Bot = function(_sprite_sheet_id)
    {
        this.health = 100;
        this.sprite_sheet_id = _sprite_sheet_id;
        this.dir = 0;
        this.external_move = false;
    };
    Bot.prototype.Create = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
        // Add the sprite object
        this.sprite = handler.bots_group.create(_x, _y, 'bot');
        handler.physics.p2.enable(this.sprite);
        this.sprite.body.setZeroDamping();
        //this.sprite.body.fixedRotation = true;
        
        // add a reference-to-body to this
        this.body = this.sprite.body;
        
        this.body.bot = this;
    };
    
    Bot.prototype.Update = function()
    {
       if (this.brain !== undefined)
           this.brain.Think(this);
    };
    Bot.prototype.PlugBrain = function(_brain)
    {
        this.brain = _brain;
    };
    Bot.prototype.AddVelocityX = function(speed)
    {
      this.body.data.velocity[0] += this.body.world.pxmi(speed);
    };
    Bot.prototype.AddVelocityY = function(speed)
    {
      this.body.data.velocity[1] += this.body.world.pxmi(speed);
    };
    Bot.prototype.getHit = function(body)
    {
      body.bot.health -= 10;
      if (body.bot.health < 0) {
        body.bot.health = 0;
      }
    }
    
    // Brain Class
    var Brain = function(){
    };
    Brain.prototype.Think = function(subject)
    {
        if(!subject.external_move)
            subject.body.setZeroVelocity(); 
        
        
        var rnd_change_move = subject.handler_ref.rnd.integerInRange(0, 100);
        if(rnd_change_move > 99)
        {
            var rnd_dir = subject.handler_ref.rnd.integerInRange(0, 100);
            if(rnd_dir >= 0 && rnd_dir < 25)
                subject.dir = 0;
            else if(rnd_dir >= 25 && rnd_dir < 50)
                subject.dir = 1;
            else if(rnd_dir >= 50 && rnd_dir < 75)
                subject.dir = 2;
            else if(rnd_dir >= 75 && rnd_dir < 100)
                subject.dir = 3;
        }
        
        if(subject.dir === 0)
            subject.AddVelocityX(-50);
        else if(subject.dir === 1)
            subject.AddVelocityX(50);
        else if(subject.dir === 2)
            subject.AddVelocityY(-50);
        else if(subject.dir === 3)
            subject.AddVelocityY(50);
        
        subject.external_move = false;
    };
    
    // Brain Class
    var PlayerBrain = function(_cursor_keys){
        this.cursor_keys = _cursor_keys;
    };
    PlayerBrain.prototype.Think = function(subject)
    {
        subject.body.setZeroVelocity();
        
        var delta_mouse_rad = subject.body.rotation - subject.handler_ref.physics.arcade.angleToPointer(subject.sprite) - Math.PI/2;  
        delta_mouse_rad = delta_mouse_rad - Math.PI/2;
        var mod = Math.PI * 2;
        delta_mouse_rad = delta_mouse_rad % mod; // saturate value to [-Math.PI*2,Math.PI*2]

        if (delta_mouse_rad !== delta_mouse_rad % (mod/2) ) { 
          delta_mouse_rad = (delta_mouse_rad < 0) ? delta_mouse_rad + mod : delta_mouse_rad - mod;
        }
        var speed = 650;
        subject.body.rotateLeft(speed * delta_mouse_rad);
        
        if (this.cursor_keys.left.isDown)
            subject.AddVelocityX(-200);
        else if (this.cursor_keys.right.isDown)
            subject.AddVelocityX(200);

        if (this.cursor_keys.up.isDown)
            subject.AddVelocityY(-200);
        else if (this.cursor_keys.down.isDown)
           subject.AddVelocityY(200);
    };
    
    // Public interface
    return {
        
        // Bot class factory
        CreateBot: function(_sprite_sheet_id){
            return new Bot(_sprite_sheet_id);
        },
        
        // Brain class factory
        CreateBrain: function(){
            return new Brain();
        },
        
        // Player Brain class factory
        CreatePlayerBrain: function(_cursor_keys){
            return new PlayerBrain(_cursor_keys);
        }
    };  
})();
