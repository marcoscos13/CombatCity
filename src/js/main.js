'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu_scene.js');
var LevelAnimationScene = require('./levelAnimation_scene.js');
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
    this.game.load.image('game_over', 'images/game_over.png');
    this.game.load.image('menu_logo', 'images/menu_logo.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('white', 'images/white.png');
    this.game.load.image('grey', 'images/grey.png');
    this.game.load.atlas('sprites_atlas', 'images/sprites_atlas.png', 'images/sprites_atlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.audio('shoot', 'sounds/shoot.ogg');
    this.game.load.audio('boomenemy', 'sounds/boomenemy.ogg');
    this.game.load.audio('boombase', 'sounds/boombase.ogg');
    this.game.load.audio('boomplayer', 'sounds/boomplayer.ogg');
    this.game.load.audio('bulletbrick', 'sounds/bulletbrick.ogg');
    this.game.load.audio('bulletmetal', 'sounds/bulletmetal.ogg');
    this.game.load.audio('enemyhurt', 'sounds/enemyhurt.ogg');
    this.game.load.audio('powerup', 'sounds/powerup.ogg');
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
  game.state.add('play', PlayScene); //Escena de juego
  game.state.add('levelAnimation', LevelAnimationScene); //Escena de juego

  game.state.start('boot');
};
