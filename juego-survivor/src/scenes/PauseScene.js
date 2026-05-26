import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // fondo semitransparente
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6)
      .setOrigin(0);

    // título
    this.add
      .text(cx, cy - 100, "PAUSADO", {
        fontSize: "48px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // botón reanudar
    this.createButton(cx, cy, "▶  REANUDAR", "#44ff88", () => {
      this.resumeGame();
    });

    // botón menú principal
    this.createButton(cx, cy + 70, "🏠  MENÚ PRINCIPAL", "#ff4444", () => {
      this.scene.stop("pause");
      this.scene.stop("game");
      this.scene.start("menu");
    });

    // tecla P para reanudar
    this.input.keyboard.once("keydown-P", () => this.resumeGame());
  }

  createButton(x, y, label, color, onClick) {
    const btn = this.add
      .text(x, y, label, {
        fontSize: "26px",
        color,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setScale(1.1));
    btn.on("pointerout", () => btn.setScale(1.0));
    btn.on("pointerdown", onClick);

    return btn;
  }

  resumeGame() {
    this.scene.stop("pause");
    this.scene.resume("game");
  }
}
