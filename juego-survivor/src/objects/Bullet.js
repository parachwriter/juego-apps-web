import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, targetX, targetY) {
    super(scene, x, y, "bullet");

    // =========================
    // AGREGAR A ESCENA
    // =========================
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // =========================
    // CONFIGURACIÓN
    // =========================
    this.speed = 700;
    this.damage = 1;

    this.setDisplaySize(12, 12);

    // =========================
    // DIRECCIÓN
    // =========================
    const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);

    // =========================
    // ROTACIÓN
    // =========================
    this.setRotation(angle);

    // =========================
    // BODY — aplicar en siguiente frame cuando el body ya está listo
    // =========================
    scene.time.delayedCall(0, () => {
      if (!this.active || !this.body) return;

      this.body.setAllowGravity(false);
      this.body.setCircle(6);

      const velocityX = Math.cos(angle) * this.speed;
      const velocityY = Math.sin(angle) * this.speed;
      this.body.setVelocity(velocityX, velocityY);
    });

    // =========================
    // DESTRUIR AUTOMÁTICAMENTE
    // =========================
    scene.time.delayedCall(2000, () => {
      if (this.active) this.destroy();
    });
  }
}
