/*
 * Prototype Class from which any movable / intellingent entity should inherit
 *      ex: monsters, npcs, human-players
 *
 * This file should have no public interface.
 */

    
// Character Class
var Character = function(_sprite_sheet_id)
{
    this.health = 100;
    this.sprite_sheet_id = _sprite_sheet_id;
    this.dir = 0;
    this.external_move = false;
    this.viewing_range = 100;
    this.view_points = [];
};

Character.prototype.Update = function()
{
   if (this.brain !== undefined)
       this.brain.Think(this);
};
Character.prototype.PlugBrain = function(_brain)
{
    this.brain = _brain;
};
Character.prototype.AddVelocityX = function(speed)
{
  this.body.data.velocity[0] += this.body.world.pxmi(speed);
};
Character.prototype.AddVelocityY = function(speed)
{
  this.body.data.velocity[1] += this.body.world.pxmi(speed);
};
Bot.prototype.updateVision = function(layer)
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
