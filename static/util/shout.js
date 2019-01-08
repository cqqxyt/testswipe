import _listeners from '../util/listener.js'

 const fn = (name)=>{
    console.log(JSON.stringify(_listeners))
    var listeners = _listeners[name];
    console.log(name)
    console.log(JSON.stringify(_listeners[name]))
    if(listeners) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();

        for(var i = 0; i < listeners.length; i++) {
            console.log(...args)
            listeners[i].apply(self, args);
        }
    }
}

export default fn

