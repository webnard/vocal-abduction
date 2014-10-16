define(function() {
  var PURPLE = 0xD7BBF9;
  var WHITE = 0xFFFFFF;

  function Container(title, width, height) {
    PIXI.DisplayObjectContainer.call(this);

    var rect = new PIXI.Graphics();
    rect.beginFill(PURPLE);
    rect.drawRect(0, 0, width, height);
    rect.opacity = 0.5;

    var text = new Text(title, {
      fill: WHITE,
      font: 'bold 20px Fjalla One',
      wordWrap: true
    });
    text.x = 0; // TODO: center
    text.y = 0;

    this.addChild(rect);
    this.addChild(text);
  };

  Container.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Container.prototype.constructor = Container;

  return Container;
});
