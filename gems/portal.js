/*
 * Portal Module
 */
var PortalModule = (function () {
    
    // Module classes
    var Portal = function(_portal_id){
        this.portal_id = _portal_id;
    };

    Portal.prototype.AddListener = function(lib_ref, engine_ref, player)
    {
        var src_map = engine_ref.maps[this.source_level];
        var dst_map = engine_ref.maps[this.destination_level];
        this.body.createBodyCallback(player, function(body1, body2) {
            src_map.Destroy(lib_ref.game);
            dst_map.Create(lib_ref.game);
            dst_map.CreateBots();    
            dst_map.PlaceBots(lib_ref.game);  
            dst_map.SetupBrainBots(); 

            // Check for the bot hitting another object  
            for (var i=0; i<engine_ref.maps[engine_ref.curr_map].bots.length; ++i)
                engine_ref.player.body.createBodyCallback(dst_map.bots[i], player.getHit, lib_ref);

            lib_ref.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            dst_map.ActivatePortals(lib_ref, engine_ref, player);

            engine_ref.curr_map = this.destination_level;

            this.sprite.destroy();
        }, this);
    };
    
    Portal.prototype.Place = function(handler, _x, _y, source, destination)
    {
        // Capure handler
        this.handler_ref = handler; 

        this.source_level = source;
        this.destination_level = destination;
        
        // Add the sprite object
        this.sprite = handler.add.sprite(_x, _y, this.portal_id);
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
        CreatePortal: function(_portal_id){
            return new Portal(_portal_id);
        }
    };
})();
