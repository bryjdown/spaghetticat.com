let C_SIZE = 10;
let FRMS_PER_TICK = 2;

let grid;

let paused = false;
let lastTick = 0;
let gridHeight;
let gridWidth;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');

  grid = new Array(int(width/C_SIZE));

  //These width/height labels may be backwards. Is fairly arbitrary.
  gridWidth = grid.length;
  for(let i = 0; i < gridWidth; i++){
    grid[i] = new Array(int(height/C_SIZE));
  }
  gridHeight = grid[0].length;

  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      grid[i][j] = new cell(i, j);
    }
  }
}

function draw() {
  //Only update cells if enough frames have elapsed and we're unpaused.
  if(lastTick > FRMS_PER_TICK && !paused){
    background(0, 0, 0, 110);
    fill(255);
    text("Hold shift to pause, click and drag to spawn cells.", 25, 25);

    for(let i = 0; i < gridWidth; i++){
      for(let j = 0; j < gridHeight; j++){
        //"Prepare to update" each cell.
        grid[i][j].update();
      }
    }
    //Actually update each cell's state.
    cullCells();
    lastTick = 0;
  }
  lastTick++;

  //Always show each cell. Allows for drawing while paused.
  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      grid[i][j].show();
    }
  }

  if( keyIsDown(SHIFT) ){ paused = true; }
  else{ paused = false; }
}

//Maintains all-black background. Grid will not scale.
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function mouseDragged(){
  let gx = int(mouseX / C_SIZE);
  let gy = int(mouseY / C_SIZE);

  grid[gx][gy].alive = true;
}

//Adjacent vertices are:
// x-1, y+1 | x, y+1 | x+1, y+1
// x-1, y   | x, y   | x+1, y
// x-1, y-1 | x, y-1 | x+1, y-1

function countAdj(x, y) {
  let count = 0;
  for(let i = -1; i <= 1; i++){
    for(let j = -1; j <= 1; j++){
      //Do not count yourself as a neighbor.
      if(!(i == 0 && j == 0)){
        //Parenthetical logic is just for wrap-around.
        let col = (x + gridWidth + i) % gridWidth;
        let row = (y + gridHeight + j) % gridHeight;
        count += grid[col][row].alive;
      }

    }
  }
  return count;
}

//"Updates" all cells, e.g. kills all which should die, adds all new cells.
//This is necessary to "concurrently update" all cells.
function cullCells(){
  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      //In theory, alive and cull are mutually exclusive.
      if(grid[i][j].cull){
        grid[i][j].alive = false;
      }
      if(grid[i][j].spawn){
        grid[i][j].alive = true;
      }
    }
  }
}

class cell{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.alive = true;
    this.cull = false;
    this.spawn = false;

    this.colorr = 255;
    this.colorg = 255;
    this.colorb = 255;
  }

  show(){
    //Only draw live cells.
    if(this.alive){
      fill(this.colorr, this.colorg, this.colorb);
      rect(this.x*C_SIZE, this.y*C_SIZE, C_SIZE, C_SIZE);
    }
  }

  update(){
    //Might not be necessary.
    this.spawn = false;
    this.cull = false;

    let count = countAdj(this.x, this.y);
    //Less than 2 neighbors = death.
    if(count < 2 && this.alive){
      this.cull = true;
    }
    //More than 3 neighbors = death.
    if(count > 3 && this.alive){
      this.cull = true;
    }
    //Exactly 3 neighbors = new cell!
    if(count == 3 && !this.alive){
      this.spawn = true;
    }

    //Color randomizer!
    if(keyIsDown(RETURN)){
      this.colorr = 0;
      this.colorg = 0;
      this.colorb = 0;
      switch(int(random(3))){
        case 0: this.colorr = 255;
                break;
        case 1: this.colorg = 255;
                break;
        case 2: this.colorb = 255;
                break;
      }
    }
  }
}
