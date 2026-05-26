import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, "zombie_idle"); // <- sprite base correcto

    // agregar a escena
    scene.add.existing(this);

    // físicas
    scene.physics.add.existing(this);

    // hitbox — ajusta estos valores al tamaño visual real de tu zombie
    this.body.setSize(32, 48);
    this.body.setOffset((this.width - 32) / 2, (this.height - 48) / 2);

    // referencias
    this.scene = scene;
    this.player = player;

    // propiedades zombie
    this.speed = 80;
    this.health = 2;
    this.damage = 10;

    // colisión con bordes del mundo
    this.setCollideWorldBounds(true);

    // profundidad visual
    this.setDepth(1);
  }

  update() {
    if (!this.player || !this.player.active) return;

    this.scene.physics.moveToObject(this, this.player, this.speed);

    // voltear según dirección del jugador
    this.setFlipX(this.player.x < this.x);

    this.anims.play("zombie_walk", true);
  }

  takeDamage(amount) {
    this.health -= amount;

    // efecto visual
    this.setTint(0xff0000);
    this.anims.play("zombie_hurt", true);

    this.once("animationcomplete-zombie_hurt", () => {
      if (this.active) {
        this.clearTint();
        this.anims.play("zombie_walk", true);
      }
    });

    // fallback por si la animación no dispara el evento
    this.scene.time.delayedCall(200, () => {
      if (this.active) this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.destroy();
  }
}
