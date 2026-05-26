import Phaser from "phaser";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import PowerUp from "../objects/PowerUp";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    this.cameras.main.setBackgroundColor("#111111");

    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x111111)
      .setOrigin(0);

    this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "tiles")
      .setOrigin(0)
      .setScrollFactor(0);

    this.createAnimations();

    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);
    this.player.play("player_walk");

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
    // persistencia
    this.highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
    this.level = parseInt(localStorage.getItem("level") || "1", 10);
    this.audioEnabled = localStorage.getItem("audioEnabled");
    if (this.audioEnabled === null) this.audioEnabled = "true";
    this.audioEnabled = this.audioEnabled === "true";

    // HUD
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

    // AUDIO: obtener del cache (cargado en BootScene)
    try {
      this.bgm = this.sound.add("bgm", { loop: true, volume: 0.5 });
      this.sfxHit = this.sound.add("sfx_hit", { volume: 0.7 });
      this.sfxPickup = this.sound.add("sfx_pickup", { volume: 0.8 });

      // Intento de autoplay; si el navegador lo bloquea, iniciar en el primer input del usuario
      const playBgmIfAllowed = () => {
        try {
          if (this.audioEnabled && this.bgm && !this.bgm.isPlaying)
            this.bgm.play();
        } catch (e) {
          // ignore
        }
      };

      // intenta ahora
      playBgmIfAllowed();

      // si no suena, obliga a arrancar al primer gesto del usuario
      this.input.once("pointerdown", playBgmIfAllowed);
      this.input.keyboard.once("keydown", playBgmIfAllowed);
    } catch (e) {
      // ignore if audio not available
    }

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

    // Level HUD and timer
    this.hudLevel = this.add
      .text(16, 96, `Level: ${this.level}`, {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setDepth(10);
    this.levelTimer = this.time.addEvent({
      delay: 30000,
      callback: () => {
        this.level++;
        localStorage.setItem("level", String(this.level));
        this.hudLevel.setText(`Level: ${this.level}`);
      },
      loop: true,
    });

    this.spawnTimer = this.time.addEvent({
      delay: 1500,
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
  }

  update() {
    if (this.player && this.player.active) {
      this.player.update();
      this.healthText.setText(`HP: ${this.player.health}`);
    }
  }

  createAnimations() {
    // PLAYER
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

    // ZOMBIE
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

  spawnEnemy() {
    // Evitar crear enemigos si el jugador no existe o no está activo
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

    const enemy = new Enemy(this, x, y, this.player);
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

    enemy.takeDamage(bullet.damage);
    bullet.destroy();

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

    if (!enemy.active) {
      this.addScore(15);
    }
  }

  handlePlayerEnemy(player, enemy) {
    // Forzar aplicación de daño al jugador usando la instancia guardada en la escena
    const targetPlayer =
      this.player && typeof this.player.takeDamage === "function"
        ? this.player
        : player;

    if (!targetPlayer || !enemy) return;
    if (!targetPlayer.active || !enemy.active) return;

    const dmg = enemy && typeof enemy.damage === "number" ? enemy.damage : 1;

    try {
      // Aplicar daño
      targetPlayer.takeDamage(dmg);
      // reproducir SFX de golpe si existe
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

  addScore(amount) {
    this.score += amount;
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.hudHigh && this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", String(this.highScore));
      this.hudHigh.setText(`High: ${this.highScore}`);
    }

    // victory condition: example threshold
    if (!this.victory && this.score >= 200) {
      this.victory = true;
      try {
        if (this.bgm && this.bgm.isPlaying) this.bgm.stop();
      } catch (e) {}
      this.scene.start("gameover", { score: this.score, victory: true });
    }
  }
}
