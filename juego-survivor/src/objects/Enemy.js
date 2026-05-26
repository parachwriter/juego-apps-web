import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, "zombie");

    // agregar a escena
    scene.add.existing(this);

    // físicas
    scene.physics.add.existing(this);

    // referencias
    this.scene = scene;
    this.player = player;

    // propiedades zombie
    this.speed = 80;
    this.health = 3;
    this.damage = 10;

    // hitbox
    this.setCollideWorldBounds(true);

    // profundidad visual
    this.setDepth(1);
  }

  update() {
    if (!this.player || !this.player.active) return;

    this.scene.physics.moveToObject(this, this.player, this.speed);

    // Voltear según hacia dónde se mueve
    if (this.player.x < this.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }

    this.anims.play("zombie_walk", true);
  }
  takeDamage(amount) {
    this.health -= amount;

    // efecto visual
    this.setTint(0xff0000);

    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    // opcional:
    // partículas
    // sonido
    // score
    // loot

    this.destroy();
  }
}
