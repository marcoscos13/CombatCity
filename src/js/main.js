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
    //this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    //this.loadingBar.anchor.setTo(0, 0.5);
    //this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game    
    // this.game.load.baseURL = 'https://marcoscos13.github.io/CombatCity/src/';
    // this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('tank', 'images/tanque.png');
    this.game.load.image('bullet', 'images/bullet.png');
    //this.game.load.image('muro', 'images/muro.png');
    //this.game.load.image('metal', 'images/metal.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('white', 'images/white.png');
    //this.game.load.image('map_sheet', 'images/map_sheet.png');
    this.game.load.spritesheet('map_sheet', 'images/map_sheet.png', 16, 16, 8);
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
  //game.state.add('play', TestScene); //Escena de testing ------------------------------
  //game.state.add('play', TestScene2); //Escena de testing 2 ------------------------------

  game.state.start('boot');
};
