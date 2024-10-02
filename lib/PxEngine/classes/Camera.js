
/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Camera class (Camera.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class Camera {

    /**
     * Camera class
     * @param {number} _X Position
     * @param {number} _Y Position
     * @param {number} _ScreenW Screen size
     * @param {number} _ScreenH Screen size
     */
    constructor (
        _X = 0,
        _Y = 0,
        _ScreenW = 800,
        _ScreenH = 600
    ) {
        this._X = _X;
        this._Y = _Y;
        this._ScreenW = _ScreenW;
        this._ScreenH = _ScreenH;
    }

}
