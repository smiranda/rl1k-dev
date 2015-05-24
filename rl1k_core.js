/* global Phaser */
/* global PortalModule */
/* global BotModule */
/* global MapModule */

/*
 * Engine Module
 */
var EngineModule = (function () {
    
    // Private Constants
    var WORLD_BOUND_X = 2920;
    var WORLD_BOUND_Y = 2920;
    
    // Private State
    var engine;
    var cursors; // XXX: move
    
    // Module Classes
    function Engine() {
        engine = {};
    }
    
    // Engine Class Functions
    Engine.prototype.Preload = function () {
        var phaserh = this;
        
        phaserh.game.load.image('background', './gfx/space.png');
        phaserh.game.load.spritesheet('bot', './gfx/square.png', 16, 16);
        phaserh.game.load.spritesheet('portal', './gfx/portal.png', 16, 16);
        phaserh.game.load.spritesheet('ui_box', './gfx/ui_box.png', 145, 55);
        phaserh.game.load.spritesheet('player', './gfx/square.png', 16, 16);
        
        engine.maps = new Array();
        for (var i=0; i<2; ++i) {
            engine.maps.push(MapModule.CreateTiledMap('world16x16.'+i, 'world16x16'));
            engine.maps[i].Preload(
                phaserh.game,'./resources/map'+i+'.json','./gfx/world.png');
        }
        
    };
    
    
    Engine.prototype.Create = function () {
        var phaserh = this;

        // Setup physics
        phaserh.game.physics.startSystem(Phaser.Physics.P2JS);

        engine.draw_group    = phaserh.game.add.group();
        engine.maps_group    = phaserh.game.add.group(engine.draw_group);
        engine.bots_group    = phaserh.game.add.group(engine.draw_group);
        engine.players_group = phaserh.game.add.group(engine.draw_group);
        
        phaserh.game.draw_group     = engine.draw_group;
        phaserh.game.bots_group     = engine.bots_group;
        phaserh.game.maps_group     = engine.maps_group;
        phaserh.game.players_group  = engine.players_group;
        
        // Setup world
        //this.game.add.tileSprite(0, 0, WORLD_BOUND_X, WORLD_BOUND_Y, 'background'); 
        phaserh.game.world.setBounds(0, 0, WORLD_BOUND_X, WORLD_BOUND_Y);
        
        // Setup initial map
        engine.curr_map = 0
        engine.maps[engine.curr_map].Create(phaserh.game);
        
        // Setup the bots in the map
        engine.maps[engine.curr_map].CreateBots();    
        engine.maps[engine.curr_map].PlaceBots(phaserh.game);
        engine.maps[engine.curr_map].SetupBrainBots();         
        
        // Setup player
        engine.player = PlayerModule.CreatePlayer('player');
        // Place player in the map
        engine.player.Place(
            phaserh.game, phaserh.game.world.centerX, phaserh.game.world.centerY);
        engine.player.sprite.frame = 1;
        // Setup player cursors
        cursors = phaserh.game.input.keyboard.createCursorKeys();
        engine.cursor_keys = {
            up: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        // Plug player's brain
        var player_brain = PlayerModule.CreatePlayerBrain(engine.cursor_keys);
        engine.player.PlugBrain(player_brain); 
        
        // Setup the portals in the map
        engine.maps[engine.curr_map].CreatePortals(); 
        engine.maps[engine.curr_map].PlacePortals(phaserh.game); 
        engine.maps[engine.curr_map].ActivatePortals(phaserh, engine, engine.player); // player needs to be created before activating the portals
        
        //this.game.input.onDown.add(PointerAction(this), this);

        //Check for the bot hitting another object           
        for (var i=0; i<engine.maps[engine.curr_map].bots.length; ++i)
            engine.player.body.createBodyCallback(engine.maps[engine.curr_map].bots[i], engine.player.getHit, phaserh);

        //  And before this will happen, we need to turn on impact events for the world
        phaserh.game.physics.p2.setImpactEvents(true);

        
        // Setup UI
        engine.ui = UIModule.CreateUIModule(phaserh, engine);
        engine.ui.Create();
        
        
        // Other Initializations
        phaserh.game.camera.follow(engine.player.sprite);
        phaserh.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        phaserh.game.scale.pageAlignHorizontally = true;
        phaserh.game.scale.pageAlignVeritcally = true;
        phaserh.game.scale.refresh();

        // light bitmap
        phaserh.bitmap = phaserh.game.add.bitmapData(WORLD_BOUND_X, WORLD_BOUND_Y);
        var lightBitmap = phaserh.game.add.image(0, 0, phaserh.bitmap);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        // Health bar
        engine.health = phaserh.game.add.text(100, 128, 
            "Health: " + engine.player.health, 
        { font: '16px monospace', fill: '#fff', align: 'center' }
        );
        engine.health.anchor.setTo(0.5, 0.5);
        engine.health.fixedToCamera = true;
    };
    
    
    Engine.prototype.Update = function () {      
        var phaserh = this;
        var wall_layer = engine.maps[engine.curr_map].layers.wall;
        
        
        engine.health.text = "Health: " + engine.player.health;
        
        // fill the entire light bitmap with a dark shadow color.
        phaserh.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        phaserh.bitmap.context.fillRect(0, 0, WORLD_BOUND_X, WORLD_BOUND_Y);

        for (var i=0; i<engine.maps[engine.curr_map].bots.length; ++i)
            engine.maps[engine.curr_map].bots[i].Update(engine.player);

        engine.player.Update();
        if (engine.player.body.data.previousPosition != engine.player.body.data.position || engine.player.view_points.length == 0)
        {
            engine.player.updateVision(wall_layer);
        }

        // draw light around player
        phaserh.bitmap.context.beginPath();
        phaserh.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        phaserh.bitmap.context.moveTo(engine.player.view_points[0].x, engine.player.view_points[0].y);
        for(var i = 0; i < engine.player.view_points.length; i++) {
            phaserh.bitmap.context.lineTo(engine.player.view_points[i].x, engine.player.view_points[i].y);
        }
        phaserh.bitmap.context.closePath();
        phaserh.bitmap.context.fill();
        phaserh.bitmap.dirty = true;
    };
    
    
    Engine.prototype.Render = function () {
        var phaserh = this;
        
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.spriteCoords(this.player.sprite, 32, 160);
        phaserh.game.scale.refresh();
    };
    
    
    // NOTE: Phaser.Auto detects the presence of WebGL immediately. However, using WebGL
    // may make the game slow and laggy.
    Engine.prototype.Init = function (win_w, win_h, dom_tag) {
        this.game = new Phaser.Game(
            win_w, win_h, Phaser.CANVAS, dom_tag,
            {preload: this.Preload,
             create: this.Create,
             update: this.Update,
             render: this.Render});
    };
    
    //var PointerAction = function (that) {
    //    return function(pointer) {
    //        for (var i = 0; i < that.bots.length; i++)
    //        {
    //            var obj0 = that.bots[i];
    //            var obj1 = that.player;
    //            var dx = (obj1.body.x) - (obj0.body.x);
    //            var dy = (obj1.body.y) - (obj0.body.y);
//
    //            if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < 200) {
    //                obj0.AddVelocityY(-200);    
    //                obj0.external_move = true;
    //            }
    //        }
    //    };
    //};
    
    var BlockHit = function(body1, body2) {
        body1.bot.health -= 10;
    };    
    
    // Public interface
    return {
        // Engine Class Factrory
        CreateEngine: function() {
            return new Engine();
        }
    };
})();
