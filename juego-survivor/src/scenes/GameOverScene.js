import Phaser from 'phaser'

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super('gameover')
    }

    create() {

        this.add.text(450, 300, 'GAME OVER', {
            fontSize: '48px',
            color: '#ff0000'
        })

    }

}