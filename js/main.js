/**
 * Created by andy on 13/04/15.
 */

var gameOfLife;
var playing = false;
var timer;
var mDown = false;
var currentCell;

/* element event listener */
document.getElementById("create-grid").addEventListener("click", create, false);
document.getElementById("grid-step").addEventListener("click", step, false);
document.getElementById("play").addEventListener("click", playPause, false);
document.getElementById("speed").addEventListener("input", updatePlayInterval, false);
document.getElementById("grid-dimension").addEventListener("input", create, false);
document.getElementById("genocide").addEventListener("click", genocide, false);
document.getElementById("genesis").addEventListener("click", genesis, false);
document.getElementById("grid-canvas").addEventListener("mousemove", gridMouseMoveEvt, false);
document.getElementById("grid-canvas").addEventListener("click", toggleCellEvt, false);

/* document event listeners */
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);

/* window event listeners */
// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

/* call create() when the page loads */
create();

/**
 * initialise Game Of Life and canvas
 */
function create() {
    "use strict";
    var width = parseInt(document.getElementById('grid-dimension').value);
    var height = parseInt(document.getElementById('grid-dimension').value);
    gameOfLife = new GameOfLife(width, height);
    drawCanvas();
    updateDimension();
}

/**
 * cell size = canvas width / GoL grid width
 * e.g. 500 / 20 = 25, each cell is a 25x25px square
 *
 * @return {number} the size in pixels of each cell in the grid
 */
function getCellSize() {
    "use strict";
    var canvas = document.getElementById('grid-canvas');
    return canvas.width / gameOfLife.grid.width;
}

/**
 * draw the game of life grid on to the canvas
 */
function drawCanvas() {
    "use strict";
    initCanvas();
    var canvas = document.getElementById('grid-canvas');
    canvas.style.backgroundColor = '#F5F5F5';
    var context = canvas.getContext('2d');
    // divide the canvas width by the number of cells 100 / 20 = 5px per cell
    var cellWidth = getCellSize();

    for (var row = 0; row < gameOfLife.grid.height; row++)
        for (var column = 0; column < gameOfLife.grid.width; column++) {
            context.fillStyle = gameOfLife.grid.cells[gameOfLife.grid.getIndex(row, column)].alive ? '#B1E1EF' : 'white';
            context.fillRect(row * cellWidth + 0.5, column * cellWidth + 0.5, cellWidth, cellWidth);
        }
}

function updateDimension() {
    "use strict";
    var dimension = gameOfLife.grid.width + '';
    dimension = dimension.length < 2 ? '0' + dimension : dimension;
    document.getElementById('grid-dimension-label').innerHTML = "Dimension (" + dimension + ", " + dimension + "): " + (dimension.length < 3 ? "  " : '');
}

/**
 * set the width of the canvas to its container's
 */
function initCanvas() {
    "use strict";
    var canvas = document.getElementById('grid-canvas');
    // clear the canvas
    canvas.width = canvas.width;
    // set the width to the grid's width
    var dimension = document.getElementById("grid").offsetWidth;
    canvas.width = dimension;
    canvas.height = dimension;
    canvas.style.width = dimension;
    canvas.style.height = dimension;
    canvas.style.cursor = "default";
}

/**
 * when the window's resized, also resize the canvas
 */
function resizeCanvas() {
    "use strict";
    initCanvas();
    drawCanvas();
}

/**
 * get the next generation of cells from GameOfLife and update the UI
 */
function step() {
    "use strict";
    gameOfLife.step();
    drawCanvas();
}

/**
 * toggle between creating a timer to call step() at some interval, and cancelling the interval.
 */
function playPause() {
    "use strict";
    if (!playing) {
        var max = parseInt(document.getElementById("speed").max);
        var min = parseInt(document.getElementById("speed").min);
        // reverse range (so slow end at left, fast end at right)
        // max + min - value
        // 1000 + 10 - 10 = 1000
        // 1000 + 10 - 1000 = 10
        var speed = parseInt(document.getElementById("speed").value);
        speed = max + min - speed;

        timer = setInterval(function () {
            step()
        }, speed);
        playing = true;
        document.getElementById("play").value = "❚❚";
    }
    else {
        clearTimeout(timer);
        playing = false;
        document.getElementById("play").value = "►";
    }
}

/**
 * Update the interval between getting the next generation
 */
function updatePlayInterval() {
    "use strict";
    if (!playing)
        return;
    // stop the timer
    playPause();
    // start the timer with the new value
    playPause();
}

/**
 * get the mouse position relative to the canvas
 * @param event the mous event
 * @return {{x: *, y: *}}
 */
function getMousePos(event) {
    "use strict";
    event = event || window.event;
    var mouseX, mouseY;

    if (event.offsetX) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    }
    else if (event.layerX) {
        mouseX = event.layerX;
        mouseY = event.layerY;
    }
    return {x: mouseX, y: mouseY};
}

/**
 * when the mouse moves over the canvas, if the mouse is also down, toggle the current cell
 * @param event
 */
function gridMouseMoveEvt(event) {
    "use strict";
    event = event || window.event;
    if (mDown)
        toggleCellEvt(event)
}

/**
 * Toggle a cell's status when the user clicks it
 * @param event the mouse event
 */
function toggleCellEvt(event) {
    "use strict";
    event = event || window.event;
    var mousePos = getMousePos(event);
    var x = mousePos.x;
    var y = mousePos.y;
    var column = Math.floor(x / getCellSize());
    var row = Math.floor(y / getCellSize());
    var index = gameOfLife.grid.getIndex(column, row);
    var cell = gameOfLife.grid.cells[index];
    if (currentCell != cell) {
        cell.toggle();
        currentCell = cell;
    }
    drawCanvas();
}

/**
 * kill all cells and update the UI
 */
function genocide() {
    "use strict";
    gameOfLife.massacre();
    drawCanvas();
}

/**
 * bring all cells to life and update the UI
 */
function genesis() {
    "use strict";
    gameOfLife.genesis();
    drawCanvas();
}

function mouseDown() {
    "use strict";
    mDown = true;
}

function mouseUp() {
    "use strict";
    mDown = false;
    currentCell = null;
}