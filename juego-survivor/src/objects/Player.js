import Phaser from "phaser";
import Bullet from "./Bullet";
import Melee from "./Melee";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    // =========================
    // AGREGAR A ESCENA
    // =========================
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // =========================
    // REFERENCIAS
    // =========================
    this.scene = scene;

    // =========================
    // CONFIGURACIÓN PLAYER
    // =========================
    this.speed = 220;
    this.health = 100;
    this.maxHealth = 100;
    this.invulnerable = false;

    // =========================
    // FÍSICAS
    // =========================
    this.setCollideWorldBounds(true);

    // =========================
    // INPUT TECLADO
    // =========================
    this.keys = scene.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
    });

    // =========================
    // MELEE
    // =========================
    this.spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    // =========================
    // BALAS
    // =========================
    this.bullets = scene.physics.add.group();
    this.meleeAttacks = scene.physics.add.group();

    // =========================
    // SHOOT COOLDOWN
    // =========================
    this.canShoot = true;
    this.fireRate = 200;

    // =========================
    // INPUT MOUSE
    // =========================
    scene.input.on("pointerdown", this.shoot, this);
  }

  update() {
    this.handleMovement();
    this.rotateToMouse();

    const isMoving = this.body.velocity.lengthSq() > 0;
    if (isMoving) {
      this.anims.play("player_walk", true);
    } else {
      this.anims.stop();
      this.setFrame(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.meleeAttack();
    }
  }

  // ===================================
  // MOVIMIENTO
  // ===================================
  handleMovement() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.left.isDown) velocityX = -this.speed;
    if (this.keys.right.isDown) velocityX = this.speed;
    if (this.keys.up.isDown) velocityY = -this.speed;
    if (this.keys.down.isDown) velocityY = this.speed;

    this.setVelocity(velocityX, velocityY);

    if (velocityX !== 0 || velocityY !== 0) {
      this.body.velocity.normalize().scale(this.speed);
    }
  }

  // ===================================
  // ROTAR HACIA MOUSE
  // ===================================
rotateToMouse() {
  const pointer = this.scene.input.activePointer;
  // En vez de rotar, solo voltear horizontalmente según el mouse
  if (pointer.worldX < this.x) {
    this.setFlipX(true);
  } else {
    this.setFlipX(false);
  }
}
  // ===================================
  // DISPARAR
  // ===================================
  shoot(pointer) {
    if (!this.canShoot) return;

    this.canShoot = false;

    const bullet = new Bullet(
      this.scene,
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY,
    );
    this.bullets.add(bullet);

    this.scene.time.delayedCall(this.fireRate, () => {
      this.canShoot = true;
    });
  }

  // ===================================
  // MELEE
  // ===================================
  meleeAttack() {
    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY,
    );

    // Crear el objeto Melee y añadirlo al grupo para que el overlap funcione
    const melee = new Melee(this.scene, this.x, this.y, angle);
    this.meleeAttacks.add(melee);

    // Periodo de invulnerabilidad durante el ataque
    this.invulnerable = true;
    this.scene.time.delayedCall(500, () => {
      this.invulnerable = false;
    });
  }

  // ===================================
  // RECIBIR DAÑO
  // ===================================
  takeDamage(amount) {
    if (this.invulnerable) return;

    this.health -= amount;

    // Parpadeo visual
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });

    // Periodo de invulnerabilidad tras recibir daño
    this.invulnerable = true;
    this.scene.time.delayedCall(500, () => {
      this.invulnerable = false;
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  // ===================================
  // MUERTE
  // ===================================
  die() {
    try {
      if (this.scene?.scene?.start) {
        const score = this.scene.score || 0;
        this.scene.scene.start("gameover", { score });
      }
    } catch (e) {
      console.error("Error al cambiar a gameover", e);
    }

    try {
      this.setActive(false);
      this.setVisible(false);
    } catch (e) {}

    const self = this;
    if (this.scene?.time?.delayedCall) {
      this.scene.time.delayedCall(100, () => {
        try {
          if (self?.destroy) self.destroy();
        } catch (e) {}
      });
    } else {
      try {
        if (this?.destroy) this.destroy();
      } catch (e) {}
    }
  }
}
