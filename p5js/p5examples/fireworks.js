const GRAVITY = 0.4;
const FIREWORKS_PER_CLICK = 10;
const NUM_PARTICLES = 10;

let fireworks = [];
let particles = [];

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  colorMode(HSB);
  background(0);

  for(let i = 0; i < FIREWORKS_PER_CLICK; i++){
    fireworks.push(new Firework());
  }
}

function draw() {
  background(0, 0, 0, 0.2);

  for(let firework of fireworks){
    firework.update();
    firework.show();
  }

  for(let particle of particles){
    particle.update();
    particle.show();
  }

  for(let i = 0; i < fireworks.length; i++){
    if(fireworks[i].explode){
      for(let j = 0; j < NUM_PARTICLES; j++){
        particles.push(new Particle(fireworks[i]));
      }
      fireworks.splice(i, 1);
    }
  }

  for(let i = 0; i < particles.length; i++){
    if(particles[i].cull){
      particles.splice(i, 1);
    }
  }
}

class Firework{
  constructor(){
    this.x = width/2;
    this.y = height;
    this.speed = random(15, 28);
    this.drift = random(-5, 5);
    this.pcolor = random(360);
    this.pspeed = random(2, 6);
    this.terminalv = random(-10, 0);
    this.explode = false;
  }

  update(){
    this.x += this.drift;
    this.y -= this.speed;
    this.speed -= GRAVITY;
    if(this.speed < this.terminalv){
      this.explode = true;
    }
  }

  show(){
    push();
    stroke(255);
    fill(255);
    ellipse(this.x, this.y, 5, 5);
    pop();
  }
}

class Particle{
  constructor(parent){
    this.x = parent.x;
    this.y = parent.y;
    this.velocity = createVector(random(-5, 5), random(-5, 5)).normalize();
    this.vmult = parent.pspeed;
    this.color = parent.pcolor;
    this.lifetime = random(10, 30);
    this.timealive = 0;
    this.cull = false;
  }

  update(){
    this.x += this.velocity.x * this.vmult;
    this.y += this.velocity.y * this.vmult;
    this.timealive++;
    if(this.timealive >= this.lifetime){
      this.cull = true;
    }
  }

  show(){
    push();
    colorMode(HSB);
    stroke(this.color, 100, 100);
    fill(this.color, 100, 100);
    ellipse(this.x, this.y, 3, 3);
    pop();
  }
}

function mousePressed(){
  for(let i = 0; i < FIREWORKS_PER_CLICK; i++){
    fireworks.push(new Firework());
  }
}