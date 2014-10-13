define(['Color'], function(Color) {
  var MAX_BEAM_DISTANCE = 120; // percentage, between cow and ship
  var MIN_BEAM_DISTANCE = 0;   // percentage, between cow and ship

  /**
   * The saucer profile that measures how close a player is to abducting a cow
   * @param {Object=} options Configuration options
   * @param {number=} [options.color] The color for the ship. @see Color
   * @param {number=} [options.speed=3] how quickly the beam should descend or
   * ascend, between 1 and 5, 5 being the fastest.
   * @constructor
   * @name Beam
   */
  function Beam(options) {
    var _this = this,
        _ship = null,
        _beam = new PIXI.Sprite.fromFrame('tractorBeam.png'),
        _cow = new PIXI.Sprite.fromFrame('cow.png'),

        /**
         * The color of the ship. @see Color
         * @name color
         * @memberof Beam
         * @type number
         */
        _color,
        /**
         * A number between MIN_BEAM_DISTANCE and MAX_BEAM_DISTANCE, representing how close the beam is to the cow
         * @private
         * @memberof Beam
         * @type number
         */
        _distance = MIN_BEAM_DISTANCE,
        /**
         * Whether or not the beam should be descending
         * @name on
         * @memberof Beam
         * @type boolean
         */
        _enabled = false,
        /**
         * Maps chosen speeds to times
         * @type Object
         */
        _speeds = {
          1: 1000,
          2: 850,
          3: 700,
          4: 650,
          5: 500
        },
        _ascentInterval = null,
        _descentInterval = null,
        /**
         * The maximum height the beam can be before it touches the cow.
         * @type number
         */
        _maxBeamHeight = null,
        options = options || {},

        /**
         * The speed that the tractor beam moves
         * @memberof Beam
         * @type number
         * @name speed
         */
        _speed = _speeds[3];

    PIXI.DisplayObjectContainer.call(_this);

    function _init() {
      var color_count = Object.keys(Color).length;
      var key = Object.keys(Color)[Beam._index % color_count];

      _color = options.color || Color[key];

      _ship = new PIXI.Sprite.fromFrame(_color + 'Saucer.png');
     
      // tall enough to fit the cow, the ship, with room for the beam
      var height = (_cow.height + _ship.height)*3;
      
      _this.addChild(_ship);

      _cow.anchor.x = 0.5;
      _cow.y = height - _cow.height;
      _cow.x = _ship.width/2;
      _this.addChild(_cow);

      _beam.anchor.x = 0.5;
      _beam.y = _ship.height - 5;
      _beam.x = _ship.width/2;
      _beam.height = 0;
      var blurFilter = new PIXI.BlurFilter();
      blurFilter.blur = 5;
      _beam.filters = [blurFilter];
      _beam.opacity = 0.7; 
      _this.addChild(_beam);

      _maxBeamHeight = height - _cow.height - _ship.height;
      
      Beam._index++;
    };

    /**
     * Sets the distance of the tractor beam
     * @param number value Must be between MIN_BEAM_DISTANCE and MAX_BEAM_DISTANCE
     * @see score
     */
    function _setDistance(value) {
      if(Number.parseInt(value) < MIN_BEAM_DISTANCE || Number.parseInt(value) > MAX_BEAM_DISTANCE) {
        throw "Tractor beam distance must be between " + MIN_BEAM_DISTANCE + 
          '-' + MAX_BEAM_DISTANCE + ". Given: " + value;
      }
      _distance = value;
      _beam.height = (_distance/100)*_maxBeamHeight;
    };
    
    /**
     * Sets the speed of the tractor beam
     * @param number value A number, from 1 to 5, representing how fast the
     * tractor beam should move
     * @see speed
     */
    function _setSpeed(value) {
      var speed = _speeds[value];

      if(speed === undefined) {
        throw "Tractor beam speed must be between 1-5. Given: " + value;
      }
      _speed = speed;
      _resetMotion();
    };

    /**
     * Resets tractor beam's motion, which depends on whether or not the beam
     * is enabled and the current speed of the beam
     */
    function _resetMotion() {
      clearInterval(_descentInterval);
      clearInterval(_ascentInterval);

      if(_enabled) {
        _descentInterval = setInterval(_descend, _this.speed);
      }
      else
      {
        _ascentInterval = setInterval(_ascend, _this.speed);
      }
    }

    /**
     * Gets the speed of the tractor beam
     * @return number A number, from 1 to 5, representing how fast the tractor
     * beam is moving
     * @see speed
     */
    function _getSpeed() {
      for(key in _speeds) {
        if(_speeds[key] === _speed) {
          return key;
        }
      }
    };

    function _ascend() {
      if(_distance <= MIN_BEAM_DISTANCE) { return; } 
      _setDistance(_distance-1);
    };

    function _descend() {
      if(_distance >= MAX_BEAM_DISTANCE) { return; } 
      _setDistance(_distance+1);
    };

    /**
     * @param boolean value Whether or not the beam should be enabled
     */
    function _setEnabled(value) {
      if(value == _enabled) {
        return;
      }
      _enabled = !!value;
      _resetMotion();
    };

    Object.defineProperties(_this, {
      color: {
        enumerable: true,
        get: function() { return _color; }
      },
      speed: {
        enumerable: true,
        get: _getSpeed,
        set: _setSpeed
      },
      on: {
        enumerable: true,
        get: function() { return _enabled; },
        set: _setEnabled
      }
    });

    _init();
  };

  /**
   * Keeps track of how many saucers have been created (for colorization's sake)
   * @type number
   */
  Beam._index = 0;
  Beam.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Beam.prototype.constructor = Beam;

  return Beam;
});
