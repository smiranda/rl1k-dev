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
        this.layers = new Array();
        this.layers.push(this.map.createLayer('background', handler.width, handler.height, handler.maps_group));
        this.layers.push(this.map.createLayer('ground', handler.width, handler.height, handler.maps_group));
        this.layers.push(this.map.createLayer('wall', handler.width, handler.height, handler.maps_group)); 
        
        // create a special bot layer
        this.bot_layer = this.map.createLayer('bots', handler.width, handler.height, handler.maps_group);
        this.layers.push(this.bot_layer);
        
        for (var i=0; i<this.layers.length; ++i)
            this.layers[i].resizeWorld();
        
        var wall_layer = this.layers[2];
        this.map.setCollisionBetween(256, 267, true, wall_layer);// colidable tiles
        handler.physics.p2.convertTilemap(this.map, wall_layer);// this returns the array of bodies, if required
        
        // Create bots from map data
        this.map.setCollisionBetween(125, 127, true, this.bot_layer);// colidable tiles
        this.bot_bodies = handler.physics.p2.convertTilemap(this.map, this.bot_layer);
        this.bots = new Array();
        for (var i=0; i<this.bot_bodies.length; ++i)
            this.bots.push(BotModule.CreateBot('bot'));
        
        // Setup bots
        var bot_brain = BotModule.CreateBrain();
        for (var i=0; i<this.bots.length; ++i){
            this.bots[i].Create(handler, this.bot_bodies[i].x, this.bot_bodies[i].y);
            this.bots[i].PlugBrain(bot_brain);
        }

        // Clean Bot layer
        botlayer = this.layers.pop();
        ModClearTilemapLayerBodies(this.map, this.map.getLayer(botlayer));
        botlayer.destroy();      
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
        var wall_layer = this.layers[2];
        ModClearTilemapLayerBodies(this.map, this.map.getLayer(wall_layer));
        for (var i=0; i<this.layers.length; ++i)
            this.layers[i].destroy();
    };
    
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