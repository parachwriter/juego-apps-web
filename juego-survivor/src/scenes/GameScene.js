import Phaser from "phaser";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";

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

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.score = 0;
    this.scoreText = this.add
      .text(16, 16, "Score: 0", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setDepth(10);

    this.healthText = this.add
      .text(16, 46, `HP: ${this.player.health}`, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setDepth(10);

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
  }

  update() {
    if (this.player && this.player.active) {
      this.player.update();
      this.healthText.setText(`HP: ${this.player.health}`);
    }
  }

  createAnimations() {
    if (!this.anims.exists("player_walk")) {
      this.anims.create({
        key: "player_walk",
        frames: this.anims.generateFrameNumbers("player", {
          start: 0,
          end: 8,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!this.anims.exists("zombie_walk")) {
      this.anims.create({
        key: "zombie_walk",
        frames: this.anims.generateFrameNumbers("zombie", {
          start: 0,
          end: 7,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  spawnEnemy() {
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

  handleBulletEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;

    enemy.takeDamage(bullet.damage);
    bullet.destroy();

    if (!enemy.active) {
      this.addScore(10);
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
    if (!player.active || !enemy.active) return;

    player.takeDamage(enemy.damage);
  }

  addScore(amount) {
    this.score += amount;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
