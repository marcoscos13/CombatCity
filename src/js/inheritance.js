'use strict';

////////////////
/////CLASES/////
////////////////

////Clase Explosion
var SingleAnimation = function (game, pos, scale, animID) {
    Phaser.Sprite.call(this, game, pos._x, pos._y, 'sprites_atlas', 'powerup_star');
    if (animID == "explosion"){ //Animacion de explosion
        this.animations.add('explosion', ['powerup_star', 'powerup_tank', 'powerup_helmets'], 1, false);
        this.animations.play('explosion', 6, false, true);
    }
    else if (animID == "enemySpawn"){ //Animacion que indica donde va a spawnear un enemigo
        this.animations.add('enemySpawn', ['powerup_star', 'powerup_tank', 'powerup_helmets'], 1, false);
        this.animations.play('enemySpawn', 3, false, true);
    }

    this.smoothed = false;
    this._scale = scale;
    this.scale.setTo(scale._x, scale._y);
    this.anchor.setTo(0.5, 0.5);
    game.add.existing(this);
};

SingleAnimation.prototype = Object.create(Phaser.Sprite.prototype);
SingleAnimation.prototype.constructor = SingleAnimation;

////Clase Collider y sus métodos
var Collider = function (game, pos, scale, sprite, spriteID) {
    Phaser.Sprite.call(this, game, pos._x, pos._y, sprite, spriteID);
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

////Clase Block y sus métodos
var Block = function (game, pos, scale, sprite, spriteID, bType){
    Collider.apply(this, [game, pos, scale, sprite, spriteID]);
    this.blockType = bType;
}

Block.prototype = Object.create(Collider.prototype);
Block.prototype.constructor = Block;

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
var Shooter = function(game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, hasSound, sprite){
    Movable.apply(this, [game, pos, scale, vel, dir, sprite]);
    this._bulletsGroup = bulletsGroup;
    this._bulletVel = bulletVel;
    this._bulletTime = bulletTime;
    this._bulletSince = 0;
    this._game = game;
    this._hasSound = hasSound;
    this.audioDisparo = game.add.audio('shoot');
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
        //console.debug(this._bulletsGroup.getFirstExists(false));
        var bullet = this._bulletsGroup.getFirstExists(false);
        if (bullet)
        {
            if (this._hasSound) this.audioDisparo.play();
            bullet.angle = 0;
            if (bullet.scale.x < 0)
                bullet.scale.x *= -1;

            bullet._direction._x = this._direction._x;
            bullet._direction._y = this._direction._y;
            bullet.reset(this.x, this.y);
            bullet.body.velocity.y = this._bulletVel * this._direction._y;
            bullet.body.velocity.x = this._bulletVel * this._direction._x;
            this._bulletSince = this._game.time.now + this._bulletTime;
            if (this._direction._x != 0){
                bullet.scale.x *= this._direction._x;
            }
            else{
                bullet.scale.y *= this._direction._y;
                if (this._direction._y == 1)
                    bullet.angle = 90;
                else
                    bullet.angle = 270;
            }
        }
    }
}

////Clase Player y sus métodos
var Player = function(game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, cursors, sprite){
    Shooter.apply(this, [game, pos, scale, vel, dir, bulletsGroup, bulletVel, bulletTime, true, sprite]);
    this._cursors = cursors;
    this.angle = 0;
    this.dirStack = new SmartStack();
    this.dirChar = ' ';
    this.tankLevel = 1;
    this.boolL = false;
    this.boolR = false;
    this.boolD = false;
    this.boolU = false;
    this.lives = 3;
    this.canMove = true;
    this.helmet = false;

    this.animations.add('player1_level1_right', ['player1_level1_right1', 'player1_level1_right2'], 4, true);
    this.animations.add('player1_level2_right', ['player1_level2_right1', 'player1_level2_right2'], 4, true);
    this.animations.add('player1_level3_right', ['player1_level3_right1', 'player1_level3_right2'], 4, true);
    this.animations.add('player1_level4_right', ['player1_level4_right1', 'player1_level4_right2'], 4, true);

    this.animations.add('player1_level1_left', ['player1_level1_left1', 'player1_level1_left2'], 4, true);
    this.animations.add('player1_level2_left', ['player1_level2_left1', 'player1_level2_left2'], 4, true);
    this.animations.add('player1_level3_left', ['player1_level3_left1', 'player1_level3_left2'], 4, true);
    this.animations.add('player1_level4_left', ['player1_level4_left1', 'player1_level4_left2'], 4, true);

    this.animations.add('player1_level1_up', ['player1_level1_up1', 'player1_level1_up2'], 4, true);
    this.animations.add('player1_level2_up', ['player1_level2_up1', 'player1_level2_up2'], 4, true);
    this.animations.add('player1_level3_up', ['player1_level3_up1', 'player1_level3_up2'], 4, true);
    this.animations.add('player1_level4_up', ['player1_level4_up1', 'player1_level4_up2'], 4, true);

    this.animations.add('player1_level1_down', ['player1_level1_down1', 'player1_level1_down2'], 4, true);
    this.animations.add('player1_level2_down', ['player1_level2_down1', 'player1_level2_down2'], 4, true);
    this.animations.add('player1_level3_down', ['player1_level3_down1', 'player1_level3_down2'], 4, true);
    this.animations.add('player1_level4_down', ['player1_level4_down1', 'player1_level4_down2'], 4, true);

    this._destroySound = game.add.audio('boomplayer');

    //Inicializa el player mirando hacia arriba
    this._direction._x = 0;
    this._direction._y = -1;
    this.animations.play('player1_level1_up');
    this.animations.stop();
}

