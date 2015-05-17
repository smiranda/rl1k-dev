/*
 * Utils Module
 */
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
