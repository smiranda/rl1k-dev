// Gem class
var Gem = function(lib_ref, engine_ref) {
    this.lib_ref = lib_ref;
    this.engine_ref = engine_ref;
};
Gem.prototype.Place = function(_x, _y, _group){
    this.sprite = _group.create(_x, _y, 'yellow_gem');
    this.sprite.animations.add('shine');
    this.sprite.animations.play('shine', 10, true);
    
    gem = this;
    this.engine_ref.RegisterUpdateCallback(gem, function(){
        if (Phaser.Rectangle.intersects (
            gem.sprite.getBounds(),
            gem.engine_ref.player.sprite.getBounds()))
        {
            gem.sprite.visible = false;
        }
    });
}
