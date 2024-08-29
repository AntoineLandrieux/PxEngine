import { Camera } from "./../src/PxEngine/classes/Camera.js";
import { Collider } from "./../src/PxEngine/classes/Collide.js";
import { Entity } from "./../src/PxEngine/classes/Entity.js";
import { Player } from "./../src/PxEngine/classes/Player.js";
import { SpriteConfiguration } from "./../src/PxEngine/classes/SpriteConfiguration.js";
import { WorldMap } from "./../src/PxEngine/classes/WorldMap.js";

import { Example } from "./Maps/Example.js";

/**
 * Antoine LANDRIEUX 2024 WTFPL
 * Example Game (main.js)
 * 
 * <https://github.com/AntoineLandrieux/PxEngine>
 */

/**
 * WARNING: Comments will only be in French
 */


/**
 * Nous sélectionnons les audios qui seront utilisés dans le jeu
 */
const audios = {
    // Quand le jeu est terminé
    game_over: new Audio("./resources/sound/game_over.mp3"),
    // Quand le jeu commence
    game_start: new Audio("./resources/sound/game_start.mp3"),
    // Lorsqu'une entité subit des dommages
    hit: new Audio("./resources/sound/hit.mp3"),
    // Le theme principale
    map: new Audio("./resources/sound/map.mp3"),
    // Quand le jeu est sur pause
    pause: new Audio("./resources/sound/pause.mp3")
};

// On définit la taille de notre écran de jeu
const screen = {
    width: 800,
    height: 600
};

// Le context de notre jeu
let context = null;
// La camera du jeu
let PlayerCamera = null;

// Les collisions pour les balles
let CollideBall = null;
// Les collisions pour les murs
let CollideBlock = null;
// Les collisions pour les entités
let CollideEntity = null;

// Définition du joueur
let player = null;
// Définition de la map
let MainMap = null;

// La dernière direction utilisé par le joueur
let last_direction = "down";
// La dernière touche utilisé par le joueur
let last_key = undefined;
// <vrai> si l'utilisateur a mis le jeu en pause
let pause = false;
// <vrai> si le jeu fonctionne
let running = false;

// Nous ajoutons 1 tick toutes les 20 millisecondes
let tick = 0;
// La boucle principale
let loop = null;

// La direction par défaut des IAs
let ai_direction = "left";

// La liste des directions disponibles
const directions = ["left", "right", "up", "down"];

// Nous définissons les paramètres des bots
let BotsSet = [
    [{ x: 600, y: 500 }, "./resources/sprite/enemy0.png"],
    [{ x: 300, y: 900 }, "./resources/sprite/enemy1.png"],
    [{ x: 1000, y: 200 }, "./resources/sprite/enemy2.png"],
    [{ x: 850, y: 600 }, "./resources/sprite/enemy3.png"]
];

// La liste des bots
let bots = [];
// La liste des balles
let balls = [];

/**
 * Efface l'écran
 * @param {string} _Color 
 */
function clear(_Color = "#fff") {

    context.fillStyle = _Color;
    context.fillRect(0, 0, screen.width, screen.height);

}

/**
 * Met le jeu sur pause et retourne <vrai>
 * @returns {boolean}
 */
function Pause() {

    // On coupe la musique de la map
    audios.map.pause();
    audios.pause.play();

    // On efface l'écran
    clear("#000000af");

    // On affiche "PAUSE"
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.font = "30px monospace";
    context.fillText("PAUSE", 10, 10);

    return true;

}

/**
 * Affiche le centre d'informations
 */
function Hub() {

    context.fillStyle = "#000000af";
    context.fillRect(0, 0, screen.width, 50);

    // Affiche la vie du joueur, le nombre de bots en vie et les commandes
    context.fillStyle = "#fff";
    context.textBaseline = "top";
    context.font = "20px monospace";
    context.fillText(`❤️ ${player._Health}  🧙‍♀️ ${EnemyRemaining()}     use [↑][↓][←][→] keys to move and [space] for attack!`, 10, 15);

}

/**
 * Arrêtez le jeu et redirige vers le menu
 */
function GameOver() {

    // On coupe la musique de la map
    audios.map.pause();
    audios.game_over.play();

    // On efface l'écran
    clear("#000000af");

    // On stop le jeu
    running = false;
    clearInterval(loop);

    // On le redémarre au menu
    setTimeout(start, 4500);

}

/**
 * Liste le nombre de bots encore en vie
 * @returns {number}
 */
function EnemyRemaining() {

    // Nous définissons <r>
    let r = 0;

    // Pour chaque bots on regarde si il est en vie
    // Si c'est le cas, on augmente <r> de +1
    bots.forEach(bot => {
        if (bot.alive)
            r++;
    });

    // On retourne <r>
    return r;

}

/**
 * Charge les différents fichiers audios
 */
function mainload() {

    audios.game_over.load();
    audios.game_start.load();
    audios.hit.load();
    audios.map.load();
    audios.pause.load();

    // On répète le theme de la map en boucle
    audios.map.loop = true;

}

/**
 * Affiche le menu
 */
function mainmenu() {

    // On efface l'écran
    clear("#000000af");

    // On charge le logo
    let logo = new Image();
    logo.src = "./resources/misc/logo.png";

    // On affiche le logo
    logo.onload = () => {
        context.drawImage(logo, 75, 200);
    };

}

/**
 * Appel de la fonction toutes les 20 ms
 * @returns {any}
 */
