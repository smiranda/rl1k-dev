/*
 * Light Module
 */
var LightModule = (function () {
    
    // Light Class
    var OverlayLight = function(lib_ref, engine_ref) {
        this.lib_ref = lib_ref;
        this.engine_ref = engine_ref;
    };
        
    OverlayLight.prototype.Place = function(_x, _y, _width, _height) {
        
        this.bitmap = this.lib_ref.game.add.bitmapData(_width, _height);
        var lightBitmap = this.lib_ref.game.add.image(_x, _y, this.bitmap);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        overlay = this;
        this.engine_ref.RegisterUpdateCallback(overlay, function(){
        
            // fill the entire light bitmap with a dark shadow color.
            overlay.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
            overlay.bitmap.context.fillRect(0, 0, _width, _height);

            // draw light around player
            overlay.bitmap.context.beginPath();
            overlay.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
            overlay.bitmap.context.moveTo(overlay.engine_ref.player.view_points[0].x, overlay.engine_ref.player.view_points[0].y);
            for(var i = 0; i < overlay.engine_ref.player.view_points.length; i++) {
                overlay.bitmap.context.lineTo(overlay.engine_ref.player.view_points[i].x, overlay.engine_ref.player.view_points[i].y);
            }
            overlay.bitmap.context.closePath();
            overlay.bitmap.context.fill();
            overlay.bitmap.dirty = true;
        });
    };
    
    // Public interface
    return {
        
        // Bot class factory
        CreateOverlayLight: function(lib_ref, engine_ref) {
            return new OverlayLight(lib_ref, engine_ref);
        },
        
    };  
})();
