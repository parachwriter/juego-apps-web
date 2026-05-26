import Phaser from "phaser";

export default class PowerUp extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(18, 18);
    this.body.setCircle(9);
    this.body.setOffset(0, 0);
    this.setTint(0xffff00);
    this.setDepth(10);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }
}
