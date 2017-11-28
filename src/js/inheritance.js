'use strict';

//'Struct' para pares
function Par(x, y)
{
    this._x=x;
    this._y=y;
}

////Clase Collider y sus métodos
var Collider = function (game, pos, scale, sprite) {
    Phaser.Sprite.call(this, game, pos._x, pos._y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE); //Activa las fisicas arcade para este objeto
    this.anchor.setTo(0.5, 0.5);
    this.enableBody = true;
    //this.physicsBodyType = Phaser.Physics.ARCADE;
    this.smoothed = false;
    this.scale.setTo(scale._x, scale._y);
    game.add.existing(this);
}

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
var Shooter = function(game, pos, scale, vel, dir, weapon, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    var self = this;
    this._weapon = weapon;
    this._weapon.trackSprite(this, 0, 0);
    this._weapon.trackRotation = true;
    this._weapon.onKill = new Phaser.Signal();
    this._weapon.onKill.add(function() {
        self._weapon.resetShots();
    });
}

Shooter.prototype = Object.create(Movable.prototype);
Shooter.prototype.constructor = Shooter;
Shooter.prototype.fire_bullet = function()
{ //Función para disparar
    this._weapon.fire();
}

Shooter.prototype.set_fireLimit = function(newFireLimit){
    this._weapon.fireLimit = newFireLimit;
}

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, weapon, cursors, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, weapon, sprite]);
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
        this.body.velocity.y = 0;
        this.body.velocity.x = -300;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 180;
    }
    else if (this._cursors.right.isDown)
    {
        this.body.velocity.y = 0;
        this.body.velocity.x = 300;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 0;
    }
    else if (this._cursors.down.isDown)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 300;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 90;
    }
    else if (this._cursors.up.isDown)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = -300;
        this._direction._x = 0;
        this._direction._y = -1;
        this.angle = 270;
    }else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        this.fire_bullet();
    }
}