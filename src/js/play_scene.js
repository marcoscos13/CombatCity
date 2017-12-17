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

//Enemies
var enemy;
var enemyGroup;
var enemyBullets1;
var enemyBullets2;
var enemyBullets3;
var enemyBullets4;
// var enemyBullets;
var bulletsUsed1 = false;
var bulletsUsed2 = false;
var bulletsUsed3 = false;
var bulletsUsed4 = false;

var enemyBulletCollider;

var spawnIndex = 0;
var spawnPos = new Array();
var spawnCount = 0;
var enemyCount = 0;
var spawned = false;

var levelData;

var gameover = false;
var gameoverSprite;

var hq;

var PlayScene = {
    preload: function(){
        this.load.text('levels', 'levels/levels.json');
       
    },

    create: function(){
        levelData = JSON.parse(this.game.cache.getText('levels')); //Parsea el JSON
        
        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        //Fondo negro
        var bg = this.game.add.image((this.game.width - blockSize*13)/2, (this.game.height - blockSize*13)/2,'background');
        bg.height = blockSize*13;
        bg.width = blockSize*13;

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

        enemyGroup = this.game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

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
        player.animations.add('player1_right_off', ['player1_level1_right1'], 1, true);
        player.animations.play('player1_right_off');
        player.body.collideWorldBounds = true;
        player._direction._x = 1;
        player._direction._y = 0; 

        //EnemySpawns
        spawnPos[0] = getCenteredCell(this.game, blockSize, 0, 0);
        spawnPos[1] = getCenteredCell(this.game, blockSize, 6, 0);
        spawnPos[2] = getCenteredCell(this.game, blockSize, 12, 0);

        ////////////////////////EnemyTest
        createEnemyBullets(this.game);

        //--------------------

        

        //Creación de un enemy
        // var enemyPos = getCenteredCell(this.game, blockSize, 0, 11);
        // var enemyDir = new Par (1, 0);
        // var enemyVel = new Par(100, 100);
        // enemy = new Enemy(this.game, enemyPos, objectsScale, enemyVel, enemyDir, enemyBullets, bulletVel, bulletTime, 3, 'tank');
        
        ////////////////////////Mapa    

        createWalls(this.game, wallsGroup, objectsScale, blockSize); //Crea los limites del mapa

        loadMap(this, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, levelData, 1); //Inicializa el mapa creando todos los bloques 

        //gameOver(this.game);
        var hqPos = getCenteredCell(this.game, blockSize,6,12);
        hq = new Collider(this.game, hqPos, objectsScale, 'sprites_atlas', 'base_1');
    },
    
    update: function(){
        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.collide(player, waterGroup);
        this.game.physics.arcade.collide(player, wallsGroup);
        this.game.physics.arcade.collide(enemyGroup, bloquesGroup);
        this.game.physics.arcade.collide(enemyGroup, waterGroup);
        this.game.physics.arcade.collide(enemyGroup, wallsGroup);
        this.game.physics.arcade.collide(enemyGroup, enemyGroup);

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

        if(enemyCount < 4 && spawnCount < 20 && !spawned){
            this.game.time.events.add(Phaser.Timer.SECOND * 1.5, spawnEnemy, this);
            spawned = true;
            enemyCount++;
            spawnCount++;
        }

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
        this.game.debug.text("Player lives: " + player.lives, 50, 80);
    }
};

module.exports = PlayScene;

//Called if the bullet goes out of the screen
function resetBullet (_bullet) {
    _bullet.kill();
}

//Called if the bullet hits one of the block sprites
function collisionHandler (bullet, block) {
    var distance;
    if (player.tankLevel < 3)
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

//Called if the bullet hits an enemy
function collisionKillEnemy (bullet, enemy) {
    if (enemy._lives > 1) enemy._lives--;
    else {
        if (enemy._bulletN === 1) bulletsUsed1 = false;
        else if (enemy._bulletN === 2) bulletsUsed2 = false;
        else if (enemy._bulletN === 3) bulletsUsed3 = false;
        else if (enemy._bulletN === 4) bulletsUsed4 = false;
        enemyCount--;
        enemyGroup.remove(enemy);
        enemy.kill();
    }
    bullet.kill();
}

//Called if an enemy bullet hits the player
function collisionHitPlayer (_player, enemyBullet) {
    enemyBullet.kill();
    player.resetPos();
    _player.lives--;
}

//Called if two bullets collide;
function collisionBullets (playerBullet, enemyBullet) {
    enemyBullet.kill();
    playerBullet.kill();
}


// Called when the bulletCollider is on top of a block
function destructionHandler (bulletC, block){
    if (block.blockType != 'Metal')
        block.kill();
    else if (player.tankLevel >= 3)
        block.kill();
}

// Called when the bulletCollider is on top of a block
function destructionHandlerEnemy (bulletC, block){
    if (block.blockType != 'Metal')
        block.kill();
}

function gameOver(game){
    var posTemp = new Par(game.width/2,game.height+100);
    var scaleTemp = new Par(3,3);
    gameoverSprite = new Collider(game, posTemp, scaleTemp,'game_over');
    gameover = true;
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
    var spawnedEnemy = new Enemy(this.game, spawnPos[spawnIndex], objectsScale, bulletGroup, bNumber, 'fast');
    enemyGroup.add(spawnedEnemy);
    spawned = false;
    spawnIndex++;
    if (spawnIndex >= spawnPos.length) spawnIndex = 0;
}