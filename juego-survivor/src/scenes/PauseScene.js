import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }

  create() {
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5)
      .setOrigin(0);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 40, "PAUSADO", {
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        "Presiona P para continuar",
        {
          fontSize: "22px",
          color: "#dddddd",
        },
      )
      .setOrigin(0.5);

    // reanudar con P o clic
    this.input.keyboard.once("keydown-P", () => this.resumeGame());
    this.input.once("pointerdown", () => this.resumeGame());
  }

  resumeGame() {
    this.scene.stop("pause");
    this.scene.resume("game");
  }
}
