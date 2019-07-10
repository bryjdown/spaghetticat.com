let MAX_SPLITS = 3;
let NUM_SHRAPNEL = 2;
let MAX_PARTICLE_SPEED = 20;
let MIN_PARTICLE_SPEED = 3;
let FRICTION_MULT = .999;
let GRAVITY_ACCEL = .10;
let PARTICLE_SIZE = 16;

let interfaceIsHidden = false;
let randomizer;
let hider;
let shower;
let particles = [];

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  colorMode(HSB);
  background(0);
  randomizerSetup();
  hiderSetup();
  showerSetup();

  particles.push(new Particle(width/2, height/2, PARTICLE_SIZE, 0));
}

function draw() {
  background(0);

  for (var i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].show();

    if( !particles[i].isUseful ) {
      particles[i].explode();
      particles.splice(i, 1);
    }
  }

  if(interfaceIsHidden){
    shower.draw();
  }
  else{
    showInterface();
  }
}

class Particle {

  constructor(x, y, r, numParents) {
    this.x = x;
    this.y = y;
    this.r = r;
    var bound = MAX_PARTICLE_SPEED;
    this.velocity = createVector(random(-bound, bound), random(-bound, bound));
    this.speed = sqrt( pow(this.velocity.x, 2) + pow(this.velocity.y, 2) );
    this.isUseful = true;
    this.numParents = numParents;

    this.col = random(360);
    this.sat = 100;
    this.curSat = this.sat;
  }

  show() {
    strokeWeight(this.r/2);
    stroke(this.col, this.curSat, 100);
    fill(this.col, this.curSat, 100);
    ellipse(this.x,this.y,this.r,this.r);
  }

  update() {
    this.velocity.x *= FRICTION_MULT;
    this.velocity.y *= FRICTION_MULT;
    this.velocity.y += GRAVITY_ACCEL;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);

    if (this.x <= this.r || this.x >= width - this.r) {
      this.velocity.x *= -0.90;
    }
    if (this.y <= this.r || this.y >= height - this.r) {
      this.velocity.y *= -0.90;
    }

    this.speed = constrain(sqrt( pow(this.velocity.x, 2) + pow(this.velocity.y, 2) ), 0, MAX_PARTICLE_SPEED);

    this.curSat = this.sat * map(this.speed, MIN_PARTICLE_SPEED, MAX_PARTICLE_SPEED, 0, 1.3);

    if (this.speed <= MIN_PARTICLE_SPEED) {
      this.isUseful = false;
    }
  }

  explode() {
    if(this.numParents < MAX_SPLITS){
      //The combined area of resulting shrapnel is equal to the area of the parent.
      let sz = (this.r / 2) * 1.41421;

      for(let i = 0; i < NUM_SHRAPNEL; i++) {
        var shrap = new Particle(this.x, this.y, sz, this.numParents + 1);
        particles.push(shrap);
      }
    }
  }
}

function randomizerSetup(){
  randomizer = new Clickable();
  randomizer.locate(20, 40);
  randomizer.width = 100;
  randomizer.height = 50;
  randomizer.cornerRadius = 3;
  randomizer.text = "Randomize";
  randomizer.textColor = '#ffffff';
  randomizer.color = color('rgba(130, 130, 130, 0.5)');
  randomizer.onPress = function(){
    MAX_PARTICLE_SPEED = random(15, 25);
    MIN_PARTICLE_SPEED = random(0.5, 4);
    FRICTION_MULT = random(.994, .9999);
    GRAVITY_ACCEL = random(-0.2, 0.2);
  };
}

function hiderSetup(){
  hider = new Clickable();
  hider.locate(20, 10);
  hider.width = 100;
  hider.height = 20;
  hider.cornerRadius = 3;
  hider.text = "Hide";
  hider.textColor = '#cccccc';
  hider.color = color('rgba(100, 100, 100, 0.4)');
  hider.onPress = function(){
    interfaceIsHidden = true;
  };
}

function showerSetup(){
  shower = new Clickable();
  shower.locate(20, 10);
  shower.width = 40;
  shower.height = 20;
  shower.text = "+";
  shower.textColor = '#ffffff';
  shower.color = color('rgba(100, 100, 100, 0.4)');
  shower.onPress = function(){
    interfaceIsHidden = false;
  }
}

function showInterface(){
  randomizer.draw();
  hider.draw();

  push();
  fill(255);
  textAlign(LEFT);
  text("Max Speed: " + nf(MAX_PARTICLE_SPEED, 2, 3), 130, 20);
  text("Min Speed: " + nf(MIN_PARTICLE_SPEED, 1, 3), 130, 40);
  text("Friction: " + nf(FRICTION_MULT, 1, 3), 130, 60);
  text("Gravity: " + nf(GRAVITY_ACCEL, 1, 3), 130, 80);
  pop();
}

function mousePressed(){
  var outsideInterface = mouseX > 230 || mouseY > 90;
  var outsideShower = mouseX > 50 || mouseY > 30;

  //Only spawn particles if the cursor is not within an interface.
  if(outsideInterface || (outsideShower && interfaceIsHidden)){
    for(let i = 0; i < 3; i++){
      var nP = new Particle(mouseX, mouseY, PARTICLE_SIZE, 0);
      particles.push(nP);
    }
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}