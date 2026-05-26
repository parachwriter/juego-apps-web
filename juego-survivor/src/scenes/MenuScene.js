import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    // =========================
    // FONDO
    // =========================

    this.cameras.main.setBackgroundColor("#111111");

    // =========================
    // TÍTULO
    // =========================

    this.add
      .text(this.scale.width / 2, 180, "ZOMBIE SURVIVOR", {
        fontSize: "64px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // =========================
    // SUBTÍTULO
    // =========================

    this.add
      .text(this.scale.width / 2, 280, "Presiona SPACE para iniciar", {
        fontSize: "28px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    // =========================
    // CONTROLES
    // =========================

    this.add
      .text(
        this.scale.width / 2,
        380,
        [
          "WASD → Mover",
          "Mouse → Apuntar",
          "Click Izquierdo → Disparar",
          "SPACE → Melee",
        ],
        {
          fontSize: "22px",
          color: "#dddddd",
          align: "center",
        },
      )
      .setOrigin(0.5);

    // =========================
    // INPUT
    // =========================

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });
  }
}
