/*
 * Utils Module
 */

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}

var UtilsModule = (function () {
        
    return {
        CallOnce: function (fn, fn_context)
        {
          if (fn._utils_callonce === undefined)
          {
              fn._utils_callonce = true;
              var fn_params = Array.prototype.slice.call(arguments);
              fn_params.shift();
              fn_params.shift();
              return fn.apply(fn_context, fn_params);
          }
          else
          {
              return undefined;
          }
        }    
    };
})();
