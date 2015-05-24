/*
 * Map Module
 */
var MapModule = (function () {
    
    // Module classes
    var TiledMap = function(_map_id, _tiles_id){
        this.map_id = _map_id;                  // Map Id
        this.map_tileset_id = _tiles_id;        
        this.map_data_id = _map_id + "data";
        this.bots = new Array();                // Stores the Bot objects
        this.portals = new Array();             // Stores the Portal objects
        this.init_positions = [];
    };
    
    TiledMap.prototype.Preload = function(handler, data_path, tileset_path)
    {
        handler.load.tilemap(this.map_data_id, data_path, null, Phaser.Tilemap.TILED_JSON);
        handler.load.image(this.map_tileset_id, tileset_path);
    };
    
    TiledMap.prototype.Create = function(handler)
    {
        var map = handler.add.tilemap(this.map_data_id);
        map.addTilesetImage(this.map_tileset_id); 
        var layers = new Object();
        layers.bkg = map.createLayer('background', handler.width, handler.height, handler.maps_group);
        layers.gnd = map.createLayer('ground', handler.width, handler.height, handler.maps_group);
        layers.wall = map.createLayer('wall', handler.width, handler.height, handler.maps_group); 
        
        // Resize the Game World to fit the Tiled map (using the bkg layer as a ref)
        layers.bkg.resizeWorld();
        
        // Setup Collidable wall layer
        map.setCollisionBetween(256, 267, true, layers.wall);// colidable tiles
        handler.physics.p2.convertTilemap(map, layers.wall);// this returns the array of bodies, if required
        
        // Extract bots positions from Object Layer in the Tiled Map
        var bot_bodies = map.objects.bots;
        
        // Extract portal positions
        var portal_bodies = map.objects.markers;

        // Store information in the object
        this.layers = layers;
        this.map = map;
        this.init_positions.bot = bot_bodies;
        this.init_positions.portal = portal_bodies;
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
        this.bots = [];
        
        // Destroy portals
        for (var i=0; i<this.portals.length; ++i){
            this.portals[i].sprite.destroy();
        }
        this.portals = [];
        
        // Destroy layers
        var wall_layer = this.layers.wall;
        ModClearTilemapLayerBodies(this.map, this.map.getLayer(wall_layer));
        for (var layerToDestroy in this.layers)
            this.layers[layerToDestroy].destroy();
    };
    
    
    TiledMap.prototype.CreateBots = function () {
        for (var i=0; i<this.init_positions.bot.length; ++i)
            this.bots.push(BotModule.CreateBot('bot'));
    }
    
    TiledMap.prototype.PlaceBots = function (handler) {
        for (var i = 0; i < this.bots.length; ++i){
            this.bots[i].init_pos = this.init_positions.bot[i];
            this.bots[i].Place(handler, this.bots[i].init_pos.x, this.bots[i].init_pos.y);
        }
    }
    
    TiledMap.prototype.SetupBrainBots = function () {
        var bot_brain = BotModule.CreateBrain("follower");
        for (var i = 0; i < this.bots.length; ++i)
            this.bots[i].PlugBrain(bot_brain);
    }
    
    TiledMap.prototype.CreatePortals = function () {
        // Create portals
        for (var i=0; i<this.init_positions.portal.length; ++i){
            var portal = PortalModule.CreatePortal('portal');
            this.portals.push(portal);
        }        
    }
    
    TiledMap.prototype.PlacePortals = function (handler) {
        // NOTE: the information regarding the destination and the source of the portals
        // was hardcoded in the custom properties of the object in the Tiled Map
        for (var i=0; i<this.portals.length; ++i){
            this.portals[i].init_pos = this.init_positions.portal[i];
            this.portals[i].Place(handler, this.portals[i].init_pos.x, this.portals[i].init_pos.y,
                            this.portals[i].init_pos.properties.portal_src,
                            this.portals[i].init_pos.properties.portal_dst);
        }
    }
    
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