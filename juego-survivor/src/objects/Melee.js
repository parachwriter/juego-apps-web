import Phaser from 'phaser'

export default class Melee extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, angle) {

        super(scene, x, y, 'melee')

        // =========================
        // AGREGAR A ESCENA
        // =========================

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.scene = scene

        // =========================
        // CONFIGURACIÓN
        // =========================

        this.damage = 3

        // =========================
        // ROTACIÓN
        // =========================

        this.setRotation(angle)

        // =========================
        // POSICIÓN FRENTE PLAYER
        // =========================

        const distance = 40

        this.x += Math.cos(angle) * distance
        this.y += Math.sin(angle) * distance

        // =========================
        // HITBOX
        // =========================

        this.body.setSize(32, 32)

        // =========================
        // DESTRUIR RÁPIDO
        // =========================

        scene.time.delayedCall(150, () => {

            if (this.active) {
                this.destroy()
            }

        })

    }

}