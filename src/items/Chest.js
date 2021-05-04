import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play('chest-closed');
  }

  open() {
    if (this.anims.currentAnim.key !== 'chest-closed') {
      return 0;
    }

    this.anims.play('chest-open');
    return Phaser.Math.Between(50, 200);
  }
}