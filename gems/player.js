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
    Player.inheritsFrom(Character);
    
    Player.prototype.Place = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
        // Add the sprite object
        this.sprite = handler.add.sprite(_x, _y, 'player', 19);
        handler.players_group.add(this.sprite);
        this.sprite.scale.set(2, 2);
        // Adding anumations
        this.sprite.animations.add('walk_down', [18, 20], 3, false);
        handler.physics.p2.enable(this.sprite);
        this.sprite.body.setZeroDamping();
        this.sprite.body.fixedRotation = true;
        
        // add a reference-to-body to this
        this.body = this.sprite.body;
        
        this.body.player = this;
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
    
    PlayerBrain.inheritsFrom(Brain);
    
    PlayerBrain.prototype.Think = function(subject)
    {
        subject.body.setZeroVelocity();
        
        if (this.cursor_keys.left.isDown)
            subject.AddVelocityX(-200);
        else if (this.cursor_keys.right.isDown)
            subject.AddVelocityX(200);

        if (this.cursor_keys.up.isDown)
            subject.AddVelocityY(-200);
        else if (this.cursor_keys.down.isDown){
            subject.sprite.animations.play('walk_down');
            subject.AddVelocityY(200);
        } else {
            subject.sprite.animations.stop();  
            subject.sprite.frame = 19;
        }
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
