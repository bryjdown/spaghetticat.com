const CELL_SIZE = 32;
const MIN_COST = 1;
const MAX_COST = 100;

let mainGrid;
let frontier;
let start;
let goal;
let visited;

let searchFinished = false;
let beginSearch = false;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  background(0);

  buildMatrix();
}

function draw() {
  background(0);
  mainGrid.show();

  push();
  stroke(255);
  strokeWeight(7);
  textAlign(CENTER);
  text("Click and drag to create obstacles. Press SPACE to start/stop pathfinding. Press R to reset.", width/2, 20);
  pop();

  if(beginSearch == true && !searchFinished){
    search();
  }
}

function keyPressed(){
  if(keyCode == 32){
    beginSearch = !beginSearch;
  }
  if(keyCode == 82){
    buildMatrix();
  }
}

function mouseDragged(){
  //Approximate the cell being moused over.
  let x = floor(mouseX / CELL_SIZE);
  let y = floor(mouseY / CELL_SIZE);
  let index = x + (y * mainGrid.width);
  mainGrid.cells[index].enabled = false;
  mainGrid.cells[index].color = color(0, 0, 0);
}

function buildMatrix(){
  mainGrid = new Matrix();
  //Ensure the starting node is enabled.
  start = mainGrid.cells[0];
  start.enabled = true;
  start.color = color(200, 255, 200);
  //Ensure the goal node is enabled.
  goal = mainGrid.cells[mainGrid.width * mainGrid.height - 1];
  goal.enabled = true;
  goal.color = color(255, 200, 200);
  //Frontier contains the nodes to-be-evaluated, with the lowest-cost nodes first.
  frontier = new PriorityQueue((a, b) => a[1] > b[1]);
  frontier.push([start, 0]);
  visited = [];
  visited[0] = true;
  beginSearch = false;
  searchFinished = false;
}

function search(){
  current = frontier.pop()[0];
  current.color = color(255, 0, 0);

  if(current == goal){
    current.color = color(0, 0, 255);
    current.show();
    searchFinished = true;
    return;
  }

  for(let neighbor of current.neighbors){
    //Grab the actual neighbor cell based on its index.
    let next = mainGrid.cells[neighbor];
    if(visited[neighbor] != true && next.enabled){
      //Add each unvisited neighbor to the priority queue.
      frontier.push([next, heuristic(next, goal)]);
      visited[neighbor] = true;
      next.color = color(0, 255, 0);
    }
  }

  if(frontier.isEmpty()){
    searchFinished = true;
    return;
  }
}

function heuristic(a, b){
  return -(abs(a.x - b.x) + abs(a.y - b.y)) - a.cost;
}

class Cell{
  constructor(x, y, index){
    this.x = x;
    this.y = y;
    this.index = index;
    this.cost = floor(random(MIN_COST, MAX_COST));
    //Color the node based on its cost. Nodes with cost > 80 are obstacles.
    this.color = this.cost > 80 ? 0 : map(this.cost, MIN_COST, MAX_COST, 255, 100);
    this.enabled = this.cost > 80 ? false : true;
    this.neighbors = [];
  }

  show(){
    push();
    strokeWeight(1);
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, CELL_SIZE, CELL_SIZE);
    pop();
  }
}

class Matrix{
  constructor(){
    this.cells = [];

    this.width = floor(width / CELL_SIZE);
    this.height = floor(height / CELL_SIZE);

    let cellCount = 0;
    //Some weirdness here to orient the cell indices correctly left-to-right.
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        this.cells.push(new Cell(j*CELL_SIZE, i*CELL_SIZE, cellCount));
        cellCount++;
      }
    }

    this.buildNeighbors();
  }

  show(){
    for(let cell of this.cells){
      cell.show();
    }
  }

  buildNeighbors(){
    let cellCount = 0;
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.cells[cellCount].neighbors = [];

        let curCol = cellCount % this.width;
        //Attempt to add the left neighbor.
        if(curCol > 0){
          this.cells[cellCount].neighbors.push(cellCount - 1);
        }
        //Attempt to add the right neighbor.
        if(curCol < this.width - 1){
          this.cells[cellCount].neighbors.push(cellCount + 1);
        }
        //Attempt to add the top neighbor.
        if(cellCount - this.width >= 0){
          this.cells[cellCount].neighbors.push(cellCount - this.width);
        }
        //Attempt to add the bottom neighbor.
        if(cellCount + this.width <= (this.width * this.height) - 1){
          this.cells[cellCount].neighbors.push(cellCount + this.width);
        }
        cellCount++;
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                      Priority Queue implementation created by vaxquis.                               //
// https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const top_a = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top_a];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top_a) {
      this._swap(top_a, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top_a] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top_a && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top_a;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}