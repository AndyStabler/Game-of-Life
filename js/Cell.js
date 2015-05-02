/**
 * Created by andy on 13/04/15.
 */
function Cell(alive) {
    "use strict";
    this.alive = alive;
}

Cell.prototype.kill = function () {
    "use strict";
    this.alive = false;
};

Cell.prototype.create = function () {
    "use strict";
    this.alive = true;
};

Cell.prototype.toggle = function() {
    "use strict";
    this.alive = !this.alive;
};