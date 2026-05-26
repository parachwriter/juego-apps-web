import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    this.cameras.main.setBackgroundColor("#111111");

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // =========================
    // TÍTULO
    // =========================
    this.add
      .text(cx, 100, "ZOMBIE SURVIVOR", {
        fontSize: "64px",
        color: "#ff4444",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 165, "¿Cuánto tiempo puedes sobrevivir?", {
        fontSize: "20px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    // =========================
    // HIGHSCORE
    // =========================
    const highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    this.add
      .text(cx, 210, `Mejor puntuación: ${highScore}`, {
        fontSize: "22px",
        color: "#ffff55",
      })
      .setOrigin(0.5);

    // =========================
    // BOTONES
    // =========================
    this.createButton(cx, 280, "▶  NUEVA PARTIDA", "#44ff88", () => {
      localStorage.removeItem("highScore");
      this.scene.start("game", { startLevel: 1 });
    });

    this.createButton(cx, 345, "🎮  SELECCIONAR NIVEL", "#aaddff", () => {
      this.showLevelSelect();
    });

    this.createButton(cx, 410, "♾️  MODO INFINITO", "#ff88ff", () => {
      this.scene.start("game", { startLevel: 1, infinite: true });
    });

    this.createButton(cx, 475, "🏆  PUNTUACIONES", "#ffdd44", () => {
      this.showScores();
    });

    this.createButton(cx, 540, "❓  CONTROLES", "#dddddd", () => {
      this.showControls();
    });

    // =========================
    // INPUT TECLADO
    // =========================
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game", { startLevel: 1 });
    });

    // =========================
    // OVERLAY (oculto por defecto)
    // =========================
    this.overlay = this.add
      .rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.85)
      .setDepth(20)
      .setVisible(false)
      .setInteractive();

    this.overlayContent = this.add.container(0, 0).setDepth(21);

    this.overlayText = this.add
      .text(cx, cy - 60, "", {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 12,
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setVisible(false);

    this.closeBtn = this.add
      .text(cx, cy + 200, "[ Cerrar ]", {
        fontSize: "22px",
        color: "#ff4444",
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.closeBtn.on("pointerdown", () => this.hideOverlay());
    this.closeBtn.on("pointerover", () => this.closeBtn.setColor("#ff8888"));
    this.closeBtn.on("pointerout", () => this.closeBtn.setColor("#ff4444"));

    // Botones de nivel (ocultos por defecto)
    this.levelButtons = this.createLevelButtons(cx, cy);
  }

  // =========================
  // HELPER: CREAR BOTÓN
  // =========================
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

  // =========================
  // OVERLAY: SELECCIONAR NIVEL
  // =========================
  createLevelButtons(cx, cy) {
    const levelData = [
      {
        level: 1,
        label: "Nivel 1",
        sub: "Objetivo: 200 pts",
        color: "#44ff88",
      },
      {
        level: 2,
        label: "Nivel 2",
        sub: "Objetivo: 250 pts",
        color: "#ffdd44",
      },
      {
        level: 3,
        label: "Nivel 3",
        sub: "Objetivo: 300 pts",
        color: "#ff8844",
      },
      {
        level: 4,
        label: "Nivel 4",
        sub: "Objetivo: 400 pts",
        color: "#ff4444",
      },
    ];

    const buttons = [];

    // Título del overlay de nivel
    const title = this.add
      .text(cx, cy - 150, "🎮  SELECCIONAR NIVEL", {
        fontSize: "28px",
        color: "#aaddff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(22)
      .setVisible(false);

    buttons.push(title);

    levelData.forEach((data, i) => {
      const y = cy - 80 + i * 70;

      const btn = this.add
        .text(cx, y, `${data.label}  —  ${data.sub}`, {
          fontSize: "22px",
          color: data.color,
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(22)
        .setVisible(false)
        .setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setScale(1.08));
      btn.on("pointerout", () => btn.setScale(1.0));
      btn.on("pointerdown", () => {
        this.scene.start("game", { startLevel: data.level });
      });

      buttons.push(btn);
    });

    return buttons;
  }

  showLevelSelect() {
    this.overlay.setVisible(true);
    this.overlayText.setVisible(false);
    this.closeBtn.setVisible(true);
    this.levelButtons.forEach((btn) => btn.setVisible(true));
  }

  // =========================
  // OVERLAY: PUNTUACIONES
  // =========================
  showScores() {
    const highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    const highScoreInf = parseInt(
      localStorage.getItem("highScoreInfinite") || "0",
      10,
    );
    const gamesPlayed = parseInt(
      localStorage.getItem("gamesPlayed") || "0",
      10,
    );

    const lines = [
      "🏆  PUNTUACIONES",
      "",
      `Mejor puntuación (normal):   ${highScore}`,
      `Mejor puntuación (infinito): ${highScoreInf}`,
      `Partidas jugadas:            ${gamesPlayed}`,
    ].join("\n");

    this.levelButtons.forEach((btn) => btn.setVisible(false));
    this.showOverlay(lines);
  }

  // =========================
  // OVERLAY: CONTROLES
  // =========================
  showControls() {
    const lines = [
      "❓  CONTROLES",
      "",
      "WASD          →  Mover",
      "Mouse         →  Apuntar",
      "Click Izq.    →  Disparar",
      "SPACE         →  Ataque melee",
      "P             →  Pausa",
      "",
      "Alcanza el objetivo de puntuación",
      "de cada nivel para avanzar.",
      "¡Llega al nivel 4 y gana!",
    ].join("\n");

    this.levelButtons.forEach((btn) => btn.setVisible(false));
    this.showOverlay(lines);
  }

  showOverlay(text) {
    this.overlayText.setText(text);
    this.overlay.setVisible(true);
    this.overlayText.setVisible(true);
    this.closeBtn.setVisible(true);
  }

  hideOverlay() {
    this.overlay.setVisible(false);
    this.overlayText.setVisible(false);
    this.closeBtn.setVisible(false);
    this.levelButtons.forEach((btn) => btn.setVisible(false));
  }
}
