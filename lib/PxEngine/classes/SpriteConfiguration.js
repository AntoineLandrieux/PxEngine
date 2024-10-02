
/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Sprite Configuration class (SpriteConfiguration.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

export class SpriteConfiguration {

    /**
     * @type {HTMLImageElement}
     */
    _Sprite = new Image();

    /**
     * @type {number}
     */
    animation = 0;
    /**
     * @type {number}
     */
    direction = 0;

    /**
     * Sprite Configuration class
     * @param {string} _Sprite Sprite path
     * @param {number} _NbrAnimation Number of animations
     * @param {number} _NbrDirection Number of direction
     * @param {number} _Width Width
     * @param {number} _Height Height
     */
    constructor(
        _Sprite,
        _Context,
        _NbrAnimation,
        _NbrDirection,
        _Width,
        _Height
    ) {
        this._Sprite.src = _Sprite;
        this._Context = _Context;
        this._NbrAnimation = _NbrAnimation;
        this._NbrDirection = _NbrDirection;
        this._Width = _Width;
        this._Height = _Height;
    }

    /**
     * Show sprite
     * @param {number} _X Position
     * @param {number} _Y Position
     */
    print(_X, _Y) {

        this._Context.drawImage(
            this._Sprite,
            this.animation * this._Width,
            this.direction * this._Height,
            this._Width,
            this._Height,
            _X,
            _Y,
            this._Width,
            this._Height
        );

    }

    /**
     * Set sprite direction
     * @param {number} _Direction Direction
     * @returns {number}
     */
    SetDirection(_Direction) {

        if (!(_Direction < 0 || _Direction >= this._NbrDirection))
            this.direction = _Direction;
        return this.direction;

    }

    /**
     * Update sprite animation
     * @returns {number}
     */
    UpdateAnimation() {

        this.animation = (this.animation >= (this._NbrAnimation - 1) ? 0 : (this.animation + 1));
        return this.animation;

    }

}
