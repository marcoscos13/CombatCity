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

// Movable.prototype.set_velocity = function()
// { //Función para cambiar la velocidad
//     this._velocity._x = velocity._x;
//     this._velocity._y = velocity._y;
// }
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
    this.body.static = true;
    var grayW = (this.game.height - 48*13)/2;
    var grayH = (this.game.width - 48*13)/2;
    this.gapW = grayW - Math.trunc(grayW/24)*24;
    if (this.gapW > 12) this.gapW = 24-this.gapW;
    this.gapH = grayH - Math.trunc(grayH/24)*24;
    if (this.gapH > 12) this.gapH = 24-this.gapH;
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
    this.angle = 0;
    this.dirStack = new SmartStack();
    this.dirChar = ' ';
    this.boolL = false;
    this.boolR = false;
    this.boolD = false;
    this.boolU = false;
    // console.debug("GapW: " + this.gapW);
    // console.debug("GapH: " + this.gapH);
}

//Player.prototype = Object.create(Shooter.prototype);
Player.prototype = Object.create(Shooter.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){

    if (!this._cursors.left.isDown && !this._cursors.right.isDown && !this._cursors.down.isDown && !this._cursors.up.isDown)
        this.dirChar = ' ';
    else this.dirChar = this.dirStack.top.data;

    this._cursors.left.onDown.add(function(){
        if(!this.boolL){
            this.dirStack.push('l');
            this.boolL = true;
        }
    }, this);
    this._cursors.right.onDown.add(function(){
        if(!this.boolR){
            this.dirStack.push('r');
            this.boolR = true;
        }
    }, this);
    this._cursors.down.onDown.add(function(){
        if(!this.boolD){
            this.dirStack.push('d');
            this.boolD = true;
        }
    }, this);
    this._cursors.up.onDown.add(function(){
        if(!this.boolU){
            this.dirStack.push('u');
            this.boolU = true;
        }
    }, this);
    this._cursors.left.onUp.add(function(){
        if(this.boolL){
            this.dirStack.remove('l');
            this.boolL = false;
        }
    }, this);
    this._cursors.right.onUp.add(function(){
        if(this.boolR){
            this.dirStack.remove('r');
            this.boolR = false;
        }
    }, this);
    this._cursors.down.onUp.add(function(){
        if(this.boolD){
            this.dirStack.remove('d');
            this.boolD = false;
        }
    }, this);
    this._cursors.up.onUp.add(function(){
        if(this.boolU){
            this.dirStack.remove('u');
            this.boolU = false;
        }
    }, this);

    ////////////////////////////////////////////////////////

    if (this.dirChar === 'l'){
        if (this._direction._x !== 0){
            this.y += this.gapW;
            this.y = 24 * Math.round(this.y/24) - this.gapW;
        }
        this.body.velocity.y = 0;
        this.body.velocity.x = -this._velocity._x;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 180;
    }
    else if (this.dirChar === 'r'){
        if (this._direction._x !== 0){
            this.y += this.gapW;
            this.y = 24 * Math.round(this.y/24) - this.gapW;
        }
        this.body.velocity.y = 0;
        this.body.velocity.x = this._velocity._x;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 0;
    }
    else if (this.dirChar === 'd'){
        if (this._direction._y !== 0){
            this.x += this.gapH;
            this.x = 24 * Math.round(this.x/24) - this.gapH;
        }
        this.body.velocity.x = 0;
        this.body.velocity.y = this._velocity._y;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 90;
    }
    else if (this.dirChar === 'u'){
        if (this._direction._y !== 0){
            this.x += this.gapH;
            this.x = 24 * Math.round(this.x/24) - this.gapH;
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

    //Disparo
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.fire_bullet();
    }
}

var Enemy = function(game, pos, scale, vel, dir , bulletsGroup, bulletVel, bulletTime, lives, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, sprite]);
    this.angle = 0;
    this._lives = lives;
    this.body.onCollide = new Phaser.Signal();
    this.body.onCollide.add(function(){
        var rnd = game.rnd.integerInRange(1, 4);
        if(rnd === 1){
            this._direction._x = 1;
            this._direction._y = 0;
        }
        else if (rnd === 2){
            this._direction._x = -1;
            this._direction._y = 0;
        }
        else if (rnd === 3){
            this._direction._y = 1;
            this._direction._x = 0;
        }
        else if (rnd === 4){
            this._direction._y = -1;
            this._direction._x = 0;
        }

        if (this._direction._x === 1){
            this.angle = 0;
            this.y += this.gapW;
            this.y = 24 * Math.round(this.y/24) - this.gapW;
        }
        else if (this._direction._x === -1){
            this.angle = 180;
            this.y += this.gapW;
            this.y = 24 * Math.round(this.y/24) - this.gapW;
        }
        else if (this._direction._y === 1){
            this.angle = 90;
            this.x += this.gapH;
            this.x = 24 * Math.round(this.x/24) - this.gapH;
        }
        else if (this._direction._y === -1){
            this.angle = 270;
            this.x += this.gapH;
            this.x = 24 * Math.round(this.x/24) - this.gapH;
        }
    }, this);
}

Enemy.prototype = Object.create(Shooter.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    this.body.velocity.x = this._direction._x * this._velocity._x;
    this.body.velocity.y = this._direction._y * this._velocity._y;
    //this.changeDir();
}
// Enemy.prototype.changeDir = function(){
//     this._direction._x = this.game.rnd.integerInRange(-1, 1);
//     this._direction._y = this.game.rnd.integerInRange(-1, 1);
//     if(this._direction._x === 0){
//         while (this._direction._y === 0) this._direction._y = this.game.rnd.integerInRange(-1, 1);
//     }
//     else this._direction._y = 0;
//     if (this._direction._x === 1) this.angle = 0;
//     else if (this._direction._x === -1) this.angle = 180;
//     else if (this._direction._y === 1) this.angle = 90;
//     else if (this._direction._y === -1) this.angle = 270;
// }