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
        this.layers = new Object();
        this.layers.bkg = this.map.createLayer('background', handler.width, handler.height, handler.maps_group);
        this.layers.gnd = this.map.createLayer('ground', handler.width, handler.height, handler.maps_group);
        this.layers.wall = this.map.createLayer('wall', handler.width, handler.height, handler.maps_group); 
        
        // Create a special markers layer (for holding portals and other special map markers)
        this.layers.markers = this.map.createLayer('markers', handler.width, handler.height, handler.maps_group);
        
        // Create a special bot layer
        this.layers.bots = this.map.createLayer('bots', handler.width, handler.height, handler.maps_group);
        
        // Resize the Game World to fit the Tiled map (using the bkg layer as a ref)
        this.layers.bkg.resizeWorld();
        
        // Setup Collidable wall layer
        var wall_layer = this.layers.wall;
        this.map.setCollisionBetween(256, 267, true, wall_layer);// colidable tiles
        handler.physics.p2.convertTilemap(this.map, wall_layer);// this returns the array of bodies, if required
        
        // Create bots from map data 
        this.map.setCollisionBetween(126, 127, true, this.layers.bots);// colidable tiles
        this.bot_bodies = handler.physics.p2.convertTilemap(this.map, this.layers.bots);
        this.bots = new Array();
        for (var i=0; i<this.bot_bodies.length; ++i)
            this.bots.push(BotModule.CreateBot('bot'));
        
        // Setup bots
        var bot_brain = BotModule.CreateBrain();
        for (var i=0; i<this.bot_bodies.length; ++i){
            this.bots[i].Create(handler, this.bot_bodies[i].x, this.bot_bodies[i].y);
            this.bots[i].PlugBrain(bot_brain);
        }    
                
        // Create portals from map data XXX: !DRY, check bot creation
        this.map.setCollisionBetween(221, 222, true, this.layers.markers);// colidable tiles
        this.portal_bodies = handler.physics.p2.convertTilemap(this.map, this.layers.markers);
        this.portals = new Array();
        for (var i=0; i<this.portal_bodies.length; ++i){
            var portal = PortalModule.CreatePortal('portal');
            portal.Create(handler, this.portal_bodies[i].x, this.portal_bodies[i].y,
                            this.layers.markers.layer.properties.portal_0_src,
                            this.layers.markers.layer.properties.portal_0_dst); // XXX: find portal index from x,y properties
            this.portals.push(portal);
        }
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