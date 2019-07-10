let PXL_RES = 64;
let BFR_MULT = 1.4022; //4022

let pixels = []

let val = 0;
let degs = 0;
let rotSpeed = 2;
let curVal = 0.098;

function setup() {
  p5.disableFriendlyErrors = true;

  frameRate(30);

  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  let pwidth = int(width/PXL_RES);
  let pheight = int(height/PXL_RES);

  for(let i = -pwidth*BFR_MULT; i < pwidth*BFR_MULT; i++){
    for(let j = -pheight*BFR_MULT; j < pheight*BFR_MULT; j++){
      pixels.push(new pxl(i*PXL_RES, j*PXL_RES));
    }
  }

  angleMode(DEGREES);
  colorMode(HSB, 360);
}

function draw() {
  translate(width/2, height/2);
  rotate(90);
  for (row of pixels){
    row.show(map(sin(val), -1, 1, 0, 360));
    val += curVal;
  }

  if( keyIsDown(UP_ARROW) ){ curVal += 0.0001; }
  if( keyIsDown(DOWN_ARROW) ){ curVal -= 0.0001; }
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
}

class pxl {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  show(col){
    fill(col, 210, 260);
    stroke(col, 210, 260);
    rect(this.x, this.y, PXL_RES, PXL_RES);


  }
}
