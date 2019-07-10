let gravity = 1.0001;
let balls = [];
let brush_size = 100;
let snow_rate = 0;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  
  snow_rate = map(window.innerWidth, 0, 1920, 0, 3);
  background(0);
  for(i = 0; i < log(window.innerWidth); i++){
    balls.push(new Ball(random(width), -10));
  }
}

function draw() {
  snow_rate = map(window.innerWidth, 0, 1920, 0, 3);

  background(0);

  for(i = 0; i < snow_rate; i++){
    balls.push(new Ball(random(width), -10));
  }

  for(i = 0; i < balls.length; i++){
    balls[i].show();
    balls[i].update();

    if(!balls[i].isUseful || balls[i].y > height){
      balls.splice(i, 1);
    }
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(RIGHT_ARROW)){
    brush_size++;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW)){
    brush_size--;
  }
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
}

class Ball {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.r = random(1, 6);
    this.drift = random(-.35, .35);
    this.speed = map(this.r, 1, 6, 1, 8);
    this.life = 0;
    this.isUseful = true;
    this.color = color(255, 255, 255);
  }

  show(){
    fill(this.color);
    stroke(this.color);
    ellipse(this.x, this.y, this.r);
  }

  update(){
    this.life += 1;

    if(this.life > 300){
      this.isUseful = false;
    }

    let dst = dist(this.x,this.y,mouseX,mouseY);
    let mlt = map(dst, brush_size, 0, 0.8, 0.05);

    if(dst < brush_size){
      this.color = color(255, 255*mlt, 255*mlt);
      this.y += this.speed * mlt;
      this.x += this.drift * mlt;
    }
    else{
      this.color = color(255);
      this.y += this.speed;
      this.x += this.drift;
    }

    this.speed *= gravity;
  }
}
