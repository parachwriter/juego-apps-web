import Phaser from 'phaser'

export default class MenuScene extends Phaser.Scene {

    constructor() {
        super('menu')
    }

    create() {

        this.add.text(500, 300, 'Zombie 2d', {
            fontSize: '48px',
            color: '#ffffff'
        })

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })

    }

}