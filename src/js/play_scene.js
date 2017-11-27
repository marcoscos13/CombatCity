'use strict';

var player;
var cursors;

var PlayScene = {
    create: function(){
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();
        player = new Collider(this.game, 500, 500, 'tank');
    },
    
    update: function(){

    }
};

module.exports = PlayScene;

function Par(x, y)
{
    this._x=x;
    this._y=y;
}

////////////////
/////CLASES/////
////////////////

//Clase Collider y sus métodos
var Collider = function (game, posX, posY, sprite) {
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    this.anchor.setTo(0.5, 0.5);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.smoothed = false;
    this.scale.setTo(3, 3);
    game.add.existing(this);
};

Collider.prototype = Object.create(Phaser.Sprite.prototype);
Collider.prototype.constructor = Collider;