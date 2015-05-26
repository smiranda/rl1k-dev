var LootModule = (function () {

    // Loot class
    var Loot = function(init_info, engine_ref) {
        //this.lib_ref = lib_ref;
        this.engine_ref = engine_ref;
        this.sprite = [];

        // Properties loaded from the json
        this.sprite_sheet_id = init_info.properties.sprite_id;
        this.init_pos = [];
        this.init_pos.x = init_info.x;                          // initial coordinate x loaded from .json
        this.init_pos.y = init_info.y;                          // initial coordinate y loaded from .json
    };

    Loot.prototype.PlaceAndAnimate = function(handler, _x, _y){
        // Placement of the object in the map
        if (_x == undefined || _y == undefined){
            this.sprite = handler.loot_group.create(this.init_pos.x, this.init_pos.y, this.sprite_sheet_id);        
        }else{
            this.sprite = handler.loot_group.create(_x, _y, this.sprite_sheet_id);
        }

        // Animation according with the sprite pre-loaded
        if ( this.sprite_sheet_id == 'yellow_gem' ){
            this.sprite.animations.add('shine');
            this.sprite.animations.play('shine', 10, true);
        }

        // Callback such that it disappears upon contact with the player
        loot = this;
        this.engine_ref.RegisterUpdateCallback(loot, function(){
            if (Phaser.Rectangle.intersects (
                loot.sprite.getBounds(),
                loot.engine_ref.player.sprite.getBounds()))
            {
                loot.sprite.visible = false;
            }
        });
    }
    
    // Public interface
    return {
        
        // Bot class factory
        CreateLoot: function(_sprite_sheet_id, init_info, engine_ref){
            return new Loot(_sprite_sheet_id, init_info, engine_ref);
        },
    };  
})();