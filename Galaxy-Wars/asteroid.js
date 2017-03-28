class Asteroid{
    constructor(asteroidImg, screenWidth, screenHeight){
        //Initially set height and width to screenHeight/8;, should be random values in a range.
        this.width = screenHeight/8;
        this.height = screenHeight/8;

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        //Set the image
        this.image = asteroidImg;

        //Set the inital x and y values for position to random values on the screen
        this.position = {};

        //Set the initial position to one of

        this.position.x = Math.floor(Math.random()*screenWidth);

        while (this.position.x > screenWidth/6 && this.position.x < screenWidth - screenWidth/6){
          this.position.x = Math.floor(Math.random()*screenWidth);
        }

        this.position.y = Math.floor(Math.random()*screenHeight);

        while (this.position.y > screenHeight/6 && this.position.y < screenHeight - screenHeight/6){
          this.position.y = Math.floor(Math.random()*screenHeight);
        }

        var maxSpeed = 5;

        this.velocity = {};

        //Either positive or negative for x and y directions
        var xDir = Math.random() < 0.5? 1 : -1;
        var yDir = Math.random() < 0.5? 1: -1;

        //Generate a random point inside a square of sixe mxm inside center of map:

        var randomPoint = {};
        randomPoint.x = Math.floor(Math.random()*screenWidth);

        while (this.position.x < screenWidth/6 && this.position.x > screenWidth - screenWidth/6){
          randomPoint.x = Math.floor(Math.random()*screenWidth);
        }

        randomPoint.y = Math.floor(Math.random()*screenHeight);

        while (randomPoint.y < screenHeight/6 && randomPoint.y > screenHeight - screenHeight/6){
          randomPoint.y = Math.floor(Math.random()*screenHeight);
        }

        this.velocity.x = randomPoint.x - this.position.x;
        this.velocity.y = randomPoint.y- this.position.y;

        var mag = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y+this.velocity.y);

        this.velocity.x /= mag;
        this.velocity.y /= mag;
    }

    draw(context){
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    move(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Remove the asteroid from the screen if it's out of the screen
        if (this.position.x - this.width > this.screenWidth ||
                this.position.x + this.width < 0 ||
                this.position.y + this.height < 0 ||
                this.position.y - this.height > this.screenHeight){
            return false; //Return false to signal out of screen
        }

        return true;

    }

    //Check for a collision with a point {x, y}
    checkPointCollision(x, y){
        if (x > this.position.x &&
            x < this.position.x + this.width &&
            y > this.position.y &&
            y < this.position.y + this.height) {
            return true; //There was a collision
        } else {
            return false; // No collision.
        }
    }

}
