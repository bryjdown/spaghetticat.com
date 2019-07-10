const GROW_SPD = 0.002;

let spheres = [];
let xdetail = 16;
let ydetail = 10;

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  cnv.style('display', 'block');
  colorMode(HSB);
  angleMode(DEGREES);
  generateSpheres(9);
}

function generateSpheres(n){
  let sz = 50;
  let bfr = 0;
  let lastbfr = 0;
  let rotation = 1;

  for(let i = 0; i < n; i++){
    if(i == 0){
      spheres.push(new partySphere(sz, 0, 0, 0, 0, true));
    }
    else{
      spheres.push(new partySphere(sz, bfr, rotation, 0, 0, false));
    }

    bfr += 10;
    sz += (20 * i) + 10;
    rotation /= -1.5;

    console.log(sz, " ", bfr);
  }
}

function draw(){
  background(0);
  orbitControl();

  for(ps of spheres){
    ps.update();
    ps.show();
  }
}

function keyPressed(){
  if( keyCode == UP_ARROW && xdetail < 24 ){
    xdetail++;
  }
  else if( keyCode == DOWN_ARROW && xdetail > 2){
    xdetail--;
  }
  if( keyCode == RIGHT_ARROW && ydetail < 24 ){
    ydetail++;
  }
  else if( keyCode == LEFT_ARROW && ydetail > 2){
    ydetail--;
  }

  console.log(xdetail, " ", ydetail);
}

class partySphere{
  constructor(size, range, xRot, yRot, zRot, doFill){
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.medSize = size;
    this.size = size;
    this.range = range;
    this.hue = 0;
    this.sat = 100;
    this.brt = 100;
    this.grow = true;
    this.growSpeed = (GROW_SPD * range) + (GROW_SPD * log(size));
    //Signifies CURRENT rotation.
    this.rotation = [xRot, yRot, zRot];
    //Rotation speed.
    this.xRot = xRot;
    this.yRot = yRot;
    this.zRot = zRot;
    this.doFill = doFill;
  }

  show(){
    push();
    scale(0.5);
    //Rotating x, y, z.
    rotateX(this.rotation[0]);
    rotateY(this.rotation[1]);
    rotateZ(this.rotation[2]);
    if(this.doFill){
      fill(360, 0, 360);
      stroke(360, 0, 360);
    }
    else{
      noFill();
      stroke(this.hue, this.sat, this.brt - (this.range));
    }
    translate(0, 0, 0);
    sphere(this.size, xdetail, ydetail);
    pop();
  }

  update(){
    let upperBound = this.medSize + this.range;
    let lowerBound = this.medSize - this.range;

    //Min size = 0 (red). Max size = 360 (red).
    //NOTE: This "max hue" can be changed to alter the spectrum.
    //      (180 = red -> cyan)
    this.hue = map(this.size, lowerBound, upperBound, 0, 360);
    if(this.grow){ this.size += this.growSpeed; }
    else { this.size -= this.growSpeed; }

    //Min size = start growing. Max size = start shrinking.
    if(this.size <= lowerBound || this.size >= upperBound){
         this.grow = !this.grow;
    }
    //Apply rotation.
    this.rotation[0] += this.xRot;
    this.rotation[1] += this.yRot;
    this.rotation[2] += this.zRot;
    //Preventing integer overflow, rotation should be bounded from (0-360).
    for(let axis of this.rotation){
      axis %= 360;
    }
  }
}
