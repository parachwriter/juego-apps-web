import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
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

    // PLAYER — frames individuales
    this.load.image("player_idle",    "/assets/Character/adventurer_idle.png");
    this.load.image("player_walk1",   "/assets/Character/adventurer_walk1.png");
    this.load.image("player_walk2",   "/assets/Character/adventurer_walk2.png");
    this.load.image("player_hurt",    "/assets/Character/adventurer_hurt.png");
    this.load.image("player_stand",   "/assets/Character/adventurer_stand.png");
    this.load.image("player_action1", "/assets/Character/adventurer_action1.png");
    this.load.image("player_action2", "/assets/Character/adventurer_action2.png");

    // ZOMBIE — frames individuales
    this.load.image("zombie_idle",   "/assets/zombie/zombie_idle.png");
    this.load.image("zombie_walk1",  "/assets/zombie/zombie_walk1.png");
    this.load.image("zombie_walk2",  "/assets/zombie/zombie_walk2.png");
    this.load.image("zombie_hurt",   "/assets/zombie/zombie_hurt.png");
    this.load.image("zombie_action1","/assets/zombie/zombie_action1.png");
    this.load.image("zombie_action2","/assets/zombie/zombie_action2.png");

    // TILESET
 // WORLD TILES
    this.load.image("tile_0048", "/assets/world/tile_0048.png");
    this.load.image("tile_0049", "/assets/world/tile_0049.png");
    this.load.image("tile_0050", "/assets/world/tile_0050.png");
    this.load.image("tile_0051", "/assets/world/tile_0051.png");
    this.load.image("tile_0052", "/assets/world/tile_0052.png");
    this.load.image("tile_0053", "/assets/world/tile_0053.png");

    // BULLET
    this.load.image("bullet", "/assets/Character/bullet.png");

    // AUDIO
    this.load.audio("bgm", "/assets/sound/bgm.mp3");
this.load.audio("sfx_hit", "/assets/sound/sfx_hit.mp3");
this.load.audio("sfx_pickup", "/assets/sound/sfx_pickup.mp3");
this.load.audio("sfx_shoot", "/assets/sound/sfx_shoot.mp3");

    this.load.on("complete", () => {
      if (this.loadingText) this.loadingText.destroy();
      console.log("ASSETS CARGADOS");
    });
  }

  create() {
    this.scene.start("menu");
  }
}