function mainloop() {

    // Si le jeu ne fonctionne pas ou est sur pause : on ne fait rien
    if (pause || !running)
        return;

    // Si le joueur est mort ou qu'il n'y a plus de bots, c'est la fin du jeu
    if (!player.alive || !EnemyRemaining())
        return GameOver();

    // On efface l'écran
    clear("#1ea1ff");

    // On augmente le tick de +1
    tick++;
    // On affiche la map
    MainMap.print();

    // On supprime les anciennes collisions
    CollideBall.clear();
    CollideEntity.clear();
    // On enregistre les collisions du joueur
    CollideEntity.Register(player._PosX, player._PosY, 32.5, 48.5);

    // On définit `last_direction` comme le dernier mouvement du joueur
    last_direction = last_key?.split("Arrow")[1] || last_direction;

    // On déplace et enregistre les collisions des balles
    balls.forEach(ball => {

        CollideBall.Register(ball[0].GamePosition().x, ball[0].GamePosition().y, 20, 20);
        ball[0].EntityMove(ball[1]);

    });

    // On déplace et enregistre les collisions des bots
    bots.forEach(bot => {

        // Si le bot est mort, on ne fait rien
        if (!bot.alive)
            return;

        // Si le bot a touché une balle, il prend des dégats
        if (CollideBall.IsCollide(bot.GamePosition().x, bot.GamePosition().y, 32.5, 48.5))
            if (bot.Damage(balls[0][0]._Attack))
                audios.hit.play();

        // Si le bot a touché le joueur, le joueur prend des dégats
        if (CollideEntity.IsCollide(bot.GamePosition().x, bot.GamePosition().y, 32.5, 48.5))
            if (player.Damage(bot._Attack))
                audios.hit.play();

        // Le bot changera de direction tous les 20 ticks.
        if (!(tick % 20))
            ai_direction = directions[Math.floor(Math.random() * directions.length)]

        // On déplace le bot
        bot.EntityMove(ai_direction);

    });

    // Si le joueur est invincible, alors on le fait clignoté
    if (player.invincible) {
        if (tick % 2)
            player.invisible = !player.invisible;
    } else
        player.invisible = false;

    // On déplace le joueur en fonction des touches appuyées
    player.PlayerMove(last_key?.split("Arrow")[1] || "stay");

    // Si vous appuyez sur espace, vous lancez une balle
    if (last_key == "Space") {

        // On limite a 5 balles dans le jeu
        if (balls.length >= 5)
            balls.shift();

        // On ajoute une balle dans la liste de balles
        balls.push(
            [
                new Entity(
                    new SpriteConfiguration(
                        // Son sprite
                        "./resources/sprite/ball.png",
                        // Le context
                        context,
                        // Nombre d'amination
                        1,
                        // Nombre de direction
                        1,
                        // Largeur
                        20,
                        // Hauteur
                        20,
                    ),
                    // On utilise une collision vide
                    new Collider(),
                    // La camera du jeu
                    PlayerCamera,
                    // La position du joueur
                    player._PosX - PlayerCamera._X,
                    player._PosY - PlayerCamera._Y,
                ),
                // La direction dans laquelle va la balle
                last_direction
            ]
        );
    }

    // Nous réinitialisons last_key
    last_key = undefined;
    // On affiche le hub.
    Hub();

}

function start() {

    // On initialise toutes les valeurs
    bots = [];
    balls = [];
    running = false;
    PlayerCamera = new Camera(0, 0, screen.width, screen.height);
    CollideBall = new Collider();
    CollideBlock = new Collider();
    CollideEntity = new Collider();

    // On créer les bots en fonction de leurs configurations
    for (let i = 0; i in BotsSet; i++) {
        bots.push(
            new Entity(
                new SpriteConfiguration(
                    // Le sprite
                    BotsSet[i][1],
                    // Le contexte
                    context,
                    // Le nombre d'animations
                    4,
                    // Le nombre de directions
                    4,
                    // La Largeur du personnage
                    32.5,
                    // La Hauteur du personnage
                    48.5
                ),
                // Le collisions avec la map
                CollideBlock,
                // La camera
                PlayerCamera,
                // La position
                BotsSet[i][0].x,
                BotsSet[i][0].y
            )
        );
        // On veut pas qu'ils soient invincibles après un dégat
        bots[i].GameRule.InvincibleAfterDamage = 0;
    }

    // Le joueur
    player = new Player(
        new SpriteConfiguration(
            "./resources/sprite/player.png",
            context,
            4,
            4,
            32.5,
            48.5
        ),
        CollideBlock,
        PlayerCamera,
        screen.width / 2,
        screen.height / 2
    );

    // On définit notre map
    MainMap = new WorldMap(
        // Le contexte
        context,
        // Notre map
        Example,
        // La camera
        PlayerCamera,
        // Les collisions
        CollideBlock
    );
    
    // On charge les audios
    mainload();
    // On affiche le menu
    mainmenu();
    // On met en route la boucle du jeu
    loop = setInterval(mainloop, 60);

}

// On charge le jeu une fois le body chargé
document.body.onload = () => {

    // Le jeu (HTML)
    const game = document.getElementById("game");
    // On définit la taille du jeu
    game.width = screen.width;
    game.height = screen.height;

    // Le contexte
    context = game.getContext("2d");
    // On commence ici
    start();

};

// Lorsque vous appuyez sur une touche du clavier
window.onkeydown = (keydown) => {

    // Si c'est la touche "Echap" on met le jeu sur pause
    if (keydown.code == "Escape" && running) {
        if (pause)
            audios.map.play();
        else
            Pause()
        pause = !pause;
        return;
    }

    // On commence le jeu
    if (!running && player.alive) {
        audios.game_start.play();
        audios.map.play();
        running = true;
        return;
    }

    // On enregistre la touche
    last_key = keydown.code;

};
