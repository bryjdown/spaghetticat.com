
let BUMPER_OVERHANG = 1;
let BUMPER_SPEED = 10;
let BASE_GAP;

let ply;
let bumperLayers = [];
let fallSpeed = 3;
let layerSpawnDelay = 100;
let lastSpawn = 0;
let gameSpeed = 1;
let gameOver = false;
let mouseEnabled = false;
let score = 0;

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  ply = new Player(width/2, height/2, 35);
  BASE_GAP = width / 4;
  bumperLayers.push(new BumperLayer(BASE_GAP));
}

function draw(){
  if(!gameOver){
    background(0);

    //Update and show game objects.
    ply.show();
    for(var bl of bumperLayers){
      bl.update();
      bl.show();
    }
    updateInput();

    //Spawn new bumper layers.
    lastSpawn++;
    if(lastSpawn >= (layerSpawnDelay / gameSpeed)){
      bumperLayers.push(new BumperLayer(BASE_GAP / gameSpeed));
      lastSpawn = 0;
    }

    //Cull bumper layers which are offscreen.
    for(var bl of bumperLayers){
      if(bl.cull){
        bumperLayers.shift();
        score++;
      }
    }

    displayScore();
    gameSpeed += 0.0003;
  }
  else{
    //TODO: Push the score to a highscore database somewhere.
    displayGameOver();
    displayScore();
    if(keyIsDown(ENTER)){
      gameOver = false;
      bumperLayers = [];
      gameSpeed = 1;
      lastSpawn = layerSpawnDelay;
      score = 0;
    }
  }
}

function keyPressed(){
  if(keyCode == TAB){
    mouseEnabled = !mouseEnabled;
  }
}

function displayScore(){
  push();
  stroke(255);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(score, width/2, 50);
  textAlign(LEFT);
  textSize(16);
  noStroke();
  text("Press TAB to toggle mouse controls.", 10, 20);
  pop();
}

function displayGameOver(){
  push();
  textSize(64);
  stroke(255, 0, 0);
  fill(255, 0, 0);
  textAlign(CENTER);
  text("GAME OVER!", width/2, height/2);
  textSize(32);
  text("Press ENTER to restart.", width/2, (height/2) + 48);
  pop();
}

function updateInput(){
  if(mouseEnabled){
    var dir = map(mouseX, 0, width, -1.35, 1.35);
    if(abs(dir) > 0.1){
      for(var bl of bumperLayers){
        bl.move(BUMPER_SPEED * gameSpeed, dir);
      }
    }
  }
  else{
    if(keyIsDown(RIGHT_ARROW)){
      for(var bl of bumperLayers){
        bl.move(BUMPER_SPEED * gameSpeed, -1);
      }
    }
    else if(keyIsDown(LEFT_ARROW)){
      for(var bl of bumperLayers){
        bl.move(BUMPER_SPEED * gameSpeed, 1);
      }
    }
  }
}

class Player {

  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show(){
    push();
    stroke(255);
    ellipse(this.x, this.y, this.size);
    pop();
  }

}

class BumperLayer {

  constructor(gapwidth){
    this.bumpers = [];
    this.cull = false;

    var gappos = random(0, width - gapwidth);

    var leftlen = gappos + (width * BUMPER_OVERHANG);
    this.bumpers.push(new Bumper(leftlen, 0));

    var rightoffset = leftlen + gapwidth;
    var rightlen = (width - gappos) + (width * BUMPER_OVERHANG);
    this.bumpers.push(new Bumper(rightlen, rightoffset));
  }

  show(){
    for(var bumper of this.bumpers){
      bumper.show();
    }
  }

  update(){
    for(var bumper of this.bumpers){
      bumper.update();
      if(bumper.checkCollisions()){
        gameOver = true;
      }
      if(bumper.cull){
        this.cull = true;
      }
    }
  }

  move(spd, dir){
    if(dir < 0 && this.bumpers[0].x2 >= 0){
      this.bumpers[0].move(spd * dir);
      this.bumpers[1].move(spd * dir);
    }
    else if(dir > 0 && this.bumpers[1].x1 <= width){
      this.bumpers[0].move(spd * dir);
      this.bumpers[1].move(spd * dir);
    }
  }

}

class Bumper {

  constructor(length, offset){
    this.y = 0;
    var leftbuffer = width * BUMPER_OVERHANG;
    this.x1 = offset - leftbuffer;
    this.x2 = offset + length - leftbuffer;
    this.cull = false;
  }

  show(){
    push();
    colorMode(HSB);
    stroke(map(this.y, 0, height, 0, 256), 100, 100);
    strokeWeight(6);
    line(this.x1, this.y, this.x2, this.y);
    pop();
  }

  update(){
    this.y += fallSpeed * gameSpeed;
    if(this.y > height){
      this.cull = true;
    }
  }

  move(x){
    this.x1 += x;
    this.x2 += x;
  }

  checkCollisions(){
    let offset = ply.size / 2;
    if(ply.x + offset >= this.x1 &&
       ply.x - offset <= this.x2 &&
       this.y <= ply.y + offset &&
       this.y >= ply.y - offset){
         return true;
    }
    else{
      return false;
    }
  }

}
