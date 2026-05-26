import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
    // PLAYER
    this.load.spritesheet("player", "/assets/Character/player.png", {
      frameWidth: 80,
      frameHeight: 110,
    });

    // ZOMBIES
    this.load.spritesheet("zombie", "/assets/zombie/fat_zombie.png", {
      frameWidth: 192,
      frameHeight: 88,
    });

    // TILESET DEL MUNDO
    this.load.image("tiles", "/assets/world/tilemap.png");

    // BULLET
    this.load.image("bullet", "/assets/Character/bullet.png");

    this.load.on("complete", () => {
      console.log("ASSETS CARGADOS");
    });
  }

  create() {
    this.scene.start("menu");
  }
}
