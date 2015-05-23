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
