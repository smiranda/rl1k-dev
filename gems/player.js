/*
 * Player Module
 */
var PlayerModule = (function () {
    
    // Player Class
    var Player = function(_sprite_sheet_id)
    {
        this.health = 100;
        this.sprite_sheet_id = _sprite_sheet_id;
        this.dir = 0;
        this.external_move = false;
        this.viewing_range = 100;
        this.view_points = [];
    };
    Player.prototype.Place = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
        // Add the sprite object
        this.sprite = handler.players_group.create(_x, _y, 'player');
        handler.physics.p2.enable(this.sprite);
        this.sprite.body.setZeroDamping();
        //this.sprite.body.fixedRotation = true;
        
        // add a reference-to-body to this
        this.body = this.sprite.body;
        
        this.body.player = this;
    };
    
    Player.prototype.Update = function()
    {
       if (this.brain !== undefined)
           this.brain.Think(this);
    };
    Player.prototype.PlugBrain = function(_brain)
    {
        this.brain = _brain;
    };
    Player.prototype.AddVelocityX = function(speed)
    {
      this.body.data.velocity[0] += this.body.world.pxmi(speed);
    };
    Player.prototype.AddVelocityY = function(speed)
    {
      this.body.data.velocity[1] += this.body.world.pxmi(speed);
    };
    Player.prototype.getHit = function(body)
    {
      body.player.health -= 10;
      if (body.player.health < 0) {
        body.player.health = 0;
      }
    }
    Player.prototype.updateVision = function(layer)
    {
        this.view_points = [];
        for(var a = 0; a < Math.PI * 2; a += Math.PI/90) {
            // Create a ray from the light to a point on the circle
            var ray = new Phaser.Line(this.body.x, this.body.y, this.body.x + Math.cos(a) * this.viewing_range, 
                this.body.y + Math.sin(a) * this.viewing_range);
            this.view_points.push(getRayCastPoints(layer, ray));
        }
    }

    var getRayCastPoints = function (layer, ray) {
        var tiles = layer.getTiles(ray.x, ray.y, ray.width, ray.height, false, false);
        if (tiles.length !== 0)
        {
            var coords = ray.coordinatesOnLine(4);
            for (var t = 0; t < coords.length; t++)
            {
                for (var i = 0; i < tiles.length; i++)
                {
                    if (tiles[i].collides && tiles[i].containsPoint(coords[t][0], coords[t][1]))
                    {
                        return {x:coords[t][0],y:coords[t][1]};
                    }
                }
            }
        }
        return {x:ray.end.x,y:ray.end.y};
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
        
        // Player class factory
        CreatePlayer: function(_sprite_sheet_id){
            return new Player(_sprite_sheet_id);
        },
        
        // Player Brain class factory
        CreatePlayerBrain: function(_cursor_keys){
            return new PlayerBrain(_cursor_keys);
        }
    };  
})();
