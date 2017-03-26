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
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext('2d');
        this.displayHeight = this.context.canvas.height;
        this.displayWidth = this.context.canvas.width;

        //Initialize an asteroid list to empty.
        this.asteroidList = [];

        this.canvas.addEventListener("click", (e) => {
           this.clickHandler(e);
        });
    }

    clickHandler(event){
        var mouseClick = {x: event.clientX, y: event.clientY};

        //Check if you clicked an asteroid
        for (var i = 0; i < this.asteroidList.length; i++){
            if (this.asteroidList[i].checkPointCollision(mouseClick.x, mouseClick.y)){
                this.asteroidList[i].velocity.x *= -1;
                this.asteroidList[i].velocity.y *= -1;
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


        this.asteroidImage = new Image();
        this.asteroidImage.src = "./resources/asteroid-1.png";

        this.asteroidList.push(new Asteroid(this.asteroidImage, this.displayWidth, this.displayHeight));



        this.gameLoop();
    }

    gameLoop(){

        var self = this;
        var fps = 30;
        var now;
        var then = Date.now();
        var interval = 1000/fps;
        var delta;

        function draw(){

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


            self.context.clearRect(0, 0, self.displayWidth, self.displayHeight);
            self.context.drawImage(self.background, 0, 0, self.displayWidth,self.displayHeight);

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

}