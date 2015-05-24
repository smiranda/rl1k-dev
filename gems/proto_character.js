/*
 * Prototype Classes CHARACTER and BRAIN from which any movable / intelligent entity should inherit its body and its brain
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

