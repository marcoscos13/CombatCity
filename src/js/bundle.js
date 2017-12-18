(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
//var TestScene = require('./test_scene.js');
//var TestScene2 = require('./test_scene2.js');
//var Stack = require('./stack.js');
//var Inheritance = require('./inheritance.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    // this.game.load.baseURL = 'https://marcoscos13.github.io/CombatCity/src/';
    // this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('bullet', 'images/bullet.png');
    this.game.load.image('game_over', 'images/game_over.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('white', 'images/white.png');
    this.game.load.image('grey', 'images/grey.png');
    this.game.load.atlas('sprites_atlas', 'images/sprites_atlas.png', 'images/sprites_atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(900, 700, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene); //Escena de juego

  game.state.start('boot');
};

},{"./play_scene.js":2}],2:[function(require,module,exports){
'use strict';


var cursors;

var objectsScale = new Par(3, 3);
var blockSize = 48;

var bloquesGroup;
var waterGroup;
var iceGroup;
var wallsGroup;

//Player
var player;
var playerBullets;

var bulletVel;
var bulletTime;
var bullet;
var bulletCollider;

//Powerups
var powerupTypes = ['powerup_star', 'powerup_tank', 'powerup_helmets', 'powerup_star'];

//Enemies
var enemy;
var enemyGroup;
var enemyBullets1;
var enemyBullets2;
var enemyBullets3;
var enemyBullets4;
var bulletsUsed1 = false;
var bulletsUsed2 = false;
var bulletsUsed3 = false;
var bulletsUsed4 = false;

var enemyBulletCollider;

var spawnIndex = 0;
var spawnPos = new Array();
var spawnCount = -1;
var enemyCount = 0;
var enemyKilledCount = 0;
var spawned = false;

//PowerUps
var powerupsGroup;

var levelData;
var levelN = 1;
var tankL = 1;

var gameover = false;
var gameoverSprite;

var hq;
var tempBool = false;

var PlayScene = {
    preload: function(){
        this.load.text('levels', 'levels/levels.json');
        resetScene();
    },

    create: function(){
        levelData = JSON.parse(this.game.cache.getText('levels')); //Parsea el JSON
        
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#464646';
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        //Fondo negro
        var bg = this.game.add.image((this.game.width - blockSize*13)/2, (this.game.height - blockSize*13)/2,'background');
        bg.height = blockSize*13;
        bg.width = blockSize*13;

        //HQ sprite
        var hqPos = getCenteredCell(this.game, blockSize,6,12);
        hq = new Collider(this.game, hqPos, objectsScale, 'sprites_atlas', 'base_1');
        hq.body.immovable = true;

        //Se inicializan los grupos necesarios para el mapa (Se incializan antes del player porque este tiene que aparecer por encima de algunos)
        bloquesGroup = this.game.add.group(); //Grupo de los bloques del mapa
        bloquesGroup.enableBody = true;
        bloquesGroup.physicsBodyType = Phaser.Physics.ARCADE;

        wallsGroup = this.game.add.group(); //Grupo de los limites del mapa
        wallsGroup.enableBody = true;
        wallsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        waterGroup = this.game.add.group(); //Grupo de los bloques de agua del mapa
        waterGroup.enableBody = true;
        waterGroup.physicsBodyType = Phaser.Physics.ARCADE;

        iceGroup = this.game.add.group(); //Grupo de los bloques de hielo del mapa

        powerupsGroup = this.game.add.group(); //Grupo de los powerups
        powerupsGroup.enableBody = true;
        powerupsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
        //Creación del player
        var playerPos = getCenteredCell(this.game, blockSize, 4, 13);
        var playerVel = new Par(140, 140);
        var playerDir = new Par (0, -1);

        //Balas y arma del jugador
        bulletVel = 300;
        bulletTime = 270;
        //Se inicializa el grupo de las balas
        playerBullets = this.game.add.group();
        playerBullets.enableBody = true;
        playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
    
        //Se crean las balas y se añaden al grupo        
        for (var i = 0; i < 1; i++){ //i = numero de balas simultaneas en pantalla
            var bala = new Bullet(this.game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
            playerBullets.add(bala);
        }
        //Collider que destruye los bloques
        bulletCollider = new Collider(this.game, new Par(50,50), objectsScale);
        bulletCollider.width = blockSize;
        bulletCollider.height = blockSize/2;

        //Collider que destruye los bloques (para los enemigos)
        enemyBulletCollider = new Collider(this.game, new Par(50,50), objectsScale);
        enemyBulletCollider.width = blockSize;
        enemyBulletCollider.height = blockSize/2;

        //Player
        player = new Player(this.game, playerPos, objectsScale, playerVel, playerDir, playerBullets, bulletVel, bulletTime,  cursors, 'sprites_atlas');
        //player.animations.add('player1_right_on', ['player1_level1_right1','player1_level1_right2'], 2, true);
        //player.animations.play('player1_right_on');
        player.animations.add('player1_level1_right_off', ['player1_level1_right1'], 1, true);
        player.animations.add('player1_level2_right_off', ['player1_level2_right1'], 1, true);
        player.animations.add('player1_level3_right_off', ['player1_level3_right1'], 1, true);
        player.animations.add('player1_level4_right_off', ['player1_level4_right1'], 1, true);

        player.tankLevel = tankL;
        if(player.tankLevel === 1)
        player.animations.play('player1_level1_right_off');
        else if(player.tankLevel === 2)
            player.animations.play('player1_level2_right_off');
        else if (player.tankLevel === 3) 
            player.animations.play('player1_level3_right_off');
        else if (player.tankLevel === 4)
            player.animations.play('player1_level4_right_off');
        
        player.body.collideWorldBounds = true;
        player._direction._x = 1;
        player._direction._y = 0; 
        

        //EnemySpawns
        spawnPos[0] = getCenteredCell(this.game, blockSize, 0, 0);
        spawnPos[1] = getCenteredCell(this.game, blockSize, 6, 0);
        spawnPos[2] = getCenteredCell(this.game, blockSize, 12, 0);

        ////////////////////////EnemyTest
        createEnemyBullets(this.game);

        //Enemy group
        enemyGroup = this.game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;


        ////////////////////////Mapa    
        createWalls(this.game, wallsGroup, objectsScale, blockSize); //Crea los limites del mapa
        loadMap(this, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, levelData, levelN); //Inicializa el mapa creando todos los bloques 

        //Game Over prite
        var posTemp = new Par(this.game.width/2, this.game.height+100);
        var scaleTemp = new Par(3,3);
        gameoverSprite = new Collider(this.game, posTemp, scaleTemp,'game_over');
    },
    
    update: function(){
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || enemyKilledCount >= 20){
            this.game.time.events.add(Phaser.Timer.SECOND * 1, nextLevel, this);
        }

        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.collide(player, waterGroup);
        this.game.physics.arcade.collide(player, wallsGroup);

        this.game.physics.arcade.overlap(enemyGroup, bloquesGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, waterGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, wallsGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.collide(enemyGroup, enemyGroup);

        this.game.physics.arcade.overlap(player, powerupsGroup, powerupHandler, null, this);

        //Player Bullets Collisions
        this.game.physics.arcade.overlap(playerBullets, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(playerBullets, bloquesGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(bulletCollider, bloquesGroup, destructionHandler, null, this);
        this.game.physics.arcade.overlap(playerBullets, enemyGroup, collisionKillEnemy, null, this);

        //Enemy Bullets collisions with Walls
        this.game.physics.arcade.overlap(enemyBullets1, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets1, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets2, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets2, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets3, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets3, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets4, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets4, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);

        //EnemyBullets collision with player
        this.game.physics.arcade.overlap(player, enemyBullets1, collisionHitPlayer, null, this);
        this.game.physics.arcade.overlap(player, enemyBullets2, collisionHitPlayer, null, this);
        this.game.physics.arcade.overlap(player, enemyBullets3, collisionHitPlayer, null, this);
        this.game.physics.arcade.overlap(player, enemyBullets4, collisionHitPlayer, null, this);

        //Collision between bullets
        this.game.physics.arcade.overlap(playerBullets, enemyBullets1, collisionBullets, null, this);
        this.game.physics.arcade.overlap(playerBullets, enemyBullets2, collisionBullets, null, this);
        this.game.physics.arcade.overlap(playerBullets, enemyBullets3, collisionBullets, null, this);
        this.game.physics.arcade.overlap(playerBullets, enemyBullets4, collisionBullets, null, this);

        //Collision with HQ
        this.game.physics.arcade.collide(player, hq);
        this.game.physics.arcade.collide(enemyGroup, hq);

        //Collision between bullets and HQ
        this.game.physics.arcade.overlap(hq, playerBullets, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets1, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets2, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets3, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets4, collisionHQ, null, this);

        if(enemyCount < 4 && spawnCount < 20 && !spawned){
            this.game.time.events.add(Phaser.Timer.SECOND * 1.5, spawnEnemy, this);
            spawned = true;
            enemyCount++;
            spawnCount++;
        }

        //Si el jugador se ha quedado sin vidas
        if (player.lives < 0)
            gameOver();

        if (gameover){
            if(gameoverSprite.y >= this.game.height/2)
                gameoverSprite.body.velocity.y = -140;
            else
                gameoverSprite.body.velocity.y = 0;
        }
    },

    render: function(){
        //this.game.debug.text( "Direction X: " + player._direction._x, 50, 80 );
        //this.game.debug.text( "Direction Y: " + player._direction._y, 50, 100 );
        //this.game.debug.text( "Player X: " + player.x, 50, 120 );
        //this.game.debug.text( "Player Y: " + player.y, 50, 140 );
        //this.game.debug.text(bloquesGroup.length, 50, 140);
        //this.game.debug.body(player);
        //this.game.debug.body(bulletCollider);
        this.game.debug.text("Lives: " + player.lives, 5, 60);
        this.game.debug.text("Enemies", 5, 90);
        this.game.debug.text("remaining: " + (20-spawnCount), 5, 110);
        this.game.debug.text("Enemies", 5, 140);
        this.game.debug.text("destroyed: " + enemyKilledCount, 5, 160);
        this.game.debug.text("TankLevel: " + player.tankLevel, 5, 190);
    }
};

module.exports = PlayScene;

function nextLevel(){
    if(levelN < 2)
      levelN++;
    else
      levelN = 1;

    tankL = player.tankLevel;
    this.game.state.restart('play', false, false);
}

//Resets the variables scenes
function resetScene(){
    bulletsUsed1 = false;
    bulletsUsed2 = false;
    bulletsUsed3 = false;
    bulletsUsed4 = false;
    spawnIndex = 0;
    spawnCount = -1;
    enemyCount = 0;
    enemyKilledCount = 0;
    spawned = false;
    gameover = false;
}

//Called if the bullet goes out of the screen
function resetBullet (_bullet) {
    _bullet.kill();
}

//Called if the bullet hits one of the block sprites
function collisionHandler (bullet, block) {
    var distance;
    if (player.tankLevel < 4)
        distance = 12;
    else
        distance = 24;
    bulletCollider.x = bullet.x + (distance * bullet._direction._x);
    bulletCollider.y = bullet.y - (distance *-bullet._direction._y);
    if (bullet._direction._y != 0){
        bulletCollider.width = blockSize;
        bulletCollider.height = blockSize/2;
    }
    else {
        bulletCollider.width = blockSize/2;
        bulletCollider.height = blockSize;
    }
    bullet.kill();
}

//Called if the bullet hits one of the block sprites (for Enemies)
function collisionHandlerEnemy (bullet, block) {
    var distance = 12;
    enemyBulletCollider.x = bullet.x + (distance * bullet._direction._x);
    enemyBulletCollider.y = bullet.y - (distance *-bullet._direction._y);
    if (bullet._direction._y != 0){
        enemyBulletCollider.width = blockSize;
        enemyBulletCollider.height = blockSize/2;
    }
    else {
        enemyBulletCollider.width = blockSize/2;
        enemyBulletCollider.height = blockSize;
    }
    bullet.kill();
}

// Called if the bullet hits an enemy
function collisionKillEnemy (bullet, enemy) {
    if (enemy._lives > 1) enemy._lives--;
    else {
        if (enemy._bulletN === 1) bulletsUsed1 = false;
        else if (enemy._bulletN === 2) bulletsUsed2 = false;
        else if (enemy._bulletN === 3) bulletsUsed3 = false;
        else if (enemy._bulletN === 4) bulletsUsed4 = false;
        enemyCount--;
        enemyGroup.remove(enemy);
        enemy._timerbullets.stop();
        enemy.kill();
        enemyKilledCount++;

        var rnd = this.game.rnd.integerInRange(0, 3);
        if (rnd === 3)
            spawnPowerup(this.game);
    }
    bullet.kill();
}

// Called if an enemy bullet hits the player
function collisionHitPlayer (_player, enemyBullet) {
    enemyBullet.kill();
    if (_player.lives >= 0 && !_player.helmet){
        _player.lives--;
        player.resetPos();
        player.animations.play('player1_level1_right_off');
    }
}

// Called if two bullets collide;
function collisionBullets (playerBullet, enemyBullet) {
    enemyBullet.kill();
    playerBullet.kill();
}

//Called when the bulletCollider is on top of a block
function destructionHandler (bulletC, block){
    if (block.blockType != 'Metal')
        block.kill();
    else if (player.tankLevel >= 4)
        block.kill();
}

//Called when the bulletCollider is on top of a block
function destructionHandlerEnemy (bulletC, block){
    if (block.blockType != 'Metal')
        block.kill();
}

//Collision bewteen bullets and hq
function collisionHQ(hq, _bullet){
    _bullet.kill();
    if (!gameover){
        hq.animations.add('hq_2', ['base_2'], 1, true);
        hq.animations.play('hq_2');
        gameOver();
    }
}

function gameOver(){
    if (!gameover){
        gameover = true;
        player.canMove = false;
    }
}

// Called if an enemy hits a wall, etc.
function collisionChangeDirEnemy (enemy, block){
    if (enemy._velocity._x !== 0 && enemy._velocity._y !== 0 && !enemy._changeCalled){
        enemy.stop();
        enemy._changeCalled = true;
        enemy.game.time.events.add(Phaser.Timer.SECOND * 0.5, enemy.change_dir, enemy);
    }
}

// Called if a powerup is taken
function powerupHandler (player, powerup){
    if (powerup.blockType === 'powerup_star' && player.tankLevel < 4){
        player.tankLevel++;
        if(player.tankLevel === 2){
            player._bulletVel = 500;
            player.animations.play('player1_level2_right_off');
        }
        else if (player.tankLevel === 3) {
            playerBullets.add(new Bullet(this.game, new Par(0,0), objectsScale, 500, new Par(0,0), 'bullet'));
            player.animations.play('player1_level3_right_off');
        }
        else if (player.tankLevel === 4) {
            player.animations.play('player1_level4_right_off');
        }
    }
    else if (powerup.blockType === 'powerup_grenade'){
        bulletsUsed1 = false;
        bulletsUsed2 = false;
        bulletsUsed3 = false;
        bulletsUsed4 = false;
        enemyGroup.forEach(function (e) {
            enemyCount--;
            enemyGroup.remove(e);
            e._timerbullets.stop();
            e.kill();
            enemyKilledCount++;
        });
    }
    else if (powerup.blockType === 'powerup_tank'){
        player.lives++;
    }
    else if (powerup.blockType === 'powerup_helmets'){
        player.helmet = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, player.helmet_off, player);
    }
    powerup.kill();
}

function createEnemyBullets(game){
    enemyBullets1 = game.add.group();
    enemyBullets1.enableBody = true;
    enemyBullets1.physicsBodyType = Phaser.Physics.ARCADE;
    var bala1 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    enemyBullets1.add(bala1);

    enemyBullets2 = game.add.group();
    enemyBullets2.enableBody = true;
    enemyBullets2.physicsBodyType = Phaser.Physics.ARCADE;
    var bala2 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    enemyBullets2.add(bala2);

    enemyBullets3 = game.add.group();
    enemyBullets3.enableBody = true;
    enemyBullets3.physicsBodyType = Phaser.Physics.ARCADE;
    var bala3 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    enemyBullets3.add(bala3);

    enemyBullets4 = game.add.group();
    enemyBullets4.enableBody = true;
    enemyBullets4.physicsBodyType = Phaser.Physics.ARCADE;
    var bala4 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    enemyBullets4.add(bala4);
}

function spawnEnemy(){
    var bulletGroup;
    var bNumber;
    if (!bulletsUsed1){
        bulletGroup = enemyBullets1;
        bNumber = 1;
        bulletsUsed1 = true;
    }
    else if (!bulletsUsed2){
        bulletGroup = enemyBullets2;
        bNumber = 2;
        bulletsUsed2 = true;
    }
    else if (!bulletsUsed3){
        bulletGroup = enemyBullets3;
        bNumber = 3;
        bulletsUsed3 = true;
    }
    else if (!bulletsUsed4){
        bulletGroup = enemyBullets4;
        bNumber = 4;
        bulletsUsed4 = true;
    }
    var spawnedEnemy = new Enemy(this.game, spawnPos[spawnIndex], objectsScale, bulletGroup, bNumber, levelData.levels[levelN][13].enemies[spawnCount]);
    enemyGroup.add(spawnedEnemy);
    spawned = false;
    spawnIndex++;
    if (spawnIndex >= spawnPos.length) spawnIndex = 0;
}

function spawnPowerup(game){
    var rnd = game.rnd.integerInRange(0, 3);
    var id = powerupTypes[rnd];
    var powerup = new Block(game, getCell(game, blockSize, game.rnd.integerInRange(1, 11), game.rnd.integerInRange(1, 11)), objectsScale, 'sprites_atlas', id, id);
    powerup.animations.add('blink', [id, 'empty'], 4, true);
    powerup.animations.play('blink');
    powerupsGroup.add(powerup);
}
},{}]},{},[1]);
