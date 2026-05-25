import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('game')
    }

    create() {

        this.add.text(400, 300, 'Juego iniciado', {
            fontSize: '32px',
            color: '#ffffff'
        })

    }

}