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
var Shooter = function(game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this._bulletsGroup = bulletsGroup;
    this._bulletVel = bulletVel;
    this._bulletTime = bulletTime;
    this._bulletSince = 0;
    this._game = game;
}

Shooter.prototype = Object.create(Movable.prototype);
Shooter.prototype.constructor = Shooter;
Shooter.prototype.fire_bullet = function()
{ //Función para disparar
    if (this._game.time.now > this._bulletSince)
    {
        var bullet = this._bulletsGroup.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(this.x, this.y);
            bullet.body.velocity.y = this._bulletVel * this._direction._y;
            bullet.body.velocity.x = this._bulletVel * this._direction._x;
            this._bulletSince = this._game.time.now + this._bulletTime;
        }
    }
}

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, cursors, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, sprite]);
    //Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this._cursors = cursors;
    this._direction._x = 0;
    this._direction._y = -1;
    this.angle = 0;
    this._dirStack = new SmartStack();
    this._dirChar = ' ';
}

//Player.prototype = Object.create(Shooter.prototype);
Player.prototype = Object.create(Shooter.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    if (!this._cursors.left.isDown && !this._cursors.right.isDown && !this._cursors.down.isDown && !this._cursors.up.isDown)
        this._dirChar = ' ';
    else this._dirChar = this._dirStack.top.data;

    this._cursors.left.onDown.add(function(){
        this._dirStack.push('l');
    }, this);
    this._cursors.right.onDown.add(function(){
        this._dirStack.push('r');
    }, this);
    this._cursors.down.onDown.add(function(){
        this._dirStack.push('d');
    }, this);
    this._cursors.up.onDown.add(function(){
        this._dirStack.push('u');
    }, this);
    this._cursors.left.onUp.add(function(){
        this._dirStack.remove('l');
    }, this);
    this._cursors.right.onUp.add(function(){
        this._dirStack.remove('r');
    }, this);
    this._cursors.down.onUp.add(function(){
        this._dirStack.remove('d');
    }, this);
    this._cursors.up.onUp.add(function(){
        this._dirStack.remove('u');
    }, this);

    

    // if (!this._cursors.left.isDown && !this._cursors.right.isDown && !this._cursors.down.isDown && !this._cursors.up.isDown)
    //     this._dirChar = ' ';
    // else this._dirChar = this._dirStack.top.data;

    if (this._dirChar === 'l'){
        if (this._direction._x !== 0){
            this.y = 24 * Math.round(this.y/24);
        }
        this.body.velocity.y = 0;
        this.body.velocity.x = -this._velocity._x;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 180;
    }
    else if (this._dirChar === 'r'){
        if (this._direction._x !== 0){
            this.y = 24 * Math.round(this.y/24);
        }
        this.body.velocity.y = 0;
        this.body.velocity.x = this._velocity._x;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 0;
    }
    else if (this._dirChar === 'd'){
        if (this._direction._y !== 0){
            this.x = 24 * Math.round(this.x/24);
        }
        this.body.velocity.x = 0;
        this.body.velocity.y = this._velocity._y;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 90;
    }
    else if (this._dirChar === 'u'){
        if (this._direction._y !== 0){
            this.x = 24 * Math.round(this.x/24);
        }
        this.body.velocity.x = 0;
        this.body.velocity.y = -this._velocity._y;
        this._direction._x = 0;
        this._direction._y = -1;
        this.angle = 270;
    }
    else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    // if (this._cursors.left.isDown)
    // {
    //     if (this._direction._x !== 0){
    //         this.y = 24 * Math.round(this.y/24);
    //     }
    //     this.body.velocity.y = 0;
    //     this.body.velocity.x = -this._velocity._x;
    //     this._direction._x = -1;
    //     this._direction._y = 0;
    //     this.angle = 180;
    // }
    // else if (this._cursors.right.isDown)
    // {
        // if (this._direction._x !== 0){
        //     this.y = 24 * Math.round(this.y/24);
        // }
        // this.body.velocity.y = 0;
        // this.body.velocity.x = this._velocity._x;
        // this._direction._x = 1;
        // this._direction._y = 0;
        // this.angle = 0;
    // }
    // else if (this._cursors.down.isDown)
    // {
        // if (this._direction._y !== 0){
        //     this.x = 24 * Math.round(this.x/24);
        // }
        // this.body.velocity.x = 0;
        // this.body.velocity.y = this._velocity._y;
        // this._direction._x = 0;
        // this._direction._y = 1;
        // this.angle = 90;
    // }
    // else if (this._cursors.up.isDown)
    // {
        // if (this._direction._y !== 0){
        //     this.x = 24 * Math.round(this.x/24);
        // }
        // this.body.velocity.x = 0;
        // this.body.velocity.y = -this._velocity._y;
        // this._direction._x = 0;
        // this._direction._y = -1;
        // this.angle = 270;
    // }else{
        // this.body.velocity.x = 0;
        // this.body.velocity.y = 0;
    // }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        this.fire_bullet();
    }
}
