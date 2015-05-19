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
    function Engine () {
        engine = {}
    };
    
    // Engine Class Functions
    Engine.prototype.Preload = function () {
        var phaserh = this;
        
        phaserh.game.load.image('background', './gfx/space.png');
        phaserh.game.load.spritesheet('bot', './gfx/square.png', 16, 16);
        phaserh.game.load.spritesheet('portal', './gfx/portal.png', 16, 16);
        
        engine.maps = new Array();
        for (var i=0; i<2; ++i) {
            engine.maps.push(MapModule.CreateTiledMap('world16x16.'+i, 'world16x16'));
            engine.maps[i].Preload(
                phaserh.game,'./resources/map'+i+'.json','./gfx/world.png');
        }

        engine.player = BotModule.CreateBot('bot');
        engine.portal = PortalModule.CreatePortal('portal');
    };
    Engine.prototype.Create = function () {
        var phaserh = this;

        // Setup physics
        phaserh.game.physics.startSystem(Phaser.Physics.P2JS);

        engine.draw_group = phaserh.game.add.group();
        engine.maps_group = phaserh.game.add.group(engine.draw_group);
        engine.bots_group = phaserh.game.add.group(engine.draw_group);

        phaserh.game.draw_group = engine.draw_group;
        phaserh.game.bots_group = engine.bots_group;
        phaserh.game.maps_group = engine.maps_group;
        
        // Setup world
        //this.game.add.tileSprite(0, 0, WORLD_BOUND_X, WORLD_BOUND_Y, 'background'); 
        phaserh.game.world.setBounds(0, 0, WORLD_BOUND_X, WORLD_BOUND_Y);
        
        //for (var i=0; i<this.maps.length; ++i)
        engine.curr_map = 0
        engine.maps[engine.curr_map].Create(phaserh.game);
        
        engine.player.Create(
            phaserh.game, phaserh.game.world.centerX, phaserh.game.world.centerY);
        engine.player.sprite.frame = 1;
        
        engine.portal.Create(phaserh.game, 250, 150, engine.curr_map, 1);
        engine.portal.AddListener(phaserh, engine, engine.player);
        
        // Setup cursors and player
        cursors = phaserh.game.input.keyboard.createCursorKeys();
        engine.cursor_keys = {
            up: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: phaserh.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        var player_brain = BotModule.CreatePlayerBrain(engine.cursor_keys);
        engine.player.PlugBrain(player_brain);
        
        //this.game.input.onDown.add(PointerAction(this), this);

        //Check for the bot hitting another object           
        for (var i=0; i<engine.maps[engine.curr_map].bots.length; ++i)
            engine.player.body.createBodyCallback(engine.maps[engine.curr_map].bots[i], BlockHit, phaserh);

        //  And before this will happen, we need to turn on impact events for the world
        phaserh.game.physics.p2.setImpactEvents(true);

        // Other Initializations
        phaserh.game.camera.follow(engine.player.sprite);
        phaserh.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        phaserh.game.scale.pageAlignHorizontally = true;
        phaserh.game.scale.pageAlignVeritcally = true;
        phaserh.game.scale.refresh();
    };
    Engine.prototype.Update = function () {      
        
        engine.player.Update();
        for (var i=0; i<engine.maps[engine.curr_map].bots.length; ++i)
            engine.maps[engine.curr_map].bots[i].Update();
    };
    Engine.prototype.Render = function () {
        var phaserh = this;
        
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        phaserh.game.debug.text("Health: " + engine.player.health, 32, 128);
        //this.game.debug.spriteCoords(this.player.sprite, 32, 160);
        phaserh.game.scale.refresh();
    };
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
