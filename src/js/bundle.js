(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var creditsAnimacion = true;
var menuVelocity = 8;

var linesArrayLeft = new Array(4);
var linesArrayRight = new Array(3);
var ftsButton;

var Enter;

var CreditsScene = {
    init: function(){
        creditsAnimacion = true;
    },

    preload: function(){
    },

    create: function(){
        createButtons(this);

        this.game.stage.setBackgroundColor(0x061319);

        linesArrayLeft[0] = this.game.add.text(-300, this.game.world.centerY - 240, "MADE BY 1/2 OF\nFIRST TRY STUDIOS_");
        linesArrayRight[0] = this.game.add.text(this.game.width + 450, this.game.world.centerY - 130, "KELVIN COMPER DIAS");
        linesArrayLeft[1] = this.game.add.text(-300, this.game.world.centerY - 90, "MARCOS GARCIA GARCIA");
        linesArrayRight[1] = this.game.add.text(this.game.width + 450, this.game.world.centerY + 40, "THIS GAME IS A REMAKE OF\nBATTLE CITY (1985) BY NAMCOT");
        linesArrayLeft[2] = this.game.add.text(-300, this.game.world.centerY + 90, "(WE DO NOT OWN ANY RIGHTS OVER THE ORIGINAL GAME)");
        linesArrayRight[2] = this.game.add.text(this.game.width + 450, this.game.world.centerY + 205, "CHECK OUT MORE GAMES HERE");
        linesArrayLeft[3] = this.game.add.text(-300, this.game.world.centerY + 252, "https://firsttry.itch.io/");

        ftsButton = this.game.add.button(this.game.width + 380, this.game.world.height - 100, 'sprites_atlas', goToLink, this, "empty", 'empty', 'empty');
        ftsButton.scale.setTo(45,4);
        ftsButton.anchor.setTo(0.5,0.5);

        for(var i = 0; i < linesArrayLeft.length; i++){
            linesArrayLeft[i].x -= 75;
            linesArrayLeft[i].anchor.setTo(0.5,0.5);
            linesArrayLeft[i].font = 'Press Start 2P';
            linesArrayLeft[i].fontSize = 24;
            linesArrayLeft[i].fill = '#bcbcbc';
            linesArrayLeft[i].stroke = '#000000';
            linesArrayLeft[i].strokeThickness = 10;
            linesArrayLeft[i].align = "center";
        }

        for(var i = 0; i < linesArrayRight.length; i++){
            linesArrayRight[i].x -= 75;
            linesArrayRight[i].anchor.setTo(0.5,0.5);
            linesArrayRight[i].font = 'Press Start 2P';
            linesArrayRight[i].fontSize = 24;
            linesArrayRight[i].fill = '#bcbcbc';
            linesArrayRight[i].stroke = '#000000';
            linesArrayRight[i].strokeThickness = 10;
            linesArrayRight[i].align = "center";
        }

        linesArrayLeft[2].fontSize = 15;

        this.game.time.events.add(Phaser.Timer.SECOND * 20, function(){this.game.state.start('menu', true, false);}, this);

    },
    
    update: function(){
        if (creditsAnimacion){
            if(linesArrayLeft[0].x <= this.game.width/2){
                for(var i = 0; i < linesArrayLeft.length; i++){
                    linesArrayLeft[i].x += menuVelocity;
                }
                for(var i = 0; i < linesArrayRight.length; i++){
                    linesArrayRight[i].x -= menuVelocity;
                }
                ftsButton.x -= menuVelocity;
            }else creditsAnimacion = false;
        }
    },

    render: function(){
        
    }
};

module.exports = CreditsScene;

function createButtons(self){
    //Enter
    Enter = self.game.input.keyboard.addKey([ Phaser.Keyboard.ENTER ]);
    Enter.onDown.add(function(){
        if (creditsAnimacion){
            while(linesArrayLeft[0].x <= this.game.width/2){
                for(var i = 0; i < linesArrayLeft.length; i++){
                    linesArrayLeft[i].x += menuVelocity;
                }
                for(var i = 0; i < linesArrayRight.length; i++){
                    linesArrayRight[i].x -= menuVelocity;
                }
                ftsButton.x -= menuVelocity;
            }
            creditsAnimacion = false;
        }
        else {
            self.game.state.start('menu', true, false);
        }
    }, self);
}

function goToLink(){
    window.open("https://firsttry.itch.io/", "_blank");
}
},{}],2:[function(require,module,exports){
'use strict';

var cursors;
var currentLevel = 0;
var levelText;
var Enter;
var chooseLevel = false;
var levelsData;

var LevelAnimationScene = {
    init: function(levelNumber, chooseLevelBool = false) {   
        currentLevel = levelNumber;
        chooseLevel = chooseLevelBool;
    },

    preload: function(){
        
    },

    create: function(){
        levelsData = JSON.parse(this.game.cache.getText('levels')); //Parsea el JSON

        this.game.stage.setBackgroundColor(0xbcbcbc);

        levelText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "LEVEL " + currentLevel);
        levelText.anchor.setTo(0.5,0.5);
        levelText.font = 'Press Start 2P';
        levelText.fontSize = 22;
        levelText.fill = '#bcbcbc';
        levelText.align = "center";
        levelText.stroke = '#000000';
        levelText.strokeThickness = 8;

        Enter = this.game.input.keyboard.addKey([ Phaser.Keyboard.ENTER ]);
        Enter.onDown.add(goToLevel, this);

        if (!chooseLevel)
            this.game.time.events.add(Phaser.Timer.SECOND * 2.2, goToLevel, this);
        else{
            cursors = this.game.input.keyboard.createCursorKeys();
            //Abajo
            cursors.right.onDown.add(function(){
                if (currentLevel < levelsData.levels.length-1)
                    currentLevel++;
            });
            //Arriba
            cursors.left.onDown.add(function(){
                if (currentLevel > 1)
                    currentLevel--;
            });

            var pressEnter = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, "PRESS ENTER TO START");
            pressEnter.anchor.setTo(0.5,0.5);
            pressEnter.font = 'Press Start 2P';
            pressEnter.fontSize = 14;
            pressEnter.fill = '#bcbcbc';
            pressEnter.align = "center";
            pressEnter.stroke = '#000000';
            pressEnter.strokeThickness = 8;
        }
    },
    
    update: function(){
        if (chooseLevel)
            levelText.text = "◄ LEVEL " + currentLevel + " ►";
    },

    render: function(){
        
    }
};

