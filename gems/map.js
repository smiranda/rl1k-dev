/*
 * Map Module
 */
var MapModule = (function () {
    
    // Module classes
    var TiledMap = function(_map_id, _tiles_id){
        this.map_id = _map_id;
        this.map_tileset_id = _tiles_id;
        this.map_data_id = _map_id + "data";
    };
    
    TiledMap.prototype.Preload = function(handler, data_path, tileset_path)
    {
        handler.load.tilemap(this.map_data_id, data_path, null, Phaser.Tilemap.TILED_JSON);
        handler.load.image(this.map_tileset_id, tileset_path);
    };
    
    TiledMap.prototype.Create = function(handler)
    {
        this.map = handler.add.tilemap(this.map_data_id);
        this.map.addTilesetImage(this.map_tileset_id); 
        layers = new Object();
        layers.bkg = this.map.createLayer('background', handler.width, handler.height, handler.maps_group);
        layers.gnd = this.map.createLayer('ground', handler.width, handler.height, handler.maps_group);
        layers.wall = this.map.createLayer('wall', handler.width, handler.height, handler.maps_group); 
        
        // Resize the Game World to fit the Tiled map (using the bkg layer as a ref)
        layers.bkg.resizeWorld();
        
        // Setup Collidable wall layer
        this.map.setCollisionBetween(256, 267, true, layers.wall);// colidable tiles
        handler.physics.p2.convertTilemap(this.map, layers.wall);// this returns the array of bodies, if required
        
        // Extract bots positions from Object Layer in the Tiled Map
        var bot_bodies = this.map.objects.bots;
        // Create Bots (as many as found in the Object Layer)
        this.bots = new Array();
        for (var i=0; i<bot_bodies.length; ++i)
            this.bots.push(BotModule.CreateBot('bot'));
        
        // Setup bots
        var bot_brain = BotModule.CreateBrain();
        for (var i=0; i<bot_bodies.length; ++i){
            //this.bots[i].Create(handler, this.bot_bodies[i].x, this.bot_bodies[i].y);
            this.bots[i].Create(handler, bot_bodies[i].x, bot_bodies[i].y);
            this.bots[i].PlugBrain(bot_brain);
        }    
        
        // Extract portal positions
        var portal_bodies = this.map.objects.markers;
        // Create portals
        // NOTE: the information regarding the destination and the source of the portals
        // was hardcoded in the custom properties of the object in the Tiled Map
        this.portals = new Array();
        for (var i=0; i<portal_bodies.length; ++i){
            var portal = PortalModule.CreatePortal('portal');
            portal.Create(handler, portal_bodies[i].x, portal_bodies[i].y,
                            portal_bodies[i].properties.portal_src,
                            portal_bodies[i].properties.portal_dst);
            this.portals.push(portal);
        }
        
        // Store information in the object
        this.layers = layers;
    };
    
    TiledMap.prototype.Destroy = function () {
        
        // Destroy bots
        for (var i=0; i<this.bots.length; ++i){
            this.bots[i].sprite.destroy();
            //ModDestroy(this.bots[i].sprite.body);
            //this.bots[i].sprite.body = null;
            //this.bots[i].sprite = null;
            //this.bots[i] = null;
        }
        
        // Destroy layers
        var wall_layer = this.layers.wall;
        ModClearTilemapLayerBodies(this.map, this.map.getLayer(wall_layer));
        for (var layerToDestroy in this.layers)
            this.layers[layerToDestroy].destroy();
    };
    
    TiledMap.prototype.ActivatePortals = function (handler, engine_ref, player_ref) {
        for (var i = 0; i < this.portals.length; ++i)
            this.portals[i].AddListener(handler, engine_ref, player_ref);
    }
    
    var ModDestroy = function (_body) {

        _body.removeFromWorld();

        _body.clearShapes();

        _body._bodyCallbacks = {};
        _body._bodyCallbackContext = {};
        _body._groupCallbacks = {};
        _body._groupCallbackContext = {};

        if (_body.debugBody)
        {
            _body.debugBody.destroy(true, true);
        }

        _body.debugBody = null;
        //this.sprite.body = null;
        _body.sprite = null;

    };
    
    var ModClearTilemapLayerBodies = function (map, layer) {

        layer = map.getLayer(layer);

        var i = map.layers[layer].bodies.length;

        while (i--)
        {
            ModDestroy(map.layers[layer].bodies[i]);
        }

        map.layers[layer].bodies.length = 0;

    };
    
    // Public interface
    return {
        
        // TiledMap class factory
        CreateTiledMap: function(_map_id, _tiles_id){
            return new TiledMap(_map_id, _tiles_id);
        }
    };
})();