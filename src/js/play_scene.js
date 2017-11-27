'use strict';

var player;
var cursors;

var PlayScene = {
    create: function(){
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();
        var playerPos = new Par(500, 500);
        var playerScale = new Par(3, 3);
        var playerVel = new Par(5, 5);
        var playerDir = new Par (0, 0);
        player = new Player(this.game, playerPos, playerScale, playerVel, playerDir, 150, cursors, 'tank');
    },
    
    update: function(){

    }
};

module.exports = PlayScene;

//'Struct' para pares
function Par(x, y)
{
    this._x=x;
    this._y=y;
}

////////////////
/////CLASES/////
////////////////

////Clase Block

var Block = function(){
    
}

////Clase Collider y sus métodos
var Collider = function (game, pos, scale, sprite) {
    Phaser.Sprite.call(this, game, pos._x, pos._y, sprite);
    this.anchor.setTo(0.5, 0.5);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.smoothed = false;
    this.scale.setTo(scale._x, scale._y);
    game.add.existing(this);
};

Collider.prototype = Object.create(Phaser.Sprite.prototype);
Collider.prototype.constructor = Collider;

////Clase Movable y sus métodos
var Movable = function (game, pos, scale, vel, dir, sprite){
    Collider.apply(this, [game, pos, scale, sprite]);
    this._velocity = vel;
    this._direction = dir;
}

Movable.prototype = Object.create(Collider.prototype);
Movable.prototype.constructor = Movable;
Movable.prototype.set_velocity = function()
{ //Función para cambiar la velocidad
    this._velocity._x = velocity._x;
    this._velocity._y = velocity._y;
}
Movable.prototype.update = function()
{ //Update de los móviles
    // this.x += this._direction._x * this._velocity._x;
    // this.y += this._direction._y * this._velocity._y;
}

////Clase Bullet y sus métodoss
var Bullet = function (game, pos, scale, vel, dir, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
}

Bullet.prototype = Object.create(Movable.prototype);
Bullet.prototype.constructor = Bullet;

////Clase Shooter y sus métodos
var Shooter = function(game, pos, scale, vel, dir, bulletTime, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this._bulletTime = bulletTime;
}

Shooter.prototype = Object.create(Movable.prototype);
Shooter.prototype.constructor = Shooter;
Shooter.prototype.fire_bullet = function()
{ //Función para disparar
    if (getCurrentTime() > this._bulletTime)
    {
        var bulletPos = new Par(this.x + 6, this.y - 8);
        var bulletScale = new Par(1, 1);
        var bulletVel = new Par(10, 10);
        //bullet = new Bullet(game, bulletPos, bulletScale, bulletVel, this._direction, 'bullet');
        this._bulletTime = getCurrentTime() + 150;
    }

    function getCurrentTime(){
        var currentdate = new Date();
        return currentdate.getMilliseconds();
    }
}
Shooter.prototype.set_bulletTime = function(newTime){
    this._bulletTime = newTime;
}

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, bulletTime, cursors, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, bulletTime, sprite]);
    this._cursors = cursors;
    this._direction._x = 0;
    this._direction._y = -1;
    this.angle = 0;
}

Player.prototype = Object.create(Shooter.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    if (this._cursors.left.isDown)
    {
        this.x -= this._velocity._x;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 270;
    }
    else if (this._cursors.right.isDown)
    {
        this.x += this._velocity._x;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 90;
    }
    else if (this._cursors.down.isDown)
    {
        this.y += this._velocity._y;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 180;
    }
    else if (this._cursors.up.isDown)
    {
        this.y -= this._velocity._y;
        this._direction._x = 0;
        this._direction._y = -1;
        this.angle = 0;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        this.fire_bullet();
    }
}