'use strict';

var player;
var cursors;
var bloquesGroup;
var bulletsGroup;

var bulletTime = 0;
var bullet;

var PlayScene = {
    create: function(){
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        //Creación del player
        var playerPos = new Par(400, 500);
        var playerScale = new Par(3, 3);
        var playerVel = new Par(5, 5);
        var playerDir = new Par (0, 0);

        //Balas y arma del jugador

        //Se inicializa el grupo de las balas
        bulletsGroup = this.game.add.group();
        bulletsGroup.enableBody = true;
        bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;
    
        //Se crean las balas y se añaden al grupo
        for (var i = 0; i < 1; i++){ //i = numero de balas
            var b = this.game.add.sprite(0, 0, 'bullet');
            b.name = "bullet" + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.anchor.setTo(0.5, 0.5);
            b.events.onOutOfBounds.add(resetBullet, this);
            bulletsGroup.add(b);
        }

        //Player
        player = new Player(this.game, playerPos, playerScale, playerVel, playerDir, cursors, 'tank');
        player.body.collideWorldBounds = true;
        player._direction._x = 1;
        player._direction._y = 0;
        
        //Creación de Bloques
        bloquesGroup = this.game.add.group();
        bloquesGroup.enableBody = true;
        bloquesGroup.physicsBodyType = Phaser.Physics.ARCADE;

        var BloqueTam = new Par(48, 48);
        for (var j = 0; j < 13; j++){
            for (var k = 0; k < 13; k++){
                var BloquePos = new Par(48 * j + 24, 48 * k + 24);
                var b = new Collider(this.game, BloquePos, playerScale, 'bullet');
                b.body.immovable = true;
                b.body.collideWorldBounds = true;
                bloquesGroup.add(b);
            }
        }
    },
    
    update: function(){
        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.overlap(bulletsGroup, bloquesGroup, collisionHandler, null, this);

        //Provisional, esto hay que meterlo en el update de Player ---------------------------------------------------------------------
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fireBullet(this);
        }
    },

    render: function(){
        this.game.debug.text( "Testing Scene", 50, 50 );
        this.game.debug.text( "Direction X: " + player._direction._x, 50, 80 );
        this.game.debug.text( "Direction Y: " + player._direction._y, 50, 110 );
    }
};

module.exports = PlayScene;

function collisionHandler (bulletsgroup, bloque) {
        bulletsGroup.kill();
        bloquesGroup.kill();
}

//'Struct' para pares
function Par(x, y)
{
    this._x=x;
    this._y=y;
}

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

// ////Clase Shooter y sus métodos
// var Shooter = function(game, pos, scale, vel, dir, weapon, sprite){
//     Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
//     var self = this;
//     this._weapon = weapon;
//     this._weapon.trackSprite(this, 0, 0);
//     this._weapon.trackRotation = true;
//     this._weapon.onKill = new Phaser.Signal();
//     this._weapon.onKill.add(function() {
//         self._weapon.resetShots();
//     });
// }

// Shooter.prototype = Object.create(Movable.prototype);
// Shooter.prototype.constructor = Shooter;
// Shooter.prototype.fire_bullet = function()
// { //Función para disparar
//     this._weapon.fire();
// }

// Shooter.prototype.set_fireRate = function(newRate){
//     this._weapon.fireRate = newRate;
// }

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, cursors, sprite){
    //Shooter.apply(this, [game, pos, scale, vel, dir, weapon, sprite]);
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
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
}

 //Provisional, este método tiene que ir dentro de Player ---------------------------------------------------------------------
function fireBullet (game) {
    if (game.time.now > bulletTime)
    {
        bullet = bulletsGroup.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x, player.y);
            bullet.body.velocity.y = 300 * player._direction._y;
            bullet.body.velocity.x = 300 * player._direction._x;
            bulletTime = game.time.now + 150;
        }
    }
}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();
}

//  Called if the bullet hits one of the block sprites
function collisionHandler (bullet, block) {
    bullet.kill();
    block.kill();

}