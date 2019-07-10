let part;
let pressed = false;
let attractors = [];
let repulsors = [];
let currentForceNodes = 0;
let displayHelpText = true;
let mouseAttractEnabled = false;
let mouseRepelEnabled = false;

let NUM_PARTICLES = 255;
let MAX_SPEED = 5;
let MIN_ACC_MULT = 0.000005; 
let MAX_ACC_MULT = 0.0005; 
let DRAG_COEFF = 0.99;
let MAX_FORCE_NODES = 12;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  colorMode(HSB);

  background(0);
  part = new ParticleSystem(width/2, height/2);
  for(let i = 0; i < NUM_PARTICLES; i++){
    part.add();
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  for(let attractor of attractors){
    attractor.show();
  }
  for(let repulsor of repulsors){
    repulsor.show();
  }
  part.update();
  part.show();
  if(displayHelpText){
    push();
    textSize(14);
    fill(255);
    stroke(0);
    text("Click to spawn an attractor. Shift-click to spawn a repulsor.", 20, 20);
    text("Press SPACE to clear attractors and repulsors.", 20, 40);
    text("Press A or R to toggle attracting or repelling with the mouse.", 20, 60);
    text("Press H to hide this text.", 20, 80);
    pop();
  }
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
   background(0);
}

function mousePressed(){
  if(currentForceNodes < MAX_FORCE_NODES){
    if(keyIsDown(SHIFT)){
      repulsors.push(new ForceNode(mouseX, mouseY, 15, true));
    }
    else{
      attractors.push(new ForceNode(mouseX, mouseY, 15, false));
    }
    currentForceNodes++;
  }
}

function keyPressed(){
  if(keyCode == 32){
    repulsors = [];
    attractors = [];
  }
  if(keyCode == 72){
    displayHelpText = false;
  }
  if(keyCode == 65){
    mouseAttractEnabled = !mouseAttractEnabled;
    mouseRepelEnabled = false;
  }
  if(keyCode == 82){
    mouseRepelEnabled = !mouseRepelEnabled;
    mouseAttractEnabled = false;
  }
}

class ParticleSystem {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.particles = [];
  }

  add(){
    var xo = random(-width / 2, width / 2);
    var yo = random(-height / 2, height / 2);
    this.particles.push(new Particle(this.pos.x + xo, this.pos.y + yo));
  }

  update(){
    let mpos = createVector(mouseX, mouseY);
     if(mouseAttractEnabled){
       this.moveTowards(mpos);
     }
     else if(mouseRepelEnabled){
       this.moveAway(mpos);
     }
    for(let attractor of attractors){
      var apos = createVector(attractor.x, attractor.y);
      this.moveTowards(apos);
    }
    for(let repulsor of repulsors){
      var rpos = createVector(repulsor.x, repulsor.y);
      this.moveAway(rpos);
    }
    for(let particle of this.particles){
      particle.update();
    }
  }

  show(){
    for(var particle of this.particles){
      particle.show();
    }
  }

  moveTowards(target){
    for(var particle of this.particles){
      particle.moveTowards(target);
    }
  }

  moveAway(target){
    for(var particle of this.particles){
      particle.moveAway(target);
    }
  }
}

class Particle {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(DRAG_COEFF);
    this.vel.mult(DRAG_COEFF);

    this.acc.limit(MAX_SPEED);
    this.vel.limit(MAX_SPEED);
  }

  show(){
    push();
    var col = map(this.vel.mag(), 0, MAX_SPEED, 0, 360, true);

    stroke(col, 100, 100);
    fill(col, 100, 100);
    ellipse(this.pos.x, this.pos.y, 3);
    pop();
  }

  moveTowards(target){
    var force = p5.Vector.sub(target, this.pos).normalize();

    var multi = map(p5.Vector.dist(this.pos, target), 0, height, MAX_ACC_MULT, MIN_ACC_MULT, true);
    force.mult(multi);
    this.addForce(force);
  }

  moveAway(target){
    var force = p5.Vector.sub(this.pos, target).normalize();

    var multi = map(p5.Vector.dist(this.pos, target), 0, height, MAX_ACC_MULT, MIN_ACC_MULT, true);
    force.mult(multi);
    this.addForce(force);
  }

  addForce(vector){
    this.acc.add(vector);
  }

}

class ForceNode{
  constructor(x, y, r, isrepulsor){
    this.x = x;
    this.y = y;
    this.r = r;
    this.isrepulsor = isrepulsor;
  }

  show(){
    push();
    noFill();
    stroke(this.isrepulsor ? color('lightcoral') : color('springgreen'));
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }
}