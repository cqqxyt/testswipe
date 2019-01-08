var framework = {
    arraySearch: function(array, value, key) {
        var i = array.length;
        while(i--) {
            if(array[i][key] === value) {
                return i;
            } 
        }
        return -1;
    },
    createEl: function(classes, tag) {
        var el = document.createElement(tag || 'div');
        if(classes) {
            el.className = classes;
        }
        return el;
    },
    easing: {
		sine: {
			out: function(k) {
				return Math.sin(k * (Math.PI / 2));
			},
			inOut: function(k) {
				return - (Math.cos(Math.PI * k) - 1) / 2;
			}
		},
		cubic: {
			out: function(k) {
				return --k * k * k + 1;
			}
		}
	},
    /**
     * 
     * @return {object}
     * 
     * {
     *  raf : request animation frame function
     *  caf : cancel animation frame function
     *  transfrom : transform property key (with vendor), or null if not supported
     *  oldIE : IE8 or below
     * }
     * 
     */
detectFeatures: function() {
    if(framework.features) {
        return framework.features;
    }
    var helperEl = framework.createEl(),
        helperStyle = helperEl.style,
        vendor = '',
        features = {};


    features.touch = 'ontouchstart' in window;

    if(window.requestAnimationFrame) {
        features.raf = window.requestAnimationFrame;
        features.caf = window.cancelAnimationFrame;
    }

    features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled;

    // fix false-positive detection of old Android in new IE
    // (IE11 ua string contains "Android 4.0")
    
    if(!features.pointerEvent) { 

        var ua = navigator.userAgent;

        // Detect if device is iPhone or iPod and if it's older than iOS 8
        // http://stackoverflow.com/a/14223920
        // 
        // This detection is made because of buggy top/bottom toolbars
        // that don't trigger window.resize event.
        // For more info refer to _isFixedPosition variable in core.js

        if (/iP(hone|od)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if(v && v.length > 0) {
                v = parseInt(v[1], 10);
                if(v >= 1 && v < 8 ) {
                    features.isOldIOSPhone = true;
                }
            }
        }

        // Detect old Android (before KitKat)
        // due to bugs related to position:fixed
        // http://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript
        
        var match = ua.match(/Android\s([0-9\.]*)/);
        var androidversion =  match ? match[1] : 0;
        androidversion = parseFloat(androidversion);
        if(androidversion >= 1 ) {
            if(androidversion < 4.4) {
                features.isOldAndroid = true; // for fixed position bug & performance
            }
            features.androidVersion = androidversion; // for touchend bug
        }	
        features.isMobileOpera = /opera mini|opera mobi/i.test(ua);

        // p.s. yes, yes, UA sniffing is bad, propose your solution for above bugs.
    }
    
    var styleChecks = ['transform', 'perspective', 'animationName'],
        vendors = ['', 'webkit','Moz','ms','O'],
        styleCheckItem,
        styleName;

    for(var i = 0; i < 4; i++) {
        vendor = vendors[i];

        for(var a = 0; a < 3; a++) {
            styleCheckItem = styleChecks[a];

            // uppercase first letter of property name, if vendor is present
            styleName = vendor + (vendor ? 
                                    styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : 
                                    styleCheckItem);
        
            if(!features[styleCheckItem] && styleName in helperStyle ) {
                features[styleCheckItem] = styleName;
            }
        }

        if(vendor && !features.raf) {
            vendor = vendor.toLowerCase();
            features.raf = window[vendor+'RequestAnimationFrame'];
            if(features.raf) {
                features.caf = window[vendor+'CancelAnimationFrame'] || 
                                window[vendor+'CancelRequestAnimationFrame'];
            }
        }
    }
        
    if(!features.raf) {
        var lastTime = 0;
        features.raf = function(fn) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { fn(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
        features.caf = function(id) { clearTimeout(id); };
    }

    // Detect SVG support
    features.svg = !!document.createElementNS && 
                    !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    framework.features = features;

    return features;
}
}

export default framework