const SEG_SIZE = 25;
const F_PER_MOVE = 5;

let snk;
let http;
let userName = "";
let score = 0;
let gameOver = false;
let nameEntered = false;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  snk = new snake(width/2, height/2);
  fd = new food();
  score = 0;
}

function draw() {
  background(0, 0, 0, 255);

  if(gameOver){
    if(nameEntered){
      http = new XMLHttpRequest();
      http.open("POST", "http://localhost:8080/", false);
      http.setRequestHeader("Content-Type", "text/plain");
      http.send("snake," + userName + "," + score);

      nameEntered = false;
      gameOver = false;
      userName = "";
      setup();
    }
    else{
      nameEntry();
      if(userName.length >= 3){
        nameEntered = true;
      }
    }
  }
  else{
    snk.show();
    snk.update();
    fd.show();
    fd.update();
  }

  push();
  stroke(255);
  fill(255);
  textSize(32);
  text("SCORE: " + score, width/2, 35);
  pop();
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
}

function nameEntry(){
  push();
  textSize(24);
  textAlign(CENTER);
  stroke(255);
  fill(255);
  text("Please enter your initials: " + userName, width/2, height/2);
  pop();
}

function keyTyped(){
  if(key.search(/[^A-Za-z\s]/) == -1 && gameOver && !nameEntered){
    userName += key.toUpperCase();
  }
}

class segment{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.s = SEG_SIZE;
  }

  show(){
    fill(255, 255 - score * 2, 255 - score * 2);
    stroke(255, 255 - score * 2, 255 - score * 2);
    rect(this.x, this.y, this.s, this.s);
  }
}

class snake{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.xdir = -1;
    this.ydir = 0;
    this.segments = [];
    let newx = this.x;
    for(let i = 0; i < 2; i++){
      this.segments.push(new segment(newx, this.y));
      newx += SEG_SIZE;
    }

    this.lastmove = 0;
  }

  show(){
    for(let i = 0; i < this.segments.length; i++){
      this.segments[i].show();
    }
  }

  update(){
    if(this.lastmove >= F_PER_MOVE - score / 50){
      if(keyIsDown(LEFT_ARROW) && this.xdir == 0){
        this.xdir = -1;
        this.ydir = 0;
      }
      else if(keyIsDown(RIGHT_ARROW) && this.xdir == 0){
        this.xdir = 1;
        this.ydir = 0;
      }
      else if(keyIsDown(DOWN_ARROW) && this.ydir == 0){
        this.xdir = 0;
        this.ydir = 1;
      }
      else if(keyIsDown(UP_ARROW) && this.ydir == 0){
        this.xdir = 0;
        this.ydir = -1;
      }
      this.move(this.xdir, this.ydir);
      this.checkCollisions();
      this.lastmove = 0;
    }
    this.lastmove++;
  }

  move(xdir, ydir){
    this.tail().x = this.head().x + SEG_SIZE*xdir;
    this.tail().y = this.head().y + SEG_SIZE*ydir;
    this.segments.unshift(this.segments.pop());
  }

  tail(){
    return this.segments[this.segments.length-1];
  }

  head(){
    return this.segments[0];
  }

  checkCollisions(){
    for(let i = 1; i < this.segments.length; i++){
      if(this.head().x == this.segments[i].x &&
         this.head().y == this.segments[i].y)
         {
            gameOver = true;
         }
    }

    if(this.head().x < 0 || this.head().x > width){ gameOver = true; }
    if(this.head().y < 0 || this.head().y > height){ gameOver = true; }
  }

  addSegment(){
    this.segments.push(new segment(this.tail().x, this.tail().y));
  }
}

class food{
  constructor(){
    this.x = int(random(SEG_SIZE, width - SEG_SIZE));
    this.y = int(random(SEG_SIZE, height - SEG_SIZE));
  }

  show(){
    ellipse(this.x, this.y, SEG_SIZE/2);
  }

  update(){
    if(this.checkCollisions()){
      snk.addSegment();
      this.respawn();
      score++;
    }
  }

  checkCollisions(){
    if(dist(this.x, this.y, snk.head().x + SEG_SIZE / 2, snk.head().y + SEG_SIZE / 2) <= SEG_SIZE / 1.5){
      return true;
    }
    else{
      return false;
    }
  }

  respawn(){
    this.x = random(SEG_SIZE, width - SEG_SIZE);
    this.y = random(SEG_SIZE, height - SEG_SIZE);
    if(this.checkCollisions()){
      this.respawn();
    }
  }
}