//Player.prototype = Object.create(Shooter.prototype);
Player.prototype = Object.create(Shooter.prototype);
Player.prototype.constructor = Player;

Player.prototype.resetPos = function(){
    var posPlayer = new Par(this.x, this.y);
    var objectsScale = new Par(3,3);
    new SingleAnimation(this.game, posPlayer, objectsScale, "explosion");
    this.animations.play('player1_level1_up');
    this._direction._x = 0;
    this._direction._y = -1;
    if (this.lives >= 0){
        var posTemp = getCenteredCell(this.game, 48, 4, 12);
        this.x = posTemp._x;
        this.y = posTemp._y;
    }else{
        this.x = -100;
        this.y = -100;
        this.visible = false;
    }
    this.helmet = false;
    if (this.tankLevel >= 3){
        if (this._bulletsGroup.length > 1)
            this._bulletsGroup.remove(this._bulletsGroup.getFirstExists(false));
    }
    this._bulletVel = 300;
    this.tankLevel = 1;
}

Player.prototype.helmet_off = function(){
    this.helmet = false;
}

Player.prototype.update = function(){
    if (this.canMove){
        if (!this._cursors.left.isDown && !this._cursors.right.isDown && !this._cursors.down.isDown && !this._cursors.up.isDown)
            this.dirChar = ' ';
        else if (this.dirStack.size > 0)
            this.dirChar = this.dirStack.top.data;

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
            this.animations.play('player1_level' + this.tankLevel + '_left')
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
            this.animations.play('player1_level' + this.tankLevel + '_right')
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
            this.animations.play('player1_level' + this.tankLevel + '_down')
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
            this.animations.play('player1_level' + this.tankLevel + '_up')
        }
        else{
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.animations.stop();
        }

        //Disparo
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.fire_bullet(true);
        }
    }else{
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}

