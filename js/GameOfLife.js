/**
 * Created by andy on 13/04/15.
 */

function GameOfLife(width, height) {
    this.grid = new Grid(width, height);
}

/**
 * Move to the next generation
 */
GameOfLife.prototype.step = function() {
    this.grid.stepGrid();
};

/**
 * Kill all cells
 */
GameOfLife.prototype.massacre = function () {
    "use strict";
    this.grid.cells.forEach(function(cell) {cell.kill();});
};

/**
 * Bring all cells to life
 */
GameOfLife.prototype.genesis = function () {
    "use strict";
    this.grid.cells.forEach(function(cell) {cell.create();});
};