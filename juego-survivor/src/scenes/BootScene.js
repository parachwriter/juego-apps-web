import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

    constructor() {
        super('boot')
    }

    preload() {

        // cargar assets aquí 

    }

    create() {

        this.scene.start('menu')

    }

}