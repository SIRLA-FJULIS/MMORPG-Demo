import Phaser from 'phaser';
import { createBigZombieAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createChestAnims } from '../anims/ChestAnims';

import { debugDraw } from '../utils/debug';
import BigZombie from '../enemies/BigZombie';
import '../characters/Faune';
import Chest from '../items/Chest';

import { sceneEvents } from '../events/EventCenter';


export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run('game-ui');

    createCharacterAnims(this.anims);
    createBigZombieAnims(this.anims);
    createChestAnims(this.anims);

    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    map.createLayer('Ground', tileset);
    const wallsLayer = map.createLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    const chests = this.physics.add.staticGroup({
      classType: Chest
    });
    const chestsLayer = map.getObjectLayer('Chests');
    chestsLayer.objects.forEach(chestObj => {
      chests.get(chestObj.x + chestObj.width * 0.5, chestObj.y - chestObj.height * 0.5, 'chest');
    })
    
    // debugDraw(wallsLayer, this);

    this.cleavers = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3
    });

    this.faune = this.add.faune(128, 128, 'faune');
    this.faune.setCleavers(this.cleavers);

    this.cameras.main.startFollow(this.faune, true);

    this.big_zombies = this.physics.add.group({
      classType: BigZombie,
      createCallback: (go) => {
        const bigZombieGo = go;
        bigZombieGo.body.onCollide = true;
      }
    });

    const bigZombiesLayer = map.getObjectLayer('BigZombies');
    bigZombiesLayer.objects.forEach(bigZombieObj => {
      this.big_zombies.get(bigZombieObj.x, bigZombieObj.y, 'big-zombie');
    })

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.big_zombies, wallsLayer);

    this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this);
    
    this.physics.add.collider(this.cleavers, wallsLayer, this.handleCleaverWallCollision, undefined, this);
    this.physics.add.collider(this.cleavers, this.big_zombies, this.handleCleaverBigZombieCollision, undefined, this);

    this.playerBigZombieCollider = this.physics.add.collider(this.big_zombies, this.faune, this.handlePlayerBigZombieCollision, undefined, this);
  }

  handlePlayerChestCollision(obj1, obj2) {
    const chest = obj2;
    this.faune.setChest(chest);
  }

  handleCleaverWallCollision(obj1, obj2) {
    this.cleavers.killAndHide(obj1);
  }

  handleCleaverBigZombieCollision(obj1, obj2) {
    this.cleavers.killAndHide(obj1);
    this.big_zombies.killAndHide(obj2);
  }

  handlePlayerBigZombieCollision(obj1, obj2) {
    this.big_zombie = obj2;

    const dx = this.faune.x - this.big_zombie.x;
    const dy = this.faune.y - this.big_zombie.y;

    const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.faune.handleDamage(direction);

    sceneEvents.emit('player-health-changed', this.faune.health);

    if (this.faune.health <= 0) {
      this.playerBigZombieCollider.destroy();
    }
  }

  update(t, dt) {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}