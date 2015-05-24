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
    

    Bot.prototype.getHit = function(body)
    {
      body.bot.health -= 10;
      if (body.bot.health < 0) {
        body.bot.health = 0;
      }
    }
    
    // Brain Class
    var BotBrain = function(){
    };
    BotBrain.inheritsFrom(Brain);
    
    BotBrain.prototype.Update = function(player)
    {
       if (this.brain !== undefined)
           this.brain.Think(this, player);
    };
    
    BotBrain.prototype.ThinkFollower = function(subject)
    {
        // Source: http://gamemechanicexplorer.com/#follow-1
        var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

        // If the distance > MIN_DISTANCE then move
        if (distance > this.MIN_DISTANCE) {
            // Calculate the angle to the target
            var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

            // Calculate velocity vector based on rotation and this.MAX_SPEED
            this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
            this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
        } else {
            this.body.velocity.setTo(0, 0);
        }
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
    };  
})();
