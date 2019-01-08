import util from '../util/util.js'
let _animations = {},
    _numAnimations = 0;

    export const  _stopAnimation = function(name) {
		if(_animations[name]) {
			if(_animations[name].raf) {
				window.cancelAnimationFrame( _animations[name].raf );
			}
			_numAnimations--;
			delete _animations[name];
		}
	}
	export const _registerStartAnimation = function(name) {
		if(_animations[name]) {
			_stopAnimation(name);
		}
		if(!_animations[name]) {
			_numAnimations++;
			_animations[name] = {};
		}
	}
	export const _stopAllAnimations = function() {
		for (var prop in _animations) {

			if( _animations.hasOwnProperty( prop ) ) {
				_stopAnimation(prop);
			} 
			
		}
	}
	export const _animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
		var startAnimTime = util._getCurrentTime(), t;
		_registerStartAnimation(name);

		var animloop = function(){
			if ( _animations[name] ) {
				
				t = util._getCurrentTime() - startAnimTime; // time diff
				//b - beginning (start prop)
				//d - anim duration

				if ( t >= d ) {
					_stopAnimation(name);
					onUpdate(endProp);
					if(onComplete) {
						onComplete();
					}
					return;
				}
				onUpdate( (endProp - b) * easingFn(t/d) + b );

				_animations[name].raf = window.requestAnimationFrame(animloop);
			}
		};
		animloop();
	}
