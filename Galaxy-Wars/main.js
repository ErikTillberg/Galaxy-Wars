window.onload = function(){

 console.log("Initializing display");

 //Change canvas to screen size
 var ctx = document.getElementById("game").getContext('2d');
 ctx.canvas.width = window.innerWidth;
 ctx.canvas.height = window.innerHeight;

 game = new Game();
 game.init();

};

class Game{
 constructor(){
  console.log("Building Game");
  this.context = document.getElementById("game").getContext('2d');
  this.displayHeight = this.context.canvas.height;
  this.displayWidth = this.context.canvas.width;

  this.asteroidHeight = this.displayHeight/8;
  this.asteroidWidth = this.displayHeight/8;
  
 }

 init(){
  console.log("Initializing Game");
  // this.context.fillStyle = 'black';
  // this.context.fillRect(0, 0, this.displayWidth, this.displayHeight);

  var background = new Image();
  background.src = "./resources/space-background.jpg";
  var self = this;
  background.addEventListener('load', () => {
   self.context.drawImage(background, 0, 0, self.displayWidth,self.displayHeight);
  }, false);

  this.asteroidImg = new Image();
  this.asteroidImg.src = "./resources/asteroid-1.png";

  this.asteroidImg.addEventListener('load', () => {
   self.context.drawImage(this.asteroidImg, 50, 93, self.asteroidWidth, self.asteroidHeight);;
  }, false);

 }
}