/*
 * UI Module
 */
var UIModule = (function () {
    
    // UIModule class
    var UIModule = function(lib_ref, engine_ref){
        this.lib_ref = lib_ref;
        this.engine_ref = engine_ref;
        this.toggle_ui_bit = true;
    };
    
    UIModule.prototype.Create = function(){
        this.ui_group = this.lib_ref.game.add.group();
        this.sprite = this.ui_group.create(0, 0, 'ui_box');
        this.sprite.scale.set(1.35 , 1.35);
        this.sprite.x = this.lib_ref.game.canvas.width/2 - this.sprite.width/2;
        this.sprite.y = this.lib_ref.game.canvas.height - this.sprite.height;
        this.sprite.alpha = 0.8;
        this.sprite.fixedToCamera = true;
        
        // Toggle visibility callback registration
        ui_context = this;
        this.engine_ref.RegisterUpdateCallback(ui_context, function(){
            if (ui_context.engine_ref.cursor_keys.toggle_ui.isDown){
                if (ui_context.toggle_ui_bit){
                    ui_context.ToggleVisible();
                    ui_context.toggle_ui_bit=false;
                }
            }else if (ui_context.engine_ref.cursor_keys.toggle_ui.isUp){
                ui_context.toggle_ui_bit = true;
            }
        });
    }
    
    UIModule.prototype.ToggleVisible = function(visible) {
        if (visible !== undefined)
            this.sprite.visible = visible;
        else
            this.sprite.visible = !this.sprite.visible;
    }

    // Public interface
    return {
        
        // TiledMap class factory
        CreateUIModule: function(lib_ref, engine_ref){
            return new UIModule(lib_ref, engine_ref);
        }
    };
    
})();
