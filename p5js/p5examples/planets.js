let SIZE_MIN = 8;
let SIZE_MAX = 36;

let SPD_MAX = 2500;
let SPD_MIN = 450;

let MAX_PLANETS = 15;

let planets = [];
let to_display = 5;

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  background(0, 0, 0, 255);
  let dir = 1;

  //Spawn all planets at the beginning of the simulation.
  for(i = 0; i < MAX_PLANETS; i++){
      if( random(1) > 0.5 ){
        dir *= -1;
      }
      planets.push(new planet(dir * i * SIZE_MAX*1.5,
                              0,
                              random(SIZE_MIN, SIZE_MAX),
                              random(dir*SPD_MIN, dir*SPD_MAX)));
  }
}

function draw(){
  colorMode(RGB, 255);
  background(0, 0, 0, 140);
  translate(width/2, height/2);
  fill(255);
  ellipse(0, 0, 40);
  for( i = 1; i < planets.length; i++ ){
    if (i <= to_display){
      drawOrbit(i);
      planets[i].update(true);
    }
    else { planets[i].update(false); }
  }
}

function drawOrbit(i){
  colorMode(RGB, 255);
  noFill();
  stroke(255, 255, 255, 255 - (245 / MAX_PLANETS) * i);
  strokeWeight(1);
  ellipse(0, 0, i*SIZE_MAX*3);
}

function keyPressed(){
  if( to_display < 15 ){
    if ( keyCode == UP_ARROW || keyCode == RIGHT_ARROW ){
      to_display++;
    }
  }
  if(to_display > 0){
    if ( keyCode == DOWN_ARROW || keyCode == LEFT_ARROW ){
      to_display--;
    }
  }
}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
}

class planet{
  constructor(x, y, r, rspeed){
    this.x = x;
    this.y = y;
    this.r = r;
    this.rotation = random(0, TWO_PI);
    this.rspeed = rspeed; //How many frames for a full rotation?
    this.color = random(100);
  }
  show(){
    colorMode(HSB, 100);
    noStroke();
    fill(this.color, 15, 100);
    //strokeWeight(this.r/5);
    ellipse(this.x, this.y, this.r);
  }

  update(should_draw){
    this.rotation += TWO_PI / (this.rspeed * map(this.r, 2, 25, 0.6, 1.2));

    rotate(this.rotation);
    if( this.rotation >= TWO_PI ) { this.rotation = 0; }
    if( should_draw ) { planets[i].show(); }
    rotate( -this.rotation );
  }
}
