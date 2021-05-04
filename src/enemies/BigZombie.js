import Phaser from 'phaser';

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

const randomDirection = (exclude) => {
  let newDircetion = Phaser.Math.Between(0, 3);
  while (newDircetion === exclude) {
    newDircetion = Phaser.Math.Between(0, 3);
  }

  return newDircetion;
}

export default class BigZombie extends Phaser.Physics.Arcade.Sprite {
  direction = Direction.RIGHT;
  moveEvent;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play('big-zombie-idle');

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true
    });
  }

  destroy(fromScene) {
    this.moveEvent.destroy();

    super.destroy(fromScene);
  }

  handleTileCollision(go, tile) {
    if (go !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;
      
      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;
    
      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;
        
      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }

  }
}