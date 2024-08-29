import { Camera } from "./Camera.js";
import { Collider } from "./Collide.js";
import { SpriteConfiguration } from "./SpriteConfiguration.js";

/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Entity class (Entity.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class Entity {

    /**
     * @type {boolean}
     */
    alive = true;
    /**
     * @type {boolean}
     */
    invisible = false;
    /**
     * @type {boolean}
     */
    invincible = false;

    /**
     * @type {object}
     */
    GameRule = {
        Speed: 5,
        InvincibleAfterDamage: 2000
    };

    /**
     * Entity class
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
        _Attack = 1
    ) {
        this._SpriteConfig = _SpriteConfig;
        this._Collide = _Collide;
        this._Camera = _Camera;
        this._PosX = _PosX;
        this._PosY = _PosY;
        this._Health = _Health;
        this._Attack = _Attack;
    }

    /**
     * Inflicts damage on the entity, and kills it if its health is at 0
     * @param {number} _Damage Damage count
     * @returns {boolean}
     */
    Damage(_Damage) {

        if (this.invincible)
            return false;

        this._Health -= _Damage;
        this.alive = (this._Health > 0);
        this.invincible = true;

        setTimeout(() => {
            this.invincible = false;
        }, this.GameRule.InvincibleAfterDamage);

        return true;

    }

    /**
     * Return Position in Game
     * @returns {object}
     */
    GamePosition() {

        return {
            x: this._PosX + this._Camera._X,
            y: this._PosY + this._Camera._Y
        };

    }

    /**
     * Update entity direction
     * @param {"up"|"down"|"left"|"right"|"stay"} _Direction Direction
     * @returns {number}
     */
    Direction(_Direction) {

        switch (_Direction.toLowerCase()) {

            case "down":
                this._PosY += this.GameRule.Speed;
                return 0;

            case "left":
                this._PosX -= this.GameRule.Speed;
                return 1;

            case "right":
                this._PosX += this.GameRule.Speed;
                return 2;

            case "up":
                this._PosY -= this.GameRule.Speed;
                return 3;

            case "stay":
            default:
                break;

        }

        return -1;

    }

    /**
     * Move entity
     * @param {"up"|"down"|"left"|"right"|"stay"} _Direction Direction
     */
    EntityMove(_Direction) {

        let x = this._PosX;
        let y = this._PosY;

        this._SpriteConfig.SetDirection(this.Direction(_Direction));

        if (this._Collide.IsCollide(
            this._PosX + this._Camera._X,
            this._PosY + this._Camera._Y,
            this._SpriteConfig._Width,
            this._SpriteConfig._Height
        )) {
            this._PosX = x;
            this._PosY = y;
        }

        if (!this.invisible)
            this._SpriteConfig.print(this._PosX + this._Camera._X, this._PosY + this._Camera._Y);
        
        if (_Direction.toLowerCase() != "stay")
            this._SpriteConfig.UpdateAnimation();
    }

}