var Enemy = function(game, pos, scale, bulletsGroup, bulletN, typeId){
    if (typeId === 'armor'){
        Shooter.apply(this, [game, pos, scale, new Par(70, 70), new Par(0, 1), bulletsGroup, 300, 500, false, 'sprites_atlas']);
        this._lives = 3;
        this.animations.add('enemy_armor_right', ['enemy_armor_right1', 'enemy_armor_right2'], 4, true);
        this.animations.add('enemy_armor_left', ['enemy_armor_left1', 'enemy_armor_left2'], 4, true);
        this.animations.add('enemy_armor_up', ['enemy_armor_up1', 'enemy_armor_up2'], 4, true);
        this.animations.add('enemy_armor_down', ['enemy_armor_down1', 'enemy_armor_down2'], 4, true);
        this.animations.play('enemy_armor_down');
    }
    else if (typeId === 'power'){
        Shooter.apply(this, [game, pos, scale, new Par(100, 100), new Par(0, 1), bulletsGroup, 400, 500, false, 'sprites_atlas']);
        this._lives = 1;
        this.animations.add('enemy_power_right', ['enemy_power_right1', 'enemy_power_right2'], 4, true);
        this.animations.add('enemy_power_left', ['enemy_power_left1', 'enemy_power_left2'], 4, true);
        this.animations.add('enemy_power_up', ['enemy_power_up1', 'enemy_power_up2'], 4, true);
        this.animations.add('enemy_power_down', ['enemy_power_down1', 'enemy_power_down2'], 4, true);
        this.animations.play('enemy_power_down');
    }
    else if (typeId === 'fast'){
        Shooter.apply(this, [game, pos, scale, new Par(150, 150), new Par(0, 1), bulletsGroup, 400, 500, false, 'sprites_atlas']);
        this._lives = 1;
        this.animations.add('enemy_fast_right', ['enemy_fast_right1', 'enemy_fast_right2'], 4, true);
        this.animations.add('enemy_fast_left', ['enemy_fast_left1', 'enemy_fast_left2'], 4, true);
        this.animations.add('enemy_fast_up', ['enemy_fast_up1', 'enemy_fast_up2'], 4, true);
        this.animations.add('enemy_fast_down', ['enemy_fast_down1', 'enemy_fast_down2'], 4, true);
        this.animations.play('enemy_fast_down');
    }
    else{
        Shooter.apply(this, [game, pos, scale, new Par(100, 100), new Par(0, 1), bulletsGroup, 300, 1000, false, 'sprites_atlas']);
        this._lives = 1;
        this.animations.add('enemy_basic_right', ['enemy_basic_right1', 'enemy_basic_right2'], 4, true);
        this.animations.add('enemy_basic_left', ['enemy_basic_left1', 'enemy_basic_left2'], 4, true);
        this.animations.add('enemy_basic_up', ['enemy_basic_up1', 'enemy_basic_up2'], 4, true);
        this.animations.add('enemy_basic_down', ['enemy_basic_down1', 'enemy_basic_down2'], 4, true);
        this.animations.play('enemy_basic_down');
    }
    this._typeId = typeId;
    this._hitSound = game.add.audio('enemyhurt');
    this._destroySound = game.add.audio('boomenemy');
    this._bulletN = bulletN;
    this._moving = true;
    this._velxAux = this._velocity._x;
    this._velyAux = this._velocity._y;
    this.body.immovable = true;
    this._changeStarted = false;
    this._changeCalled = false;
    this._timer = this.game.time.create(false);
    this._timerbullets = this.game.time.create(true);
    // this.body.onCollide = new Phaser.Signal();
    // this.body.onCollide.add(function(){
    //     if (this._velocity._x !== 0 || this._velocity._y !== 0){
    //         this.stop();
    //         this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.change_dir, this);
    //     }
    // }, this);
    this._timerbullets.loop(this.game.rnd.realInRange(400, 600), this.fire_bullet, this);
    this._timerbullets.start();
}

Enemy.prototype = Object.create(Shooter.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    if(!this._changeStarted){
        this._changeStarted = true;
        this._timer.loop(this.game.rnd.realInRange(2000, 5000), this.change_dir, this);
        this._timer.start();
    }
    if(this._moving){
        this.body.velocity.x = this._direction._x * this._velocity._x;
        this.body.velocity.y = this._direction._y * this._velocity._y;
    }
}

Enemy.prototype.stop = function(){
    this._velocity._x = 0;
    this._velocity._y = 0;
}
Enemy.prototype.change_dir = function(){
    this._changeCalled = false;
    
    var dirxaux = this._direction._x;
    var diryaux = this._direction._y;
    
    while(dirxaux === this._direction._x && diryaux === this._direction._y){
        var rnd = this.game.rnd.integerInRange(1, 4);
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
    }

    if (this._direction._x === 1){
        this.animations.play('enemy_' + this._typeId + '_right');
        this.y += this.gapW;
        this.y = 24 * Math.round(this.y/24) - this.gapW;
    }
    else if (this._direction._x === -1){
        this.animations.play('enemy_' + this._typeId + '_left');
        this.y += this.gapW;
        this.y = 24 * Math.round(this.y/24) - this.gapW;
    }
    else if (this._direction._y === 1){
        this.animations.play('enemy_' + this._typeId + '_down');
        this.x += this.gapH;
        this.x = 24 * Math.round(this.x/24) - this.gapH;
    }
    else if (this._direction._y === -1){
        this.animations.play('enemy_' + this._typeId + '_up');
        this.x += this.gapH;
        this.x = 24 * Math.round(this.x/24) - this.gapH;
    }

    if (this._velocity._x === 0 && this._velocity._y === 0){
        this._timer.start();
        this._velocity._x = this._velxAux;
        this._velocity._y = this._velyAux;
    }
}