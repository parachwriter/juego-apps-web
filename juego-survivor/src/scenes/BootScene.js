import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
    // texto de carga
    this.loadingText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Cargando 0%", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.load.on("progress", (p) => {
      if (this.loadingText)
        this.loadingText.setText(`Cargando ${Math.round(p * 100)}%`);
    });

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

    // AUDIO: cargar variantes para compatibilidad de navegadores
    // Si tus archivos actuales tienen otros nombres/extensiones, añádelos aquí o renómbralos en public/assets/sound/
    this.load.audio("bgm", [
      "/assets/sound/bgm.mp3",
      "/assets/sound/bgm.ogg",
      "/assets/sound/bmg.mp3",
    ]);

    this.load.audio("sfx_hit", [
      "/assets/sound/sfx_hit.mp3",
      "/assets/sound/sfx_hit.ogg",
      "/assets/sound/sfx_hit.wav",
    ]);

    this.load.audio("sfx_pickup", [
      "/assets/sound/sfx_pickup.mp3",
      "/assets/sound/sfx_pickup.ogg",
      "/assets/sound/sfx_pickup.wav",
    ]);

    this.load.on("complete", () => {
      if (this.loadingText) this.loadingText.destroy();
      console.log("ASSETS CARGADOS");
    });
  }

  create() {
    this.scene.start("menu");
  }
}
