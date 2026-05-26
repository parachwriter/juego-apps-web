import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("gameover");
  }

  create(data) {
    const score = data && data.score ? data.score : 0;

    this.cameras.main.setBackgroundColor("#000000");

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 40, "GAME OVER", {
        fontSize: "48px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 10,
        `Score: ${score}`,
        {
          fontSize: "32px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 70,
        "Presiona SPACE para reiniciar",
        {
          fontSize: "20px",
          color: "#aaaaaa",
        },
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("menu");
    });

    this.input.once("pointerdown", () => {
      this.scene.start("menu");
    });
  }
}
