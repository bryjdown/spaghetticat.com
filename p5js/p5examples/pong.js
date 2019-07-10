let LP_MOVE_SPEED = 10;
let RP_MOVE_SPEED = 7;
let B_SPEED = -12;
let PADDLE_WIDTH = 10;
let PADDLE_HEIGHT = 80;
let BALL_R = 15;

let lp;
let rp;
let b;

let lscore = 0;
let rscore = 0;

let restart = false;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');

  PADDLE_HEIGHT = height / 8;

  lp = new lpaddle(50, 50);
  rp = new rpaddle(width-50, 50);
  b = new ball(width/2, height/2);

  lscore = 0;
  rscore = 0;
}

function draw() {
  background(0, 0, 0, 145);
  lp.update();
  lp.show();
  rp.update();
  rp.show();
  b.update();
  b.show();

  let scores = lscore + "     " + rscore;
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(scores, width/2, 50);

  if(lscore >= 5){
    stroke(0);
    fill(255);
    text("YOU WON", width/2, height/2);
    textSize(16);
    text("Press any key to play again.", width/2, (height/2) + 50);
    if(restart){
      setup();
    }
  }
  else if(rscore >= 5){
    stroke(0);
    fill(255);
    text("YOU LOST", width/2, height/2);
    textSize(16);
    text("Press any key to play again.", width/2, (height/2) + 50);
    if(restart){
      setup();
    }
  }

  restart = false;
}

function keyPressed(){
  restart = true;
}

class lpaddle{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.mspeed = LP_MOVE_SPEED;
  }

  show(){
    noFill();
    stroke(255);
    strokeWeight(4);
    rect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  }

  update(){
    if( this.y + PADDLE_HEIGHT < height ){
      if( keyIsDown(DOWN_ARROW) ) {this.y += this.mspeed;}
    }
    if( this.y > 0 ){
      if( keyIsDown(UP_ARROW) ) {this.y -= this.mspeed;}
    }
  }
}

class rpaddle{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.mspeed = RP_MOVE_SPEED;
  }

  show(){
    noFill();
    stroke(255);
    strokeWeight(4);
    rect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  }

  update(){
    if( this.y > b.y && this.y > 0 ){
      this.y -= this.mspeed;
    }
    if(this.y < height - PADDLE_HEIGHT){
      if( this.y + PADDLE_HEIGHT < b.y){
        this.y += this.mspeed;
      }
    }
  }
}

class ball{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.mspeed = B_SPEED;
    this.velocity = createVector(B_SPEED, B_SPEED, 0);
    this.r = BALL_R;
    this.lastscore = "right";
  }

  show(){
    noFill();
    stroke(255);
    strokeWeight(3);
    ellipse(this.x, this.y, this.r);
  }

  update(){
    if( this.y + this.r > lp.y && this.y - this.r < lp.y + PADDLE_HEIGHT){
      let ldist = (this.x - BALL_R) - (lp.x + PADDLE_WIDTH);
      if( ldist <= 0 && ldist >= -(BALL_R + PADDLE_WIDTH) ){
        this.x = lp.x + BALL_R + PADDLE_WIDTH;
        this.velocity.y = map(this.y - lp.y, 0, PADDLE_HEIGHT, B_SPEED, -B_SPEED);
        this.velocity.x *= -1;
      }
    }

    if( this.y + this.r > rp.y && this.y - this.r < rp.y + PADDLE_HEIGHT){
      let rdist = (rp.x) - (this.x + BALL_R);
      if( rdist <= 0 && rdist >= -(BALL_R + PADDLE_WIDTH) ){
        this.x = rp.x - BALL_R - PADDLE_WIDTH;
        this.velocity.y = map(this.y - rp.y, 0, PADDLE_HEIGHT, B_SPEED, -B_SPEED);
        this.velocity.x *= -1;
      }
    }

    if( this.y < 0 + this.r ){ this.velocity.y *= -1; }
    else if( this.y + this.r > height ){ this.velocity.y *= -1; }

    if( this.x < 0 ){
      rscore++;
      this.x = lp.x + 50;
      this.y = height/2;
      this.velocity.x = -B_SPEED;
      this.velocity.y = random(-B_SPEED, B_SPEED);
    }
    else if( this.x > width ){
      lscore++;
      this.x = rp.x - 50;
      this.y = height/2;
      this.velocity.x = B_SPEED;
      this.velocity.y = random(-B_SPEED, B_SPEED);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
