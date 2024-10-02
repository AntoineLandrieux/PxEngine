import { Camera } from "./Camera.js";
import { Collider } from "./Collide.js";
import { Entity } from "./Entity.js";
import { SpriteConfiguration } from "./SpriteConfiguration.js";

/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Player class (Player.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class Player extends Entity {

    /**
     * Player class
     * @param {SpriteConfiguration} _SpriteConfig Sprite Configuration
     * @param {Collider} _Collide Collision
     * @param {Camera} _Camera Camera
     * @param {number} _PosX Position
     * @param {number} _PosY Position
     * @param {number} _Health Health
     * @param {number} _Attack Attack
     */
    constructor(
        _SpriteConfig,
        _Collide = null,
        _Camera = null,
        _PosX = 0,
        _PosY = 0,
        _Health = 10,
        _Attack = 5
    ) {
        super(_SpriteConfig, _Collide, _Camera, _PosX, _PosY, _Health, _Attack);
    }

    /**
     * Move player and update camera
     * @param {"up"|"down"|"left"|"right"|"stay"} _Direction Direction
     */
    PlayerMove(_Direction) {

        let x = this._PosX;
        let y = this._PosY;

        this._SpriteConfig.SetDirection(this.Direction(_Direction));

        if (this._Collide.IsCollide(
            this._PosX,
            this._PosY,
            this._SpriteConfig._Width,
            this._SpriteConfig._Height
        )) {
            this._PosX = x;
            this._PosY = y;
        }

        if (!this.invisible)
            this._SpriteConfig.print(this._PosX, this._PosY);

        if (_Direction.toLowerCase() != "stay")
            this._SpriteConfig.UpdateAnimation();

        if (this._PosX != x)
            this._Camera._X += this._PosX > x ? -this.GameRule.Speed : this.GameRule.Speed;

        if (this._PosY != y)
            this._Camera._Y += this._PosY > y ? -this.GameRule.Speed : this.GameRule.Speed;

        this._PosX = x;
        this._PosY = y;

    }

}
