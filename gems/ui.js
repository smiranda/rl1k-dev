/*
 * UI Module
 */
var UIModule = (function () {
    
    // UIModule class
    var UIModule = function(lib_ref, engine_ref){
        this.lib_ref = lib_ref;
        this.engine_ref = engine_ref;
    };
    
    UIModule.prototype.Create = function(){
        this.ui_group = this.lib_ref.game.add.group();
        this.sprite = this.ui_group.create(0, 0, 'ui_box');
        this.sprite.scale.set(1.35 , 1.35);
        this.sprite.x = this.lib_ref.game.canvas.width/2 - this.sprite.width/2;
        this.sprite.y = this.lib_ref.game.canvas.height - this.sprite.height;
        this.sprite.alpha = 0.8;
        this.sprite.fixedToCamera = true;
    }

    // Public interface
    return {
        
        // TiledMap class factory
        CreateUIModule: function(lib_ref, engine_ref){
            return new UIModule(lib_ref, engine_ref);
        }
    };
    
})();
