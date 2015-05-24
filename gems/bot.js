/*
 * Bot Module
 */
var BotModule = (function () {
    
    // Bot Class
    var Bot = function(_sprite_sheet_id, init_info)
    {
        // General Properties
        this.health = 100;
        this.sprite_sheet_id = _sprite_sheet_id;
        this.dir = 0;
        this.external_move = false;
        this.viewing_range = 100;
        this.view_points = [];
        this.wasActive = 0;                             // true if bot was active before
        
        // Properties loaded from the json
        this.init_pos = [];
        this.init_pos.x = init_info.x;                  // initial coordinate x loaded from .json
        this.init_pos.y = init_info.y;                  // initial coordinate y loaded from .json
        this.ai_type = init_info.properties.ai_type;    // type of AI loaded from .json
    };
    
    Bot.inheritsFrom(Character);
    
    Bot.prototype.Place = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
        // Add the sprite object
        // If the arguments _x or _y are undefined use the initial position stored upon creation
        if (_x == undefined || _y == undefined){
            this.sprite = handler.bots_group.create(this.init_pos.x, this.init_pos.y, 'bot');
        } else {
            this.sprite = handler.bots_group.create(_x, _y, 'bot');
        }
        handler.physics.p2.enable(this.sprite);
        this.sprite.body.setZeroDamping();
        this.sprite.body.fixedRotation = true;
        
        // add a reference-to-body to this
        this.body = this.sprite.body;
        
        this.body.bot = this;
    };
    
    Bot.prototype.Update = function(target)
    {
       if (this.brain !== undefined){
           if (this.ai_type == "brownian"){
               this.brain.Think(this);
           }
           else if (this.ai_type == "nonpersistent_follower"){
               this.brain.persistency = 0;
               this.brain.ThinkFollower(this, target);               
           }
           else if (this.ai_type == "persistent_follower"){
               this.brain.persistency = 1;
               this.brain.ThinkFollower(this, target);           
           } else {
               // default is brownian
               this.brain.Think(this);
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
    var BotBrain = function(){
        this.persistency = [];  // characterizes the persistency of the "follower" behaviour
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
        var rotation = [];

        // If the distance < RADIUS_INFLUENCE then move
        if (distance < RADIUS_INFLUENCE) {
            // Calculate the angle to the target
            rotation = lib_ref.math.angleBetween(subject.body.x, subject.body.y, target.body.x, target.body.y);

            // Calculate velocity vector based on rotation and this.MAX_SPEED
            subject.body.velocity.x = Math.cos(rotation) * MAX_SPEED;
            subject.body.velocity.y = Math.sin(rotation) * MAX_SPEED;
            subject.wasActive = 1;
        } else {
            if (this.persistency == 1 && subject.wasActive == 1){
                // Calculate the angle to the target
                rotation = lib_ref.math.angleBetween(subject.body.x, subject.body.y, target.body.x, target.body.y);

                // Calculate velocity vector based on rotation and this.MAX_SPEED
                subject.body.velocity.x = Math.cos(rotation) * MAX_SPEED;
                subject.body.velocity.y = Math.sin(rotation) * MAX_SPEED;            
            } else {
                subject.body.setZeroVelocity();
            }
        }
    };
    
    // Public interface
    return {
        
        // Bot class factory
        CreateBot: function(_sprite_sheet_id, init_info){
            return new Bot(_sprite_sheet_id, init_info);
        },
        
        // Brain class factory
        CreateBrain: function(){
            return new BotBrain();
        },
    };  
})();
