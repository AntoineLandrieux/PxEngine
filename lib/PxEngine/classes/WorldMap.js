import { Camera } from "./Camera.js";
import { Collider } from "./Collide.js";

/**
 * Antoine LANDRIEUX 2024 WTFPL
 * WorldMap class (WorldMap.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class WorldMap {
    
    /**
     * @type {HTMLImageElement}
     */
    tileset = new Image();

    /**
     * WorldMap class
     * @param {CanvasRenderingContext2D} _Context Context
     * @param {object} _Map Map
     * @param {Camera} _Camera Camera
     * @param {Collider} _Collide Collision
     */
    constructor(
        _Context,
        _Map,
        _Camera,
        _Collide
    ) {
        this._Context = _Context;
        this._Map = _Map;
        this._Camera = _Camera;
        this._Collide = _Collide;
        this.tileset.src = _Map.Tileset;
    }

    /**
     * Show the map
     */
    print() {

        this._Collide.clear();

        for (let y = 0; y < this._Map.World.length; y++) {
            for (let x = 0; x < this._Map.World[y].length; x++) {

                if (this._Map.Collide.includes(this._Map.World[y][x])) {
                    this._Collide.Register(
                        x * this._Map.TilesizeW + this._Camera._X,
                        y * this._Map.TilesizeH + this._Camera._Y,
                        this._Map.TilesizeW,
                        this._Map.TilesizeH
                    );
                }

                this._Context.drawImage(
                    this.tileset,
                    (this._Map.World[y][x] - 1) * this._Map.TilesizeW,
                    0,
                    this._Map.TilesizeW,
                    this._Map.TilesizeH,
                    x * this._Map.TilesizeW + this._Camera._X,
                    y * this._Map.TilesizeH + this._Camera._Y,
                    this._Map.TilesizeW,
                    this._Map.TilesizeH
                );

            }
        }

    }

}
