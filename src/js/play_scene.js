'use strict';

var player;
var cursors;

var PlayScene = {
    create: function(){
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();

        //Creación del player
        var playerPos = new Par(500, 500);
        var playerScale = new Par(3, 3);
        var playerVel = new Par(5, 5);
        var playerDir = new Par (0, 0);
            //Balas y arma del jugador
        var playerWeapon = new Movable(this.game, playerPos, playerScale, playerVel, 'bullet');
        playerWeapon = this.game.add.weapon(30, 'bullet');
        playerWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        playerWeapon.bullets.forEach((b) => {
            b.scale.setTo(1, 1);
            b.body.updateBounds();
        }, this);
        playerWeapon.bulletAngleOffset = 90; //Ángulo
        playerWeapon.bulletSpeed = 600; //Velocidad
        playerWeapon.fireRate = 500; //FireRate 
        player = new Player(this.game, playerPos, playerScale, playerVel, playerDir, playerWeapon,  cursors, 'tank');
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
var Shooter = function(game, pos, scale, vel, dir, weapon, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this._weapon = weapon;
    this._weapon.trackSprite(this, 0, 0);
    this._weapon.trackRotation = true;
}

Shooter.prototype = Object.create(Movable.prototype);
Shooter.prototype.constructor = Shooter;
Shooter.prototype.fire_bullet = function()
{ //Función para disparar
    this._weapon.fire();
}

Shooter.prototype.set_fireRate = function(newRate){
    this._weapon.fireRate = newRate;
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
        this.x -= this._velocity._x;
        this._direction._x = -1;
        this._direction._y = 0;
        this.angle = 180;
    }
    else if (this._cursors.right.isDown)
    {
        this.x += this._velocity._x;
        this._direction._x = 1;
        this._direction._y = 0;
        this.angle = 0;
    }
    else if (this._cursors.down.isDown)
    {
        this.y += this._velocity._y;
        this._direction._x = 0;
        this._direction._y = 1;
        this.angle = 90;
    }
    else if (this._cursors.up.isDown)
    {
        this.y -= this._velocity._y;
        this._direction._x = 0;
        this._direction._y = -1;
        this.angle = 270;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        this.fire_bullet();
    }
}