import Phaser from 'phaser';
import { sceneEvents } from '../events/EventCenter';


const HealthState = {
  IDLE: 0,
  DAMAGE: 1,
  DEAD: 2
};

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  healthState = HealthState.IDLE;
  damageTime = 0;
  _health = 3;
  cleavers;
  _coins = 0;

  get health() {
    return this._health;
  }

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play('faune-idle-down');
  }

  setChest(chest) {
    this.activeChest = chest;
  }

  setCleavers(cleavers) {
    this.cleavers = cleavers;
  }

  handleDamage(direction) {
    if (this._health <= 0) {
      return
    }

    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.anims.play('faune-faint');
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(direction.x, direction.y);

      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  throwCleaver() {
    if (!this.cleavers) {
      return;
    }

    const cleaver = this.cleavers.get(this.x, this.y, 'cleaver');
    if (!cleaver) {
      return;
    }

    const parts = this.anims.currentAnim.key.split("-");
    const direction = parts[2];

    const vec = new Phaser.Math.Vector2(0, 0);

    switch (direction) {
      case 'up':
        vec.y = -1;
        break;

      case 'down':
        vec.y = 1;
        break;
      
      default:
      case 'side':
        if (this.scaleX < 0) {
          vec.x = -1;
        } else {
          vec.x = 1;
        }
        break;
    }

    const angle = vec.angle();

    cleaver.setActive(true);
    cleaver.setVisible(true);

    cleaver.setRotation(angle);

    cleaver.x += vec.x * 16;
    cleaver.y += vec.y * 16;

    cleaver.setVelocity(vec.x * 300, vec.y * 300);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors) {
    if (this.healthState === HealthState.DAMAGE 
        || this.healthState === HealthState.DEAD) {
      return;
    }
    if (!cursors) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (this.activeChest) {
        const coins = this.activeChest.open();
        this._coins += coins;

        sceneEvents.emit('player-coins-changed', this._coins);
      } else {
        this.throwCleaver();
      }
      return;
    }

    const speed = 100;

    if (cursors.left.isDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;
      this.body.offset.x = 24;
    } else if (cursors.right.isDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    } else if (cursors.up.isDown) {
      this.anims.play('faune-run-up', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down.isDown) {
      this.anims.play('faune-run-down', true);
      this.setVelocity(0, speed);
    } else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }
    
    if (cursors.left.isDown || cursors.right.isDown|| cursors.up.isDown || cursors.down.isDown) {
      this.activeChest = undefined;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (x, y, texture, frame) {
  let sprite = new Faune(this.scene, x, y, texture, frame);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);

  return sprite;
});