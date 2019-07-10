let PLY_WIDTH = 50;
let PLY_HEIGHT = 25;
let PLY_SPEED = 3;
let PROJ_SPEED = 20;
let FIRE_DELAY = 50;

let ALIEN_WIDTH = 55;
let ALIEN_HEIGHT = 40;
let ALIEN_SPEED = 2.5;
let ALIEN_SPACING = 1.6;

let ply;
let projectiles = [];
let aliens = [];
let alienRows;
let aliensPerRow;
let alienImage;

let numAliens;
let alienYOffset = 0;
let speedMult = 1;
let dir = 1;

let changeDir = false;
let lost = false;

function setup() {
  p5.disableFriendlyErrors = true;
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');

  alienRows = int( (height / ALIEN_HEIGHT) / 4);
  aliensPerRow = int( (width / ALIEN_WIDTH) / 4);
  numAliens = alienRows * aliensPerRow;
  alienImage = loadImage("spacealien.png");

  ply = new player();

  for(i = 0; i < aliensPerRow; i++){
    for(j = 0; j < alienRows; j++){
      aliens.push(new alien(i * ALIEN_WIDTH * ALIEN_SPACING,
                            j * ALIEN_HEIGHT * ALIEN_SPACING));
    }
  }
}

function draw() {
  background(0, 0, 0, 150);
  ply.update();
  ply.show();
  for(i = 0; i < projectiles.length; i++){
    projectiles[i].update();
    projectiles[i].show();
  }
  for(i = 0; i < aliens.length; i++){
    aliens[i].update();
    aliens[i].show();
  }
  if(changeDir){
    dir *= -1;
    changeDir = false;
  }

  if(lost){
    textSize(128);
    textAlign(CENTER);
    stroke(30, 255, 30);
    fill(30, 255, 30);
    text("YOU DIED", ply.x, height/2);
  }
  else if(aliens.length == 0){
    textSize(128);
    textAlign(CENTER);
    text("YOU WON!", ply.x, height/2);
  }

  cullObjects();
}

//Probably could just cull objects in draw().
function cullObjects() {
  for(i = 0; i < projectiles.length; i++){
    //Culls projectiles off the screen.
    if(projectiles[i].cull || projectiles[i].y < 0){
      projectiles.splice(i, 1);
    }
  }
  for(i = 0; i < aliens.length; i++){
    if(aliens[i].cull || lost){
      aliens.splice(i, 1);
      speedMult += 4 / numAliens;
    }
  }
}

class player{
  constructor(){
    //Main player body.
    this.x = width / 2;
    this.y = height - PLY_HEIGHT;
    this.w = PLY_WIDTH;
    this.h = PLY_HEIGHT;
    this.mvspeed = PLY_SPEED;

    //Player's cannon.
    this.cx = this.x + this.w / 2.75;
    this.cy = this.y - this.h;
    this.cw = this.h / 2;
    this.ch = this.h;
    this.rtime = 0; //Reload time.
  }

  show(){
    stroke(255);
    fill(255);
    rect(this.x, this.y, this.w, this.h);
    rect(this.cx, this.cy, this.cw, this.ch);
  }

  update(){
    this.mvspeed = PLY_SPEED * speedMult;
    //Movement.
    if(keyIsDown(LEFT_ARROW) && this.x > 0){
      this.x -= this.mvspeed;
      this.cx -= this.mvspeed;
    }
    if(keyIsDown(RIGHT_ARROW) && this.x < width - this.w){
      this.x += this.mvspeed;
      this.cx += this.mvspeed;
    }
    //Firing.
    if(keyIsDown(UP_ARROW) && this.rtime >= FIRE_DELAY){
      projectiles.push(new projectile());
      this.rtime = 0;
    }
    this.rtime++;
  }
}

class projectile{
  constructor(){
    this.x = ply.cx;
    this.y = ply.cy;
    this.spd = PROJ_SPEED;
    this.cull = false;
  }

  show(){
    rect(this.x, this.y, 5, 5);
  }

  update(){
    this.y -= this.spd;
    for(alien of aliens){
      //If the projectile is within an alien's hitbox, cull it and the projectile.
      if(this.x >= alien.x && this.x <= alien.x + alien.w){
        if(this.y >= alien.y && this.y <= alien.y + alien.h){
          alien.cull = true;
          this.cull = true;
        }
      }
    }
  }
}

class alien{
  constructor(x, y){
    this.x = x;
    this.y = 0;
    this.w = ALIEN_WIDTH;
    this.h = ALIEN_HEIGHT;
    this.mvspeed = ALIEN_SPEED * speedMult;
    this.yoffset = y;
    this.cull = false;
  }

  show(){
    stroke(30, 255, 30);
    fill(30, 255, 30);
    image(alienImage, this.x, this.y, this.w, this.h);
  }

  update(){
    this.mvspeed = ALIEN_SPEED * speedMult * dir;
    this.x += this.mvspeed;
    this.y = this.yoffset + alienYOffset;

    //Check if aliens must change direction, unless we are changing next tick.
    if(!changeDir){
      if(this.x + this.w > width){
        changeDir = true;
        alienYOffset += ALIEN_HEIGHT;
      }
      else if(this.x < 0){
        changeDir = true;
        alienYOffset += ALIEN_HEIGHT;
      }
    }
    //If an alien is on the same row as the player, you lost.
    if(this.y + this.h >= ply.cy){
      lost = true;
    }
  }
}
