/**
 * Created by andy on 13/04/15.
 */

var gameOfLife;
var playing = false;
var timer;
var mDown = false;

/* element event listener */
document.getElementById("create-grid").addEventListener("click", create, false);
document.getElementById("grid-step").addEventListener("click", step, false);
document.getElementById("play").addEventListener("click", playPause, false);
document.getElementById("speed").addEventListener("input", updatePlayInterval, false);
document.getElementById("massacre").addEventListener("click", massacre, false);
document.getElementById("genesis").addEventListener("click", genesis, false);

/* document event listeners */
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);

/* call create() when the page loads */
create();

function create() {
    var width = parseInt(document.getElementById('grid-dimension').value);
    var height = parseInt(document.getElementById('grid-dimension').value);
    gameOfLife = new GameOfLife(width, height);
    makeTable();
}

/**
 * Create a table where each table cell represents a cell in the GameOfLife
 */
function makeTable() {
    var table = document.getElementById('grid-table');
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    var cells = gameOfLife.grid.cells;
    for (var i = 0; i < gameOfLife.grid.height; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < gameOfLife.grid.width; j++) {
            var cellContainer = document.createElement('td');
            var cell = document.createElement('div');
            cell.className = "cell-";
            cell.className += cells[gameOfLife.grid.getIndex(i, j)].alive == false ? "dead" : "alive";
            cell.id = "" + gameOfLife.grid.getIndex(i, j);
            cellContainer.appendChild(cell);
            row.appendChild(cellContainer);
            cellContainer.onclick = toggleCellEvt;
            cellContainer.onmouseover = mouseOverCell;
        }
        table.appendChild(row);
    }
}

/**
 * Update the cells in the table to reflect those in the GameOfLife object
 */
function updateTable() {
    var table = document.getElementById('grid-table');

    [].forEach.call(table.rows, function (row, i) {
        [].forEach.call(row.cells, function (cell, j) {
            cell.getElementsByTagName("div")[0].className = "cell-";
            cell.getElementsByTagName("div")[0].className += gameOfLife.grid.cells[gameOfLife.grid.getIndex(i, j)].alive ? "alive" : "dead";
        });
    });
}

/**
 * get the next generation of cells from GameOfLife and update the UI
 */
function step() {
    gameOfLife.step();
    updateTable();
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
        document.getElementById("play").innerHTML = "&#9616;&#9616;";
    }
    else {
        clearTimeout(timer);
        playing = false;
        document.getElementById("play").innerHTML = "&#9658;";
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
 * Toggle a cell's status when the user clicks it
 * @param event the mouse event
 */
function toggleCellEvt(event) {
    "use strict";
    event = event || window.event;
    var cell = event.currentTarget.childNodes[0];
    var id = cell.id;
    gameOfLife.grid.cells[parseInt(id)].toggle();
    cell.className = "cell-";
    cell.className += gameOfLife.grid.cells[parseInt(id)].alive ? "alive" : "dead";
}

/**
 * kill all cells and update the UI
 */
function massacre() {
    "use strict";
    gameOfLife.massacre();
    updateTable();
}

/**
 * bring all cells to life and update the UI
 */
function genesis() {
    "use strict";
    gameOfLife.genesis();
    updateTable();
}

/**
 * call toggleCellEvt while mouse is down and is dragged over the table
 * @param event
 */
function mouseOverCell(event) {
    "use strict";
    if (mDown) {
        toggleCellEvt(event);
        document.getElementById("grid-table").style.cursor = "default";
    }
}

function mouseDown() {
    mDown = true;
}

function mouseUp() {
    mDown = false;
    document.getElementById("grid-table").style.cursor = "default";
}