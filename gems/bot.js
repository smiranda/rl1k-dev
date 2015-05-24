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
        this.viewing_range = 100;
        this.view_points = [];
    };
    
    Bot.inheritsFrom(Character);
    
    Bot.prototype.Place = function(handler, _x, _y)
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
    
    Bot.prototype.Update = function(target)
    {
       if (this.brain !== undefined){
           if (this.brain.type == "brownian"){
               this.brain.Think(this);
           }
           else if (this.brain.type == "follower"){
               this.brain.ThinkFollower(this, target);               
           }
       }
    };
    
    Bot.prototype.getHit = function(body)
    {
      body.bot.health -= 10;
      if (body.bot.health < 0) {
        body.bot.health = 0;
      }
    }
    
    // Brain Class
    var BotBrain = function(type){
        this.type = type;
    };
    BotBrain.inheritsFrom(Brain);
    
    BotBrain.prototype.ThinkFollower = function(subject, target)
    {   
        // Source: http://gamemechanicexplorer.com/#follow-1
        var RADIUS_INFLUENCE = 100.0;
        var MAX_SPEED = 100;
        var lib_ref = subject.body.game;
        
        var diff_x = subject.body.x - target.body.x;
        var diff_y = subject.body.y - target.body.y;
        var distance = Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2))

        // If the distance < RADIUS_INFLUENCE then move
        if (distance < RADIUS_INFLUENCE) {
            // Calculate the angle to the target
            var rotation = lib_ref.math.angleBetween(subject.body.x, subject.body.y, target.body.x, target.body.y);

            // Calculate velocity vector based on rotation and this.MAX_SPEED
            subject.body.velocity.x = Math.cos(rotation) * MAX_SPEED;
            subject.body.velocity.y = Math.sin(rotation) * MAX_SPEED;
        } else {
            subject.body.setZeroVelocity();
        }
    };
    
    // Public interface
    return {
        
        // Bot class factory
        CreateBot: function(_sprite_sheet_id){
            return new Bot(_sprite_sheet_id);
        },
        
        // Brain class factory
        CreateBrain: function(_type){
            return new BotBrain(_type);
        },
    };  
})();