module.exports = LevelAnimationScene;

function goToLevel(){
    this.game.state.start('play', true, false, currentLevel);
}
},{}],3:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu_scene.js');
var LevelAnimationScene = require('./levelAnimation_scene.js');
var CreditsScene = require('./credits_scene.js');
//var TestScene = require('./test_scene.js');
//var TestScene2 = require('./test_scene2.js');
//var Stack = require('./stack.js');
//var Inheritance = require('./inheritance.js');

var BootScene = {
  preload: function () {
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
    this.game.load.image('menu_logo', 'images/menu_logo.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('white', 'images/white.png');
    this.game.load.image('grey', 'images/grey.png');
    this.game.load.atlas('sprites_atlas', 'images/sprites_atlas.png', 'images/sprites_atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('logo_atlas', 'images/logo_atlas.png', 'images/logo_atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.audio('shoot', 'sounds/shoot.ogg');
    this.game.load.audio('boomenemy', 'sounds/boomenemy.ogg');
    this.game.load.audio('boombase', 'sounds/boombase.ogg');
    this.game.load.audio('boomplayer', 'sounds/boomplayer.ogg');
    this.game.load.audio('bulletbrick', 'sounds/bulletbrick.ogg');
    this.game.load.audio('bulletmetal', 'sounds/bulletmetal.ogg');
    this.game.load.audio('enemyhurt', 'sounds/enemyhurt.ogg');
    this.game.load.audio('powerup', 'sounds/powerup.ogg');
    this.game.load.audio('powerupappears', 'sounds/powerupappears.ogg');
    this.game.load.audio('music', 'sounds/music.ogg');
  },

  create: function () {
    this.game.state.start('menu');
    //this.game.state.start('play');
  }
};

var wfconfig = {
      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: {
        families: ['Press Start 2P']
      }
};

window.onload = function () {
  WebFont.load(wfconfig); //carga la fuente definida en el objeto anterior.

  var game = new Phaser.Game(900, 700, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene); //Escena del menu
  game.state.add('credits', CreditsScene); //Escena del menu
  game.state.add('play', PlayScene); //Escena de juego
  game.state.add('levelAnimation', LevelAnimationScene); //Escena de juego

  game.state.start('boot');
};

},{"./credits_scene.js":1,"./levelAnimation_scene.js":2,"./menu_scene.js":4,"./play_scene.js":5}],4:[function(require,module,exports){
'use strict';

var cursors;

var menuAnimacion = true;
var menuVelocity = 2.5;
var menuLogo;
var bottonInfo;

var fullscreenButton;
var muteButton;

var buttonsArray = new Array(2);
var buttonsN = 2; //Numero de botones en el menu

var selector; //Sprite del selector
var selectorN = 0; //Boton actualmente selecionado

var Enter;

var MenuScene = {
    init: function(){
        menuAnimacion = true;
    },

    preload: function(){
        this.load.text('levels', 'levels/levels.json');
    },

    create: function(){
        createButtons(this);

        this.game.stage.setBackgroundColor(0x061319);

        //Fullscreen Button
        fullscreenButton = this.game.add.button(40, this.game.world.height + 510, 'sprites_atlas', fullscreenToggle, this, 'HUD_fullscreen_1', 'HUD_fullscreen_1', 'HUD_fullscreen_1');
        fullscreenButton.scale.setTo(6,6);
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Mute Button
        muteButton = this.game.add.button(40, this.game.world.height + 420, 'sprites_atlas', muteToggle, this, 'HUD_mute_1', 'HUD_mute_1', 'HUD_mute_1');
        muteButton.scale.setTo(6,6);
        if (this.game.sound.mute)
            muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');

        menuLogo = this.game.add.sprite(this.game.world.centerX, this.game.height + 120,'logo_atlas', 'CombatCity_Logo_1');
        menuLogo.anchor.setTo(0.5,0.5);
        menuLogo.scale.setTo(12,12);
        menuLogo.smoothed = false;
        menuLogo.animations.add('logoAnim');
        menuLogo.animations.play('logoAnim', 32, false);

        //Loop for the logo animation
        var logoLoop = this.game.time.create(false);
        logoLoop.loop(4000, logoAnimLoop, this);
        logoLoop.start();

        bottonInfo = this.game.add.text(this.game.world.centerX, this.game.height + 550, "!© 2018 HALF TRY STUDIOS_\nALL RIGHTS NOT RESERVED");
        bottonInfo.anchor.setTo(0.5,0.5);
        bottonInfo.font = 'Press Start 2P';
        bottonInfo.fontSize = 20;
        bottonInfo.fill = '#bcbcbc';
        bottonInfo.align = "center";
        bottonInfo.stroke = '#000000';
        bottonInfo.strokeThickness = 8;

        buttonsArray[0] = this.game.add.text(this.game.world.centerX, this.game.height + 340, "PLAY");
        buttonsArray[1] = this.game.add.text(this.game.world.centerX, this.game.height + 400, "CREDITS");

        for(var i = 0; i < buttonsArray.length; i++){
            buttonsArray[i].x -= 75;
            buttonsArray[i].anchor.setTo(0,0.5);
            buttonsArray[i].font = 'Press Start 2P';
            buttonsArray[i].fontSize = 26;
            buttonsArray[i].fill = '#bcbcbc';
            buttonsArray[i].stroke = '#000000';
            buttonsArray[i].strokeThickness = 10;
        }

        selector = this.game.add.sprite(buttonsArray[0].x - 50, buttonsArray[0].y,'sprites_atlas', 'HUD_selector_1');
        selector.animations.add('selector', ['HUD_selector_1', 'HUD_selector_2'], 4, true);
        selector.animations.play('selector');
        selector.smoothed = false;
        selector.anchor.setTo(0.5,0.5);
        selector.scale.setTo(4,4);

    },
    
    update: function(){
        if (menuAnimacion){
            if(menuLogo.y >= this.game.height/2 - this.game.height/5){
                menuLogo.y -= menuVelocity;
                for(var i = 0; i < buttonsArray.length; i++){
                    buttonsArray[i].y -= menuVelocity;
                }
                selector.y -= menuVelocity;
                bottonInfo.y -= menuVelocity;
                fullscreenButton.y -= menuVelocity;
                muteButton.y -= menuVelocity;
            }else menuAnimacion = false;
        }

       selector.y = buttonsArray[selectorN].y - 6;
       updateFullscreenIcon(this.game);
    },

    render: function(){
        
    }
};

module.exports = MenuScene;

function createButtons(self){
    //Cursores -----------------------------------------------
    cursors = self.game.input.keyboard.createCursorKeys();
    //Abajo
    cursors.down.onDown.add(function(){
        if (!menuAnimacion){
            selectorN++;
            if (selectorN > buttonsN-1)
            selectorN = 0;
        }
    });
    //Arriba
    cursors.up.onDown.add(function(){
        if (!menuAnimacion){
            selectorN--;
            if (selectorN < 0)
            selectorN = buttonsN - 1;
        }
    });

    //Enter
    Enter = self.game.input.keyboard.addKey([ Phaser.Keyboard.ENTER ]);
    Enter.onDown.add(function(){
        if (menuAnimacion){
            while(menuLogo.y >= self.game.height/2 - self.game.height/5){
                menuLogo.y -= menuVelocity;
                for(var i = 0; i < buttonsArray.length; i++){
                    buttonsArray[i].y -= menuVelocity;
                }
                selector.y -= menuVelocity;
                bottonInfo.y -= menuVelocity;
                fullscreenButton.y -= menuVelocity;
                muteButton.y -= menuVelocity;
            }
            menuAnimacion = false;
        }
        else {
            if(selectorN == 0)
                self.game.state.start('levelAnimation', true, false, 1, true);
            else if(selectorN == 1)
                self.game.state.start('credits', true, false, 1, true);
        }
    }, self);
}

function muteToggle() {
    if (!this.game.sound.mute) {
        this.game.sound.mute = true;
        muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');
    } else {
        this.game.sound.mute = false;
        muteButton.setFrames('HUD_mute_1','HUD_mute_1','HUD_mute_1');
    }
}

function fullscreenToggle(){
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    }
    else{
        this.game.scale.startFullScreen(false);
    }
}

function updateFullscreenIcon(_game){
    if (_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_1') {
        fullscreenButton.setFrames('HUD_fullscreen_2','HUD_fullscreen_2','HUD_fullscreen_2');
    }
    else if (!_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_2'){
        fullscreenButton.setFrames('HUD_fullscreen_1','HUD_fullscreen_1','HUD_fullscreen_1');
    }
}

function logoAnimLoop(){
    menuLogo.animations.play('logoAnim', 32, false);
}
},{}],5:[function(require,module,exports){
'use strict';

var cursors;

var _game;

var fullscreenButton;
var muteButton;

var objectsScale = new Par(3, 3);
var blockSize = 48;

var bloquesGroup;
var waterGroup;
var iceGroup;
var wallsGroup;
var baseGroup;
var baseMetalGroup;

//Player
var player;
var playerBullets;
var playerShield;

var bulletVel;
var bulletTime;
var bullet;
var bulletCollider;

//Powerups
var powerupTypes = ['powerup_star', 'powerup_tank', 'powerup_helmets', 'powerup_grenade', 'powerup_shovel', 'powerup_timer'];

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
var spawnCount = 0;
var enemyCount = 0;
var enemyKilledCount = 0;
var spawned = false;

//PowerUps
var powerupsGroup;

var levelData;
var levelN = 1;
var tankL = 1;
var livesN = 3;
var loadingLevel = false;

var gameover = false;
var gameoverSprite;

var hq;
var tempBool = false;

//HUD
var score = 0;
var HUD_score;
var HUD_enemiesArray = new Array(20);
var HUD_LivesSprite;
var HUD_Lives;
var HUD_LevelSprite;
var HUD_Level;

//Sonidos
var powerupSound;
var puappearsSound;
var boompowerupSound;
var boombaseSound;
var bulletmetalSound;
var bulletbrickSound;
var music;

var PlayScene = {
    init: function(customParam1) {   
        if (customParam1 > 0)
            levelN = customParam1;
        loadingLevel = false;
        this.game.timeOn = true;
    },

    preload: function(){
        _game = this.game;
        resetScene();
    },

    create: function(){
        levelData = JSON.parse(this.game.cache.getText('levels')); //Parsea el JSON
        
        this.game.timeOn = true;

        //Fullscreen Button
        fullscreenButton = this.game.add.button(68, this.game.world.height - 72, 'sprites_atlas', fullscreenToggle, this, 'HUD_fullscreen_1', 'HUD_fullscreen_1', 'HUD_fullscreen_1');
        fullscreenButton.scale.setTo(6,6);
        fullscreenButton.anchor.setTo(0.5,0.5)
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Mute Button
        muteButton = this.game.add.button(68, this.game.world.height - 162, 'sprites_atlas', muteToggle, this, 'HUD_mute_1', 'HUD_mute_1', 'HUD_mute_1');
        muteButton.scale.setTo(6,6);
        muteButton.anchor.setTo(0.5,0.5)
        if (this.game.sound.mute)
            muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');

        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#192E38';
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

        baseGroup = this.game.add.group(); //Grupo de los bloques de ladrillo de la base
        baseGroup.enableBody = true;
        baseGroup.physicsBodyType = Phaser.Physics.ARCADE;

        baseMetalGroup = this.game.add.group(); //Grupo de los bloques de metal de la base
        baseMetalGroup.enableBody = true;
        baseMetalGroup.physicsBodyType = Phaser.Physics.ARCADE;

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
        bulletTime = 300;
        //Se inicializa el grupo de las balas
        playerBullets = this.game.add.group();
        playerBullets.enableBody = true;
        playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
    
        //Se crean las balas y se añaden al grupo        
        for (var i = 0; i < 1; i++){ //i = numero de balas simultaneas en pantalla
            playerBullets.add(new Bullet(this.game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet'));
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
        //Escudo del player
        playerShield = player.addChild(this.game.add.sprite(-8, -8,'sprites_atlas', 'shield_1'))
        playerShield.animations.add('shield', ['shield_1', 'shield_2'], 2, true);
        playerShield.animations.play('shield', 4, true);
        playerShield.visible = false;

        player.lives = livesN;
        player.tankLevel = tankL;
        
        if(player.tankLevel >= 1)
        player.animations.play('player1_level1_up');
        if(player.tankLevel >= 2){
            player._bulletVel = 500;
            player.animations.play('player1_level2_up');
        }
        if (player.tankLevel >= 3) {
            playerBullets.add(new Bullet(this.game, new Par(0,0), objectsScale, 500, new Par(0,0), 'bullet'));
            player.animations.play('player1_level3_up');
        }
        if (player.tankLevel >= 4) {
            player.animations.play('player1_level4_up');
        }
        
        player.body.collideWorldBounds = true;        

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
        loadMap(this, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, baseGroup, baseMetalGroup, levelData, levelN); //Inicializa el mapa creando todos los bloques 

        setBlockGroup(baseMetalGroup, false);

        //Game Over Sprite
        var posTemp = new Par(this.game.width/2, this.game.height+100);
        var scaleTemp = new Par(3,3);
        gameoverSprite = new Collider(this.game, posTemp, scaleTemp,'sprites_atlas', 'game_over');

        /////////////////////////HUD

        //Vidas Texto
        HUD_score = this.game.add.text(this.game.world.centerX + bg.width/2 + 25, 50, ("SCORE\n" + score));
        HUD_score.anchor.setTo(0,0);
        HUD_score.align = "right";
        HUD_score.font = 'Press Start 2P';
        HUD_score.fontSize = 16;
        HUD_score.fill = '#bcbcbc';
        HUD_score.stroke = '#000000';
        HUD_score.strokeThickness = 7;

        //Enemigos Restantes
        var elemsCreated = 0;
        for (var i = 0; i < 10; i++){
            for (var j = 0; j < 2; j++){
                HUD_enemiesArray[elemsCreated] = this.game.add.sprite(this.game.world.centerX + bg.width/2 + 50 + (48*j), 140 + (34*i),'sprites_atlas', 'HUD_enemy');
                HUD_enemiesArray[elemsCreated].scale.setTo(3,3);
                HUD_enemiesArray[elemsCreated].anchor.setTo(0.5,0.5);
                elemsCreated++;
            }
        }

        //Vidas Sprite
        HUD_LivesSprite = this.game.add.sprite(Math.round(this.game.world.centerX + bg.width/2 + 24), Math.round(this.game.world.centerY + bg.height/2 - 130),'sprites_atlas', 'HUD_lives');
        HUD_LivesSprite.scale.setTo(3,3);
        HUD_LivesSprite.anchor.setTo(0,0.5);

        //Vidas Texto
        HUD_Lives = this.game.add.text(this.game.world.centerX + bg.width/2 + 80, HUD_LivesSprite.y + 2, player.lives);
        HUD_Lives.anchor.setTo(0,0.5);
        HUD_Lives.font = 'Press Start 2P';
        HUD_Lives.fontSize = 26;
        HUD_Lives.align = "right";
        HUD_Lives.fill = '#bcbcbc';
        HUD_Lives.stroke = '#000000';
        HUD_Lives.strokeThickness = 7;

        //Nivel Sprite
        HUD_LevelSprite = this.game.add.sprite(this.game.world.centerX + bg.width/2 + 24, bg.height - 15,'sprites_atlas', 'HUD_level');
        HUD_LevelSprite.scale.setTo(3,3);
        HUD_LevelSprite.anchor.setTo(0,0.5);

        //Nivel Texto
        HUD_Level = this.game.add.text(this.game.world.centerX + bg.width/2 + 82, HUD_LevelSprite.y + 2, levelN);
        HUD_Level.anchor.setTo(0,0.5);
        HUD_Level.font = 'Press Start 2P';
        HUD_Level.fontSize = 26;
        HUD_Level.align = "right";
        HUD_Level.fill = '#bcbcbc';
        HUD_Level.stroke = '#000000';
        HUD_Level.strokeThickness = 7;
        
        ///////////////////////Sonidos
        powerupSound = this.game.add.audio('powerup');
        puappearsSound = this.game.add.audio('powerupappears');
        boompowerupSound = this.game.add.audio('boomenemy')
        boombaseSound = this.game.add.audio('boombase');
        bulletmetalSound = this.game.add.audio('bulletmetal');
        bulletbrickSound = this.game.add.audio('bulletbrick');
        music = this.game.add.audio('music');
        music.play();

        //this.game.state.start('levelAnimation', true, false, 2);
    },
    
    update: function(){
        //console.debug("Enemies Spawned: " + spawnCount + " Enemies Killed: " + enemyKilledCount);

        //HUD Update
        if (player.lives >= 0) HUD_Lives.text = player.lives;
        HUD_Level.text = levelN;
        HUD_score.text = "SCORE\n" + score;

        if (enemyKilledCount >= 20){
            if (!loadingLevel){
                this.game.time.events.add(Phaser.Timer.SECOND * 2.5, nextLevel, this);
                loadingLevel = true;
            }
        }

        enemyGroup.forEach(function (e) { e.body.moves = false; });
        
        this.game.physics.arcade.collide(player, enemyGroup);

        enemyGroup.forEach(function (e) { e.body.moves = true;});


        //Player Collisions
        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.collide(player, waterGroup);
        this.game.physics.arcade.collide(player, wallsGroup);
        this.game.physics.arcade.collide(player, baseGroup);
        this.game.physics.arcade.collide(player, baseMetalGroup);
        player.onIce = false;
        this.game.physics.arcade.overlap(player, iceGroup, iceCollision, null, this);

        //Enemy Collisions
        this.game.physics.arcade.overlap(enemyGroup, bloquesGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, waterGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, wallsGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, baseGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.overlap(enemyGroup, baseMetalGroup, collisionChangeDirEnemy, null, this);
        this.game.physics.arcade.collide(enemyGroup, enemyGroup);

        //PowerUps
        this.game.physics.arcade.overlap(player, powerupsGroup, powerupHandler, null, this);

        //Player Bullets Collisions
        this.game.physics.arcade.overlap(playerBullets, wallsGroup, resetPlayerBullet, null, this);
        this.game.physics.arcade.overlap(playerBullets, bloquesGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(bulletCollider, bloquesGroup, destructionHandler, null, this);
        this.game.physics.arcade.overlap(playerBullets, baseGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(bulletCollider, baseGroup, destructionHandler, null, this);
        this.game.physics.arcade.overlap(playerBullets, baseMetalGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(playerBullets, enemyGroup, collisionKillEnemy, null, this);

        //Enemy Bullets collisions with Walls
        this.game.physics.arcade.overlap(enemyBullets1, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets1, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets1, baseGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets1, baseMetalGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseMetalGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets2, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets2, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets2, baseGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets2, baseMetalGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseMetalGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets3, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets3, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets3, baseGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets3, baseMetalGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseMetalGroup, destructionHandlerEnemy, null, this);

        this.game.physics.arcade.overlap(enemyBullets4, wallsGroup, resetBullet, null, this);
        this.game.physics.arcade.overlap(enemyBullets4, bloquesGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, bloquesGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets4, baseGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseGroup, destructionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBullets4, baseMetalGroup, collisionHandlerEnemy, null, this);
        this.game.physics.arcade.overlap(enemyBulletCollider, baseMetalGroup, destructionHandlerEnemy, null, this);

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
        this.game.physics.arcade.collide(hq, enemyGroup);

        //Collision between bullets and HQ
        this.game.physics.arcade.overlap(hq, playerBullets, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets1, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets2, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets3, collisionHQ, null, this);
        this.game.physics.arcade.overlap(hq, enemyBullets4, collisionHQ, null, this);

        //Controla el spawn de los enemigos: hay 4 en pantalla como máximo y 20 por nivel
        if(enemyCount < 4 && spawnCount < 20 && !spawned){
            new SingleAnimation(this.game, spawnPos[spawnIndex], objectsScale, "enemySpawn");
            this.game.time.events.add(Phaser.Timer.SECOND * 1.5, spawnEnemy, this);
            spawned = true;
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
        updateFullscreenIcon(this.game);
    },

    // render: function(){
    //     this.game.debug.text( "Direction X: " + player._direction._x, 50, 80 );
    //     this.game.debug.text( "Direction Y: " + player._direction._y, 50, 100 );
    //     this.game.debug.text( "Player X: " + player.x, 50, 120 );
    //     this.game.debug.text( "Player Y: " + player.y, 50, 140 );
    //     this.game.debug.text(bloquesGroup.length, 50, 140);
    //     this.game.debug.body(player);
    //     this.game.debug.body(bulletCollider);
    //     if (player.lives >= 0){
    //         this.game.debug.text("Vidas", 10, 60);
    //         this.game.debug.text("Restantes: " + player.lives, 10, 80);
    //     }
    //     this.game.debug.text("Enemies", 5, 90);
    //     this.game.debug.text("remaining: " + (20-spawnCount), 5, 110);
    //     this.game.debug.text("Enemies", 5, 140);
    //     this.game.debug.text("destroyed: " + enemyKilledCount, 5, 160);
    //     this.game.debug.text("TankLevel: " + player.tankLevel, 5, 190);
    // }
};

module.exports = PlayScene;

function setBlockGroup(bGroup, bBool){
    if (bBool){
        bGroup.forEach(function (b) { 
            b.visible = true;
            b.body.enable = true;
        });
    }
    else {
        bGroup.forEach(function (b) { 
            b.visible = false;
            b.body.enable = false;
        });
    }
}

function nextLevel(){
    if(levelN < levelData.levels.length - 1)
      levelN++;
    else
      levelN = 1;

    livesN = player.lives;
    tankL = player.tankLevel;
    _game.state.start('levelAnimation', true, false, levelN);
}

function goToMenu(){
    score = 0;
    _game.state.start('menu');
}

//Resets the variables scenes
function resetScene(){
    bulletsUsed1 = false;
    bulletsUsed2 = false;
    bulletsUsed3 = false;
    bulletsUsed4 = false;
    spawnIndex = 0;
    spawnCount = 0;
    enemyCount = 0;
    enemyKilledCount = 0;
    spawned = false;
    gameover = false;
}

//Called if the bullet goes out of the screen
function resetBullet (_bullet) {
    var bulletAnimPos = new Par(_bullet.x + (blockSize/4 * _bullet._direction._x), _bullet.y + (blockSize/4 * _bullet._direction._y));
    new SingleAnimation(this.game, bulletAnimPos, objectsScale, "small_explosion");
    _bullet.kill();
}

//Called if the player bullet goes out of the screen
function resetPlayerBullet (_bullet) {
    var bulletAnimPos = new Par(_bullet.x + (blockSize/4 * _bullet._direction._x), _bullet.y + (blockSize/4 * _bullet._direction._y));
    new SingleAnimation(this.game, bulletAnimPos, objectsScale, "small_explosion");
    _bullet.kill();
    bulletmetalSound.play();
}

//Called if the bullet hits one of the block sprites
function collisionHandler (bullet, block) {
    if (block.blockType === 'Metal') bulletmetalSound.play();
    else bulletbrickSound.play();
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
    var bulletAnimPos = new Par(bullet.x + (blockSize/4 * bullet._direction._x), bullet.y + (blockSize/4 * bullet._direction._y));
    new SingleAnimation(this.game, bulletAnimPos, objectsScale, "small_explosion");
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
    var bulletAnimPos = new Par(bullet.x + (blockSize/4 * bullet._direction._x), bullet.y + (blockSize/4 * bullet._direction._y));
    new SingleAnimation(this.game, bulletAnimPos, objectsScale, "small_explosion");
    bullet.kill();
}

// Called if the bullet hits an enemy
function collisionKillEnemy (bullet, enemy) {
    if (enemy._lives > 1){
        enemy._lives--;
        enemy._hitSound.play();
    }
    else {
        if (enemy._bulletN === 1) bulletsUsed1 = false;
        else if (enemy._bulletN === 2) bulletsUsed2 = false;
        else if (enemy._bulletN === 3) bulletsUsed3 = false;
        else if (enemy._bulletN === 4) bulletsUsed4 = false;
        enemyCount--;
        enemyGroup.remove(enemy);
        enemy._timerbullets.stop();
        score += enemy.points;
        enemy.kill();
        new SingleAnimation(this.game, new Par(enemy.x, enemy.y), objectsScale, "explosion");
        enemyKilledCount++;

        //HUD Enemies left Update
        HUD_enemiesArray[HUD_enemiesArray.length-1].destroy();
        HUD_enemiesArray.length--;

        enemy._destroySound.play();

        var rnd = this.game.rnd.integerInRange(0, 3);
        if (rnd === 3)
            spawnPowerup(this.game);
    }
    var bulletAnimPos = new Par(bullet.x + (blockSize/4 * bullet._direction._x), bullet.y + (blockSize/4 * bullet._direction._y));
    new SingleAnimation(this.game, bulletAnimPos, objectsScale, "small_explosion");
    bullet.kill();
}

// Called if an enemy bullet hits the player
function collisionHitPlayer (_player, enemyBullet) {
    enemyBullet.kill();
    if (_player.lives >= 0 && !_player.helmet){
        _player._destroySound.play();
        _player.lives--;
        _player.resetPos();
        _player.helmet = true;
        playerShield.visible = true;
        _game.time.events.add(Phaser.Timer.SECOND * 5, helmetOff);
        _player.animations.play('player1_level1_right_off');
    }
}

//Called if the bullet hits one of the block sprites
function iceCollision (pl, block) {
    if (block.blockType === 'Ice'){
        //console.debug("Ice");
        player.onIce = true;
    }
}

// Called if two bullets collide;
function collisionBullets (playerBullet, enemyBullet) {
    enemyBullet.kill();
    playerBullet.kill();
}

//Called when the bulletCollider is on top of a block
function destructionHandler (bulletC, block){
    if (block.blockType == 'BrickBase'){
        score += block.points;
        baseGroup.remove(block);
        block.kill();
    }
    else if (block.blockType != 'Metal'){
        score += block.points;
        block.kill();
    }
    else if (player.tankLevel >= 4){
        score += block.points;
        block.kill();
    }
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
        boombaseSound.play();
        hq.animations.add('hq_2', ['base_2'], 1, true);
        hq.animations.play('hq_2');
        new SingleAnimation(this.game, new Par(hq.x, hq.y), objectsScale, "explosion");
        gameOver();
    }
}

function gameOver(){
    if (!gameover){
        gameover = true;
        player.canMove = false;
        _game.time.events.add(Phaser.Timer.SECOND * 7, goToMenu, this);
    }
}

// Called if an enemy hits a wall, etc.
function collisionChangeDirEnemy (enemy, block){
    if (enemy._direction._x !== 0){
        enemy.x += enemy.gapH;
        enemy.x = 24 * Math.round(enemy.x/24) - enemy.gapH;
    }
    if (enemy._direction._y !== 0){
        enemy.y += enemy.gapW;
        enemy.y = 24 * Math.round(enemy.y/24) - enemy.gapW;
    }
    enemy.stop();
    //console.debug('hit!');
    if (!enemy._changeCalled){
        enemy._timer.stop();
        enemy._changeCalled = true;
        enemy.game.time.events.add(Phaser.Timer.SECOND * 0.25, enemy.change_dir, enemy);
    }
}

// Called if a powerup is taken
function powerupHandler (player, powerup){
    //console.debug(powerup.blockType);
    powerupSound.play();
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
        boompowerupSound.play();
        killEnemiesAlive()
    }
    else if (powerup.blockType === 'powerup_tank'){
        player.lives++;
    }
    else if (powerup.blockType === 'powerup_helmets'){
        player.helmet = true;
        playerShield.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, helmetOff);
    }
    else if (powerup.blockType === 'powerup_shovel'){
        powerUpShovel();
    }
    else if (powerup.blockType === 'powerup_timer'){
        this.game.timeOn = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, timerOff);
    }
    
    powerup.kill();
}

function timerOff(){
    _game.timeOn = true;
}

function helmetOff (){
    player.helmet = false;
    playerShield.visible = false;
}

function powerUpShovel(){
    powerUpShovelOn();
    _game.time.events.add(Phaser.Timer.SECOND * 10, powerUpShovelOff, this);
    _game.time.events.add(Phaser.Timer.SECOND * 10.5, powerUpShovelOn, this);
    _game.time.events.add(Phaser.Timer.SECOND * 11, powerUpShovelOff, this);
    _game.time.events.add(Phaser.Timer.SECOND * 11.5, powerUpShovelOn, this);
    _game.time.events.add(Phaser.Timer.SECOND * 12, powerUpShovelOff, this);
    _game.time.events.add(Phaser.Timer.SECOND * 12.5, powerUpShovelOn, this);
    _game.time.events.add(Phaser.Timer.SECOND * 13, powerUpShovelOff, this);
}

function powerUpShovelOn(){
    setBlockGroup(baseGroup, false);
    setBlockGroup(baseMetalGroup, true);
}

function powerUpShovelOff(){
    setBlockGroup(baseMetalGroup, false);
    setBlockGroup(baseGroup, true);
}

function killEnemiesAlive(){
    while (enemyGroup.length > 0){
        enemyGroup.forEach(function (e) { 
            if (e._bulletN === 1) bulletsUsed1 = false;
            else if (e._bulletN === 2) bulletsUsed2 = false;
            else if (e._bulletN === 3) bulletsUsed3 = false;
            else if (e._bulletN === 4) bulletsUsed4 = false;
            enemyCount--;
            e._timerbullets.stop();
            score += e.points;
            enemyKilledCount++;
            new SingleAnimation(_game, new Par(e.x, e.y), objectsScale, "explosion");
            enemyGroup.remove(e);
            e.kill();
            HUD_enemiesArray[HUD_enemiesArray.length-1].destroy();
            HUD_enemiesArray.length--;
        });
    }
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
    enemyCount++;
    spawnCount++;
    spawnIndex++;
    if (spawnIndex >= spawnPos.length) spawnIndex = 0;
}

function spawnPowerup(game){
    puappearsSound.play();
    var rnd = game.rnd.integerInRange(0, powerupTypes.length - 1);
    var id = powerupTypes[rnd];
    var powerup = new Powerup(game, getCell(game, blockSize, game.rnd.integerInRange(1, 11), game.rnd.integerInRange(1, 11)), objectsScale, 'sprites_atlas', id, id, 10);
    powerup.animations.add('blink', [id, 'empty'], 4, true);
    powerup.animations.play('blink');
    powerupsGroup.add(powerup);
}

function fullscreenToggle(){
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    }
    else{
        this.game.scale.startFullScreen(false);
    }
}

function updateFullscreenIcon(_game){
    if (_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_1') {
        fullscreenButton.setFrames('HUD_fullscreen_2','HUD_fullscreen_2','HUD_fullscreen_2');
    }
    else if (!_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_2'){
        fullscreenButton.setFrames('HUD_fullscreen_1','HUD_fullscreen_1','HUD_fullscreen_1');
    }
}

function muteToggle() {
    if (!this.game.sound.mute) {
        this.game.sound.mute = true;
        muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');
    } else {
        this.game.sound.mute = false;
        muteButton.setFrames('HUD_mute_1','HUD_mute_1','HUD_mute_1');
    }
}
},{}]},{},[3]);
