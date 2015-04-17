/**
 * Created by andy on 13/04/15.
 */
function Cell(alive) {
    this.alive = alive;
}

Cell.prototype.kill = function () {
    this.alive = false;
};

Cell.prototype.create = function () {
    this.alive = true;
};

Cell.prototype.toggle = function() {
    "use strict";
    this.alive = !this.alive;
};