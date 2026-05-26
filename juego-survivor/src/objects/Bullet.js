import Phaser from 'phaser'

export default class Bullet extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y, targetX, targetY) {

        super(scene, x, y, 'bullet')

        // =========================
        // AGREGAR A ESCENA
        // =========================

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.scene = scene

        // =========================
        // CONFIGURACIÓN BALA
        // =========================

        this.speed = 700
        this.damage = 1

        // =========================
        // FÍSICAS
        // =========================

        this.setCollideWorldBounds(false)

        // =========================
        // ROTACIÓN
        // =========================

        const angle = Phaser.Math.Angle.Between(
            x,
            y,
            targetX,
            targetY
        )

        this.setRotation(angle)

        // =========================
        // MOVIMIENTO
        // =========================

        scene.physics.velocityFromRotation(
            angle,
            this.speed,
            this.body.velocity
        )

        // =========================
        // AUTODESTRUCCIÓN
        // =========================

        scene.time.delayedCall(2000, () => {

            if (this.active) {
                this.destroy()
            }

        })

    }

}