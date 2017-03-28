$(document).ready(function(){

 console.log("Initializing display");

 //Change canvas to screen size
 var ctx = document.getElementById("game").getContext('2d');
 ctx.canvas.width = window.innerWidth;
 ctx.canvas.height = window.innerHeight;

 game = new Game();
 game.init();

});

class Game{
    constructor(){

        this.ctr = 0

        this.storage = window.localStorage;

        //Check if there is a hiscore
        if (!this.storage.hiscore){
          //Initialize to 0 if there isn't.
          this.storage.hiscore = 0;
        }

        console.log("Building Game");
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext('2d');
        this.displayHeight = this.context.canvas.height;
        this.displayWidth = this.context.canvas.width;

        //Initialize an asteroid list to empty.
        this.asteroidList = [];

        this.canvas.addEventListener("click", (e) => {
          console.log(e.clientX, e.clientY);
           this.clickHandler(e);
        });

    }

    clickHandler(event){
        var mouseClick = {x: event.clientX, y: event.clientY};

        //Check if you clicked an asteroid
        for (var i = 0; i < this.asteroidList.length; i++){
            if (this.asteroidList[i].checkPointCollision(mouseClick.x, mouseClick.y)){

                this.hitSound.play();

                var asteroid = this.asteroidList[i];

                //Get the center point of the asteroid:
                var asteroidCenter = {};
                asteroidCenter.x = asteroid.position.x + asteroid.width/2;
                asteroidCenter.y = asteroid.position.y + asteroid.height/2;

                var velX = asteroidCenter.x - mouseClick.x;
                var velY = asteroidCenter.y - mouseClick.y;

                var currMagnitude = Math.sqrt(Math.pow(asteroid.velocity.x, 2), Math.pow(asteroid.velocity.x, 2));

                velX = velX/currMagnitude;
                velY = velY/currMagnitude;

                this.asteroidList[i].velocity.x = velX;
                this.asteroidList[i].velocity.y = velY;
            }
        }

    }



    init(){
        console.log("Initializing Game");

        this.background = new Image();
        this.background.src = "./resources/space-background.jpg";
        var self = this;
        this.background.addEventListener('load', () => {
            self.context.drawImage(self.background, 0, 0, self.displayWidth,self.displayHeight);
        }, false);

        this.planet = new Image();
        this.planet.src = "./resources/planet.png";

        this.planet.width = 150;
        this.planet.height = 150;

        this.planet.xPos = self.displayWidth/2-self.planet.width/2;
        this.planet.yPos = self.displayHeight/2-self.planet.height/2

        var self = this;
        this.planet.addEventListener('load', ()=>{
           self.context.drawImage(self.planet, this.planet.xPos, this.planet.yPos, self.planet.width, self.planet.height);
        });

        this.asteroidImage = new Image();
        this.asteroidImage.src = "./resources/asteroid-1.png";

        this.asteroidList.push(new Asteroid(this.asteroidImage, this.displayWidth, this.displayHeight));


        //Initialize sounds
        this.explosionSound = new Audio('./resources/sounds/explosion.mp3');
        this.hitSound = new Audio('./resources/sounds/hit.mp3');

        this.gameLoop();
    }

    gameLoop(){

        var self = this;
        var fps = 30;
        var now;
        var then = Date.now();
        var interval = 1000/fps;
        var delta;

        var gameOver = false;

        var score = 0;

        self.hiscore = self.storage.hiscore;

        function draw(){

            if(gameOver){

              //Clear the screen
              self.context.clearRect(0, 0, self.displayWidth, self.displayHeight);

              //Draw the background (this must come first)
              self.context.drawImage(self.background, 0, 0, self.displayWidth,self.displayHeight);

              //Draw the score
              self.context.font="20px Georgia";
              self.context.fillStyle = 'white';
              console.log(self.context.measureText("GAME OVER").width);
              self.context.fillText("GAME OVER", self.displayWidth/2-self.context.measureText("GAME OVER").width/2, self.displayHeight/2);
              self.context.fillText("SCORE: " + score.toString(), self.displayWidth/2-self.context.measureText("SCORE: " + score.toString()).width/2, self.displayHeight/2 + 25)

              //Update the hiscore if applicable:
              var hiscore = self.storage.hiscore;

              if (score >= hiscore){
                self.storage.hiscore = score;

                //Display text for new hiscore

                self.context.fillText("NEW HIGH SCORE!", self.displayWidth/2-self.context.measureText("NEW HIGH SCORE!").width/2, self.displayHeight/2 + 50);

              }

              return;
            }

            requestAnimationFrame(draw);

            now = Date.now();
            delta = now-then;
            if (!(delta > interval)) {return;}
            then = now - (delta % interval);
            //Small chance of generating an asteroid on the screen:
            var asteroidChance = 0.1;
            if (Math.random() < asteroidChance){
                //Build an asteroid
                self.asteroidList.push(new Asteroid(self.asteroidImage, self.displayWidth, self.displayHeight));
            }

            if (self.checkAsteroidCollisionWithPlanet(self.asteroidList, self.planet)){
                gameOver = true;
                console.log("COLLISION YOU LOSE");
            }

            //Increment the score!
            score++;

            //Clear the screen
            self.context.clearRect(0, 0, self.displayWidth, self.displayHeight);

            //Draw the background (this must come first)
            self.context.drawImage(self.background, 0, 0, self.displayWidth,self.displayHeight);

            //Draw the planet
            self.context.drawImage(self.planet, self.displayWidth/2-self.planet.width/2, self.displayHeight/2-self.planet.height/2, self.planet.width, self.planet.height);

            //Draw the score
            self.context.font="20px Georgia";
            self.context.fillStyle = 'white';
            self.context.fillText(score.toString(), 25, 25);

            //Draw hiscore text in top right corner
            self.context.fillText("High score: " + self.hiscore, self.displayWidth-self.context.measureText("High score: " + self.hiscore).width - 25, 25)

            //Draw all of the asteroids in the list
            for (var i = 0; i < self.asteroidList.length; i++){
                //console.log(self.asteroidList[i]);
                self.asteroidList[i].draw(self.context);

                //Will move the asteroid, if false is returned, remove it from the list.
                if (!self.asteroidList[i].move()){
                    self.asteroidList.splice(i, 1);
                }

            }
        }

        draw();

    }

    //Method returns true if there was a collision
    checkAsteroidCollisionWithPlanet(asteroidList, planet){
        for (var i = 0; i < asteroidList.length; i++){
            var asteroid = asteroidList[i];

            if (this.ctr%10000 == 0){
              console.log(planet.xPos, planet.yPos);
              console.log(planet.xPos+planet.width, planet.yPos + planet.height);
            }
                        this.ctr++
            if (asteroid.position.x + asteroid.width >= planet.xPos + 30 &&
            asteroid.position.x <= planet.xPos + planet.width - 30 &&
            asteroid.position.y + asteroid.height >= planet.yPos + 30&&
            asteroid.position.y <= planet.yPos + planet.height - 30){
                this.explosionSound.play();
                return true;
            }

        }
        return false; //No collision if you reach here.
    }

}
