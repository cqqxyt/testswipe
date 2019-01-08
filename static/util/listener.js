

var _listeners = {}

const listen = (name, fn) =>{
    console.log(JSON.stringify(_listeners['initialZoomIn']))
    if(!_listeners[name]) {
        _listeners[name] = [];
    }
    console.log(_listeners)
   // console.log(JSON.stringify(_listeners['initialZoomIn']))
    return _listeners[name].push(fn);
}

listen('initialZoomIn', function(_controls) {
    _controls.removeClass('sipwe__ui--hidden');
});

listen('initialZoomOut', function(_controls) {
    _controls.addClass( 'sipwe__ui--hidden');
});

listen('initialZoomInEnd', function() {
    self.setContent(_itemHolders[0], _currentItemIndex-1);
    self.setContent(_itemHolders[2], _currentItemIndex+1);

    _itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

    if(_options.focus) {
        // focus causes layout, 
        // which causes lag during the animation, 
        // that's why we delay it untill the initial zoom transition ends
        template.focus();
    }
     

    _bindEvents();
});

export default listen