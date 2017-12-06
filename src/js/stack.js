'use strict';

var SmartStack = function(){
    this.top = null;
    this.size = 0;
  };
  
  var Node = function(data){
    this.data = data;
    this.previous = null;
  };
  
  SmartStack.prototype.push = function(data) {
    var node = new Node(data);
  
    node.previous = this.top;
    this.top = node;
    this.size += 1;
    return this.top;
  };
  
  SmartStack.prototype.pop = function() {
    var temp = this.top;
    this.top = this.top.previous;
    this.size -= 1;
    return temp;
  };

  SmartStack.prototype.remove = function(data){
      var found = false;
      var next = null;
      var actual = this.top;
      var i = 0;
      while (i < this.size && !found){
          if (actual.data === data){
              found = true;
              if (next !== null) next.previous = actual.previous;
              else this.top = actual.previous;
              this.size -= 1;
          }
          next = actual;
          actual = actual.previous;
          i++;
      }
  }

