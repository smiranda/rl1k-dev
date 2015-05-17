/*
 * Portal Module
 */
var PortalModule = (function () {
    
    // Module classes
    var Portal = function(_portal_id, source, destination){
        this.portal_id = _portal_id;
        this.source_level = source;
        this.destination_level = destination;
    };

    Portal.prototype.AddListener = function(lib_ref, engine_ref, target)
    {
        this.body.createBodyCallback(target, function(body1, body2) {
            engine_ref.maps[0].Destroy(lib_ref.game);
            engine_ref.maps[1].Create(lib_ref.game);
            engine_ref.curr_map = 1;
            this.sprite.destroy();
        }, this);
    };
    
    Portal.prototype.Create = function(handler, _x, _y)
    {
        // Capure handler
        this.handler_ref = handler; 
        
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


