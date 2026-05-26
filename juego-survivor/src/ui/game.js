import Phaser from "phaser";

import BootScene from "../scenes/BootScene";
import MenuScene from "../scenes/MenuScene";
import GameScene from "../scenes/GameScene";
import GameOverScene from "../scenes/GameOverScene";
import PauseScene from "../scenes/PauseScene";

const config = {
  type: Phaser.AUTO,

  width: 1280,
  height: 720,

  backgroundColor: "#1a1a1a",

  parent: "game-container",

  pixelArt: true,

  physics: {
    default: "arcade",

    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scale: {
    mode: Phaser.Scale.RESIZE,

    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  render: {
    pixelArt: true,
    antialias: false,
  },

  scene: [BootScene, MenuScene, GameScene, GameOverScene, PauseScene],
};

export default new Phaser.Game(config);
