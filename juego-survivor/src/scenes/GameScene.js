import Phaser from "phaser";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import PowerUp from "../objects/PowerUp";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  // =========================
  // STATS POR NIVEL
  // =========================
  getLevelStats(level) {
    if (this.infinite) {
      const wave = Math.max(1, level);
      return {
        speed: 70 + wave * 15,
        health: 1 + Math.floor(wave * 1.5),
        spawnDelay: Math.max(250, 1600 - wave * 120),
        victoryScore: Infinity,
      };
    }

    const stats = {
      1: { speed: 80, health: 2, spawnDelay: 1500, victoryScore: 200 },
      2: { speed: 110, health: 3, spawnDelay: 1100, victoryScore: 250 },
      3: { speed: 145, health: 5, spawnDelay: 750, victoryScore: 300 },
      4: { speed: 180, health: 8, spawnDelay: 450, victoryScore: 400 },
    };
    return stats[Math.min(level, 4)];
  }

  create() {
    this.cameras.main.setBackgroundColor("#111111");

    // =========================
    // MODO DE JUEGO
    // =========================
    const { startLevel, infinite } = this.scene.settings.data || {};
    this.level = startLevel || 1;
    this.infinite = infinite || false;

    // =========================
    // SUELO CON TILES INDIVIDUALES
    // =========================
    const TILE_SIZE = 16;
    const tiles = [
      "tile_0048",
      "tile_0049",
      "tile_0050",
      "tile_0051",
      "tile_0052",
      "tile_0053",
    ];
    const cols = Math.ceil(this.scale.width / TILE_SIZE) + 1;
    const rows = Math.ceil(this.scale.height / TILE_SIZE) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = Phaser.Utils.Array.GetRandom(tiles);
        this.add
          .image(col * TILE_SIZE, row * TILE_SIZE, key)
          .setOrigin(0)
          .setScrollFactor(0)
          .setDepth(-1);
      }
    }

    this.createAnimations();

    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);
    this.player.play("player_idle");

    // Pausa: tecla P
    this.input.keyboard.on("keydown-P", () => {
      if (!this.scene.isPaused("game")) {
        this.scene.launch("pause");
        this.scene.pause("game");
      } else {
        this.scene.stop("pause");
        this.scene.resume("game");
      }
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.powerUps = this.physics.add.group({
      classType: PowerUp,
      runChildUpdate: false,
    });

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.collectPowerUp,
      null,
      this,
    );

    // puntuación
    this.score = 0;
    this.victory = false;
    const hsKey = this.infinite ? "highScoreInfinite" : "highScore";
    this.highScore = parseInt(localStorage.getItem(hsKey) || "0", 10);
    this.hsKey = hsKey;

    this.audioEnabled = localStorage.getItem("audioEnabled");
    if (this.audioEnabled === null) this.audioEnabled = "true";
    this.audioEnabled = this.audioEnabled === "true";

    // =========================
    // HUD
    // =========================
    this.scoreText = this.add
      .text(16, 16, `Score: ${this.score}`, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setDepth(10);

    this.hudHigh = this.add
      .text(16, 46, `High: ${this.highScore}`, {
        fontSize: "18px",
        color: "#ffff55",
      })
      .setDepth(10);

    this.healthText = this.add
      .text(16, 70, `HP: ${this.player.health}`, {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setDepth(10);

    this.hudLevel = this.add
      .text(
        16,
        96,
        this.infinite ? `Oleada: ${this.level}` : `Level: ${this.level}`,
        {
          fontSize: "18px",
          color: this.infinite ? "#ff88ff" : "#ffffff",
        },
      )
      .setDepth(10);

    // Badge modo infinito
    if (this.infinite) {
      this.add
        .text(this.scale.width / 2, 16, "♾️ MODO INFINITO", {
          fontSize: "18px",
          color: "#ff88ff",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0)
        .setDepth(10);
    }

    // =========================
    // AUDIO
    // =========================
    try {
      this.bgm = this.sound.add("bgm", { loop: true, volume: 0.5 });
      this.sfxHit = this.sound.add("sfx_hit", { volume: 0.7 });
      this.sfxPickup = this.sound.add("sfx_pickup", { volume: 0.8 });
      this.sfxShoot = this.sound.add("sfx_shoot", { volume: 0.5 }); 

      const playBgmIfAllowed = () => {
        try {
          if (this.audioEnabled && this.bgm && !this.bgm.isPlaying)
            this.bgm.play();
        } catch (e) {}
      };

      playBgmIfAllowed();
      this.input.once("pointerdown", playBgmIfAllowed);
      this.input.keyboard.once("keydown", playBgmIfAllowed);
    } catch (e) {}

    // Mute button
    this.muteBtn = this.add
      .text(this.scale.width - 16, 16, this.audioEnabled ? "🔊" : "🔈", {
        fontSize: "24px",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .setDepth(20);
    this.muteBtn.on("pointerdown", () => {
      this.audioEnabled = !this.audioEnabled;
      localStorage.setItem(
        "audioEnabled",
        this.audioEnabled ? "true" : "false",
      );
      if (this.audioEnabled) {
        this.sound.resumeAll();
        if (this.bgm && !this.bgm.isPlaying)
          try {
            this.bgm.play();
          } catch (e) {}
      } else {
        this.sound.pauseAll();
      }
      this.muteBtn.setText(this.audioEnabled ? "🔊" : "🔈");
    });

    // =========================
    // TIMER DE NIVEL
    // solo activo en modo normal
    // =========================
    this.levelTimer = this.time.addEvent({
      delay: 30000,
      callback: () => {
        if (this.infinite) return; // en infinito lo controla addScore
        if (this.level >= 4) return;
        this.level++;
        localStorage.setItem("level", String(this.level));
        this.hudLevel.setText(`Level: ${this.level}`);
        this.applyLevelDifficulty();
      },
      loop: true,
    });

    // Spawn inicial
    const initialStats = this.getLevelStats(this.level);
    this.spawnTimer = this.time.addEvent({
      delay: initialStats.spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.player.bullets,
      this.enemies,
      this.handleBulletEnemy,
      null,
      this,
    );
    this.physics.add.overlap(
      this.player.meleeAttacks,
      this.enemies,
      this.handleMeleeEnemy,
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.handlePlayerEnemy,
      null,
      this,
    );

    this.powerUpTimer = this.time.addEvent({
      delay: 15000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    });

    // Aplicar stats si arrancamos desde un nivel > 1
    if (this.level > 1) this.applyLevelDifficulty();
  }

  update() {
    if (this.player && this.player.active) {
      this.player.update();
      this.healthText.setText(`HP: ${this.player.health}`);
    }
  }

  createAnimations() {
    if (!this.anims.exists("player_idle")) {
      this.anims.create({
        key: "player_idle",
        frames: [{ key: "player_idle" }],
        frameRate: 1,
        repeat: -1,
      });
    }
    if (!this.anims.exists("player_walk")) {
      this.anims.create({
        key: "player_walk",
        frames: [{ key: "player_walk1" }, { key: "player_walk2" }],
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.anims.exists("player_hurt")) {
      this.anims.create({
        key: "player_hurt",
        frames: [{ key: "player_hurt" }],
        frameRate: 1,
        repeat: 0,
      });
    }
    if (!this.anims.exists("player_shoot")) {
      this.anims.create({
        key: "player_shoot",
        frames: [{ key: "player_action1" }, { key: "player_action2" }],
        frameRate: 10,
        repeat: 0,
      });
    }
    if (!this.anims.exists("zombie_idle")) {
      this.anims.create({
        key: "zombie_idle",
        frames: [{ key: "zombie_idle" }],
        frameRate: 1,
        repeat: -1,
      });
    }
    if (!this.anims.exists("zombie_walk")) {
      this.anims.create({
        key: "zombie_walk",
        frames: [{ key: "zombie_walk1" }, { key: "zombie_walk2" }],
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.anims.exists("zombie_hurt")) {
      this.anims.create({
        key: "zombie_hurt",
        frames: [{ key: "zombie_hurt" }],
        frameRate: 1,
        repeat: 0,
      });
    }
  }

  // =========================
  // APLICAR DIFICULTAD
  // =========================
  applyLevelDifficulty() {
    const { speed, health, spawnDelay } = this.getLevelStats(this.level);

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) {
        enemy.speed = speed;
        enemy.health = health;
      }
    });

    this.spawnTimer.remove();
    this.spawnTimer = this.time.addEvent({
      delay: spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    const isMax = !this.infinite && this.level === 4;
    const label = this.infinite
      ? `⚡ OLEADA ${this.level}`
      : isMax
        ? "¡NIVEL MÁXIMO!"
        : `¡NIVEL ${this.level}!`;
    const color = this.infinite ? "#ff88ff" : isMax ? "#ff0000" : "#ff4444";

    const text = this.add
      .text(this.scale.width / 2, this.scale.height / 2, label, {
        fontSize: "48px",
        color,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.tweens.add({
      targets: text,
      y: text.y - 60,
      alpha: 0,
      duration: 1500,
      onComplete: () => text.destroy(),
    });
  }

  // =========================
  // SPAWN ENEMIGO
  // =========================
  spawnEnemy() {
    if (!this.player || !this.player.active) return;

    const margin = 60;
    let x = Phaser.Math.Between(margin, this.scale.width - margin);
    let y = Phaser.Math.Between(margin, this.scale.height - margin);

    const distance = Phaser.Math.Distance.Between(
      x,
      y,
      this.player.x,
      this.player.y,
    );
    if (distance < 150) {
      x = Phaser.Math.Between(margin, this.scale.width - margin);
      y = Phaser.Math.Between(margin, this.scale.height - margin);
    }

    const { speed, health } = this.getLevelStats(this.level);
    const enemy = new Enemy(this, x, y, this.player);
    enemy.speed = speed;
    enemy.health = health;
    enemy.play("zombie_walk");
    this.enemies.add(enemy, true);
  }

  spawnPowerUp() {
    if (this.powerUps.countActive(true) > 0) return;
    const margin = 60;
    const x = Phaser.Math.Between(margin, this.scale.width - margin);
    const y = Phaser.Math.Between(margin, this.scale.height - margin);
    const powerUp = new PowerUp(this, x, y);
    this.powerUps.add(powerUp, true);
  }

  collectPowerUp(player, powerUp) {
    powerUp.destroy();
    this.clearAllZombies();
    this.showPowerUpText();
    try {
      if (this.sfxPickup && this.audioEnabled) this.sfxPickup.play();
    } catch (e) {}
  }

  clearAllZombies() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy && enemy.active) {
        enemy.destroy();
        this.addScore(10);
      }
    });
  }

  showPowerUpText() {
    const text = this.add
      .text(this.player.x, this.player.y - 50, "POWER-UP!", {
        fontSize: "28px",
        color: "#ffff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => text.destroy(),
    });
  }

  handleBulletEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;

    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.setEnable(false);

    enemy.takeDamage(bullet.damage);

    this.time.delayedCall(0, () => {
      if (bullet?.destroy) bullet.destroy();
    });

    if (!enemy.active) {
      this.addScore(10);
      try {
        if (this.sfxHit && this.audioEnabled) this.sfxHit.play();
      } catch (e) {}
    }
  }

  handleMeleeEnemy(melee, enemy) {
    if (!melee.active || !enemy.active) return;
    enemy.takeDamage(melee.damage);
    if (!enemy.active) this.addScore(15);
  }

  handlePlayerEnemy(player, enemy) {
    const targetPlayer =
      this.player && typeof this.player.takeDamage === "function"
        ? this.player
        : player;

    if (!targetPlayer || !enemy) return;
    if (!targetPlayer.active || !enemy.active) return;

    const dmg = typeof enemy.damage === "number" ? enemy.damage : 1;

    try {
      targetPlayer.takeDamage(dmg);
      try {
        if (this.sfxHit && this.audioEnabled) this.sfxHit.play();
      } catch (e) {}
    } catch (err) {
      console.warn("Error aplicando daño al jugador", err, {
        targetPlayer,
        enemy,
      });
    }
  }

  // =========================
  // PUNTUACIÓN
  // =========================
  addScore(amount) {
    this.score += amount;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(this.hsKey, String(this.highScore));
      this.hudHigh.setText(`High: ${this.highScore}`);
    }

    if (this.infinite) {
      // Cada 150 puntos sube de oleada
      const wave = Math.floor(this.score / 150) + 1;
      if (wave > this.level) {
        this.level = wave;
        this.hudLevel.setText(`Oleada: ${this.level}`);
        this.applyLevelDifficulty();
      }
      return;
    }

    const { victoryScore } = this.getLevelStats(this.level);

    if (!this.victory && this.score >= victoryScore) {
      if (this.level < 4) {
        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);
        this.level++;
        localStorage.setItem("level", String(this.level));
        this.hudLevel.setText(`Level: ${this.level}`);
        this.applyLevelDifficulty();
        return;
      }

      this.victory = true;
      try {
        if (this.bgm && this.bgm.isPlaying) this.bgm.stop();
      } catch (e) {}
      this.scene.start("gameover", { score: this.score, victory: true });
    }
  }
}
