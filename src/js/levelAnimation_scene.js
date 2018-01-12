'use strict';

var NUMBERTEST = 0;

var LevelAnimationScene = {
    init: function(customParam1) {   
        NUMBERTEST = customParam1;
    },

    preload: function(){
        
    },

    create: function(){

    },
    
    update: function(){
       console.debug(NUMBERTEST);
    },

    render: function(){
        
    }
};

module.exports = LevelAnimationScene;