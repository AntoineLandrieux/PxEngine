
/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Collider class (Collide.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class Collider {

    /**
     * @type {number[][]}
     */
    data = [];

    /**
     * Collider class
     */
    constructor() { }

    /**
     * Clear data
     */
    clear() {
        this.data = [];
    }

    /**
     * Record a new collision
     * @param {number} _X Position
     * @param {number} _Y Position
     * @param {number} _Width Width
     * @param {number} _Height Height
     * @returns {number}
     */
    Register(_X, _Y, _Width, _Height) {
        return this.data.push([_X, _Y, _Width, _Height]);
    }

    /**
     * Check if there is a collision
     * @param {number} _X Position
     * @param {number} _Y Position
     * @param {number} _Width Width
     * @param {number} _Height Height
     * @returns {boolean}
     */
    IsCollide(_X, _Y, _Width, _Height) {
        let collide = false;

        this.data.every(item => {
            let [x, y, w, h] = item;
            if (_X < x + w && _X + _Width > x && _Y < y + h && _Y + _Height > y)
                collide = true;
            return !collide;
        });

        return collide;
    }

}
