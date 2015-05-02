/**
 * Created by andy on 13/04/15.
 */

function Grid(width, height) {
    "use strict";
    this.width = width;
    this.height = height;
    this.createCells();
}

/**
 * Initialise the grid
 */
Grid.prototype.createCells = function () {
    "use strict";
    var total = this.width * this.height;
    this.cells = new Array(total);
    for (var i = 0; i < total; i++)
        this.cells[i] = new Cell(Math.random() >= 0.5);
};

/**
 * Left index = width * row + (index - 1) mod width
 *
 * index = 7
 *
 * 4 * 1 + (7 - 1) mod 4
 * 4 + (6 mod 4)
 * 4 + 2
 * 6
 *
 * index = 0
 *
 * 4 * 0 + (0 - 1) mod 4
 * 0 + (-1 mod 4)
 * 0 + 3
 * 3
 *
 * @param index
 * @returns {int} position of left neighbour
 */
Grid.prototype.getLeftNeighbourIndex = function (index) {
    "use strict";
    return this.width * this.getRow(index) + mod(index - 1, this.width);
};


/**
 * Right index = width * row + (index + 1) mod width
 *
 * index = 0
 *
 * 4 * 0 + (0 + 1) mod 4
 * 0 + (1 mod 4)
 * 0 + 1
 * 1
 *
 * index = 15
 *
 * 4 * 3 + (15 + 1) mod 4
 * 12 + (16 mod 4)
 * 12 + 0
 * 12
 *
 * @param index
 * @returns {int} position of right neighbour
 */
Grid.prototype.getRightNeighbourIndex = function (index) {
    "use strict";
    return this.width * this.getRow(index) + mod(index + 1, this.width);
};

/**
 * Up index = (index - width) mod len
 *
 * index = 0
 *
 * (0 - 4) mod 16
 * -4 mod 16
 * 12
 *
 * index = 15
 *
 * (15 - 4) mod 16
 * 11 mod 16
 * 11
 *
 * @param index
 * @returns {int} position of up neighbour
 */
Grid.prototype.getUpNeighbourIndex = function (index) {
    "use strict";
    return mod(index - this.width, this.width * this.height);
};

/**
 * Down index = (index + width) mod len
 *
 * index = 0
 *
 * (0 + 4) mod 16
 * 4 mod 16
 * 4
 *
 * index = 15
 *
 * (15 + 4) mod 16
 * 19 mod 16
 * 3
 *
 * @param index
 * @returns {int} position of down neighbour
 */
Grid.prototype.getDownNeighbourIndex = function (index) {
    "use strict";
    return mod(index + this.width, this.width * this.height);
};

Grid.prototype.getUpLeftNeighbourIndex = function (index) {
    "use strict";
    return this.getUpNeighbourIndex(this.getLeftNeighbourIndex(index));
};

Grid.prototype.getUpRightNeighbourIndex = function (index) {
    "use strict";
    return this.getUpNeighbourIndex(this.getRightNeighbourIndex(index));
};

Grid.prototype.getDownLeftNeighbourIndex = function (index) {
    "use strict";
    return this.getDownNeighbourIndex(this.getLeftNeighbourIndex(index));
};

Grid.prototype.getDownRightNeighbourIndex = function (index) {
    "use strict";
    return this.getDownNeighbourIndex(this.getRightNeighbourIndex(index));
};

/**
 * get all neighbours for a cell at some index
 * @param index the position of the cell to get neighbours for
 * @returns {Cell[]} array of neighbours
 */
Grid.prototype.getNeighbours = function (index) {
    "use strict";
    return [
        this.cells[this.getLeftNeighbourIndex(index)],
        this.cells[this.getUpLeftNeighbourIndex(index)],
        this.cells[this.getUpNeighbourIndex(index)],
        this.cells[this.getUpRightNeighbourIndex(index)],
        this.cells[this.getRightNeighbourIndex(index)],
        this.cells[this.getDownRightNeighbourIndex(index)],
        this.cells[this.getDownNeighbourIndex(index)],
        this.cells[this.getDownLeftNeighbourIndex(index)]
    ];
};

/**
 * x = index % width
 *
 * 11 % 4 = 3
 * 15 % 4 = 3
 *
 * @param index
 * @returns {number}
 */
Grid.prototype.getColumn = function (index) {
    "use strict";
    if (this.width === 0) return -1;
    return mod(index, this.width);
};

/**
 * y = index / width
 *
 * 11 / 4 = 2.75 = 2
 * 15 / 4 = 3.75 = 3
 *
 * @param index
 * @returns {number}
 */
Grid.prototype.getRow = function (index) {
    "use strict";
    if (this.width === 0) return -1;
    return Math.floor(index / this.width);
};

Grid.prototype.getIndex = function (x, y) {
    "use strict";
    return x + (y * this.width);
};

/**
 * Update the Cells array replacing each cell with its stepped version
 *
 */
Grid.prototype.stepGrid = function () {
    "use strict";
    var total = this.width * this.height;
    var newCells = new Array(total);

    for (var i = 0; i < total; i++)
        newCells[i] = this.stepCell(i);
    this.cells = newCells;
};

/**
 * steps a cell to its next state.
 *
 * From Wikipedia:
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * Any live cell with two or three live neighbours lives on to the next generation.
 * Any live cell with more than three live neighbours dies, as if by overcrowding.
 * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * @param index the index to step to the next generation
 * @returns {Cell} the resulting cell
 */
Grid.prototype.stepCell = function (index) {
    "use strict";
    // get the neighbours
    var neighbours = this.getNeighbours(index);
    // get the number of alive neighbours
    var aliveNeighbours = neighbours.filter(function (cell) {
        return cell.alive;
    }).length;

    if (this.cells[index].alive) {
        // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if (aliveNeighbours < 2)
            return new Cell(false);
        // Any live cell with more than three live neighbours dies, as if by overcrowding.
        else if (aliveNeighbours > 3)
            return new Cell(false);
        // Any live cell with two or three live neighbours lives on to the next generation.
        else
            return new Cell(true);
    } else {
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (aliveNeighbours == 3)
            return new Cell(true);
        return new Cell(false);
    }
};

function mod(n, m) {
    "use strict";
    return ((n % m) + m) % m;
}