var Abduction = Abduction || {};

/**
 * The Saucer that flies around the screen
 * @param {Object=} options Configuration options
 * @param {number=} [options.color] The color for the ship. @see Abduction.Saucer.Color
 * @constructor
 */
Abduction.Saucer = function(options) {
  var _this = this,
      _sprite,
      _color,
      options = options || {};

  /**
   * Whether or not the tractor beam should be enabled
   * @type boolean
   * @memberof Abduction.Saucer
   * @name beam
   */
  var _beam = false;

  PIXI.DisplayObjectContainer.call(_this);

  function setBeam(val) {
    if(val == _beam) {
      return;
    }
    _beam = Boolean(val);
    this.removeChild(_sprite);

    if(_beam) {
      _sprite = new PIXI.Sprite.fromFrame('ship-glow' + _color + '.png');
    }
    else
    {
      _sprite = new PIXI.Sprite.fromFrame('ship' + _color + '.png')
    }

    _sprite.anchor.x = 0.5;
    _sprite.anchor.y = 0.5;
    this.addChild(_sprite);
  };

  function _init() {
    Abduction.Saucer._index++;
    var color_count = Object.keys(Abduction.Saucer.Color).length;
    _color = options.color || (Abduction.Saucer._index % color_count)+1;

    _sprite = new PIXI.Sprite.fromFrame('ship' + _color + '.png');
    _sprite.anchor.x = 0.5;
    _sprite.anchor.y = 0.5;

    _this.addChild(_sprite);
  };

  Object.defineProperties(_this, {
    beam: {
      enumerable: true,
      get: function() { return _beam; },
      set: setBeam
    }
  });

  _init();
};

/**
 * Ship colors
 * @enum {number}
 */
Abduction.Saucer.Color = {
  BLUE: 1,
  TEAL: 2,
  MAGENTA: 3,
  PURPLE: 4
}

/**
 * Keeps track of how many saucers have been created (for colorization's sake)
 * @type number
 */
Abduction.Saucer._index = 0;
Abduction.Saucer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Abduction.Saucer.prototype.constructor = Abduction.Saucer;
