'use strict';

////////////////
/////CLASES/////
////////////////

////Clase Collider y sus métodos
var Collider = function (game, pos, scale, sprite) {
    Phaser.Sprite.call(this, game, pos._x, pos._y, sprite);
    game.physics.enable(this, Phaser.Physics.ARCADE); //Activa las fisicas arcade para este objeto
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.smoothed = false;
    this._scale = scale;
    this.scale.setTo(scale._x, scale._y);
    this.anchor.setTo(0.5, 0.5);
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
var Shooter = function(game, pos, scale, vel, dir, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
}

Shooter.prototype = Object.create(Movable.prototype);
Shooter.prototype.constructor = Shooter;
Shooter.prototype.fire_bullet = function()
{ //Función para disparar

}

Shooter.prototype.set_fireRate = function(newRate){

}

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, cursors, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, sprite]);
    //Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this.scale.setTo(this._scale._x * 0.875, this._scale._y * 0.875);
    this._cursors = cursors;
    this._direction._x = 0;
    this._direction._y = -1;
    this.angle = 0;
}

//Player.prototype = Object.create(Shooter.prototype);
Player.prototype = Object.create(Movable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    
    if (this._cursors.left.isDown)
    {
        this.body.velocity.y = 0;
        this.body.velocity.x = -this._velocity._x;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 180;
    }
    else if (this._cursors.right.isDown)
    {
        this.body.velocity.y = 0;
        this.body.velocity.x = this._velocity._x;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 0;
    }
    else if (this._cursors.down.isDown)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = this._velocity._y;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 90;
    }
    else if (this._cursors.up.isDown)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = -this._velocity._y;
        this._direction._x = 0;
        this._direction._y = -1;
        this.angle = 270;
    }else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}
