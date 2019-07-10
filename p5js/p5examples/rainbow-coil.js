let SPH_DIST = 20;
let SPH_SIZE = 4;
let NUM_PLANETS = 24;
let planets = [];

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  cnv.style('display', 'block');
  for(let i = 0; i < NUM_PLANETS; i++){
    //The 300 + i portion of this can be changed for different patterns.
    //ex. 300 + (i % 2) * 50
    //ex. 300 - (i % 5) * 20
    planets.push(new planet(i * SPH_DIST, 0, SPH_SIZE, 250 + i, i));
  }
  frameRate(30);
  colorMode(HSB);
}

function draw(){
  background(0, 0, 0);
  orbitControl();

  for(planet of planets){
    planet.update();
    planet.show();
  }
}

class planet{
  constructor(x, y, size, spd, index){
    this.x = x;
    this.y = y;
    this.z = 0;
    this.size = size;
    this.cDist = x;
    this.oRotation = 0;
    this.framesPerOrbit = spd;
    this.color = map(this.x, 0, NUM_PLANETS*SPH_DIST, 0, 340);
    this.sat = 100;
    this.brt = 100;
    this.index = index;
    this.lines = []
  }

  show(){
    push();
    noFill();
    stroke(this.color, this.sat, this.brt);
    //Drawing the tail of each sphere.
    beginShape();
    for(let ln of this.lines){
      vertex(ln[0], ln[1], 0);
    }
    endShape();
    fill(this.color, this.sat, this.brt);
    translate(this.x, this.y, this.z);
    sphere(this.size);
    pop();
  }

  update(){
    //The center sphere shouldn't move.
    if(this.framesPerOrbit != 0){
      this.x = this.cDist * Math.cos(this.oRotation);
      this.y = this.cDist * Math.sin(this.oRotation);
    }
    else{
      this.x = 0;
      this.y = 0;
    }
    //Rotation is from 0-2pi.
    this.oRotation += (TWO_PI / this.framesPerOrbit);
    this.oRotation %= (TWO_PI);

    if(this.lines.length > 100){
      this.lines.shift();
    }
    //Potential huge memory sink here, however only 2 floats are stored.
    this.lines.push([this.x, this.y]);
  }
}
