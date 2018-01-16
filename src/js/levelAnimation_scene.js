'use strict';

var currentLevel = 0;
var levelText;
var Enter;

var LevelAnimationScene = {
    init: function(customParam1) {   
        currentLevel = customParam1;
    },

    preload: function(){
        
    },

    create: function(){
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
        Enter.onDown.add(function(){
                this.game.state.start('play', true, false, currentLevel);
        }, this);
    },
    
    update: function(){
       
    },

    render: function(){
        
    }
};

module.exports = LevelAnimationScene;