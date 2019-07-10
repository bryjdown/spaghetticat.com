let rainbows = [];

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  background(0);
  rainbows[0] = new rainbow(width/2, height/2);
}

function draw() {
  background(0, 0, 0);
  for(i = 0; i < rainbows.length; i++){
		rainbows[i].show();
	}
}

function mouseDragged() {
	rainbows.push(new rainbow(mouseX, mouseY));
}

class rainbow {

  constructor(x, y){
    this.x = x;
    this.y = y;
		this.height = 1;
		this.h = 0;
  }

  show(){
		noStroke();
		colorMode(HSB, 100);
		if(this.h > 100){
			this.h = 0;
		}
		this.h++;
		this.height++;
		fill(this.h, 100, 100);
    rect(this.x, this.y, 20, this.height);
  }
}
