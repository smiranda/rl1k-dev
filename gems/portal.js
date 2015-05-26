/*
 * Portal Module
 */
var PortalModule = (function () {
    
    // Module classes
    var Portal = function(_portal_id, init_info){
        this.portal_id = _portal_id;
        
        this.handler_ref = [];                                      // For handler storage
        this.source_level = init_info.properties.portal_src;        // Source Level (loaded from .json)
        this.destination_level = init_info.properties.portal_dst;   // Destination Level (loaded from .json)
        this.init_pos = [];                                         // Initial coordinates (loaded from .json)
        this.init_pos.x = init_info.x;
        this.init_pos.y = init_info.y;
    };

    Portal.prototype.AddListener = function(lib_ref, engine_ref, player)
    {
        var src_map = engine_ref.maps[this.source_level];
        var dst_map = engine_ref.maps[this.destination_level];
        this.body.createBodyCallback(player, function(body1, body2) {
            src_map.Destroy(lib_ref.game);
            dst_map.Create(lib_ref.game);
            dst_map.CreateLoot(engine_ref);
            dst_map.PlaceLoot(lib_ref.game);
            dst_map.CreateBots();    
            dst_map.PlaceBots(lib_ref.game);  
            dst_map.SetupBrainBots(); 
            dst_map.CreatePortals();
            dst_map.PlacePortals(lib_ref.game);
            dst_map.ActivatePortals(lib_ref, engine_ref, player);

            engine_ref.curr_map = this.destination_level;
            
            // One-shot immediate vision update
            engine_ref.player.updateVision(dst_map.layers.wall);
            
            // Check for the bot hitting another object  
            for (var i=0; i<engine_ref.maps[engine_ref.curr_map].bots.length; ++i)
                engine_ref.player.body.createBodyCallback(dst_map.bots[i], player.getHit, lib_ref);

            lib_ref.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

            this.sprite.destroy();
        }, this);
    };
    
    Portal.prototype.Place = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
        // Add the sprite object
        // If no new coordinates are provided, the portal is placed according to its original position (loaded from the .json)
        if (_x == undefined || _y == undefined){
            console.log(this.portal_id)
            this.sprite = handler.markers_group.create(this.init_pos.x, this.init_pos.y, this.portal_id);
        } else {
            this.sprite = handler.markers_group.create(_x, _y, this.portal_id);
        }
        handler.physics.p2.enable(this.sprite);
        this.sprite.body.setZeroDamping();
        this.sprite.body.static = true;
        
        // add a reference-to-body to this
        this.body = this.sprite.body;
        
        this.body.portal = this;

    };  
    
    // Public interface
    return {
        
        // Portal class factory
        CreatePortal: function(_portal_id, _init_info){
            return new Portal(_portal_id, _init_info);
        }
    };
})();
