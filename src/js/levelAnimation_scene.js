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
        levelText.text = "◄ LEVEL " + currentLevel + " ►";
    },

    render: function(){
        
    }
};

module.exports = LevelAnimationScene;

function goToLevel(){
    this.game.state.start('play', true, false, currentLevel);
}