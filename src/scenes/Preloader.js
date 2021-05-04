import Phaser from 'phaser';
import tilesDungeon from '../assets/tiles/0x72_DungeonTilesetII_v1.3.png';
import tilesDungeonJSON from '../assets/dungeon-01.json';
import fauneTexure from '../assets/faune.png';
import fauneTexureJSON from '../assets/faune.json';
import bigDemonTexure from '../assets/enemies/big_demon.png';
import bigDemonTexureJSON from '../assets/enemies/big_demon.json';
import bigZombieTexure from '../assets/enemies/big_zombie.png';
import bigZombieTexureJSON from '../assets/enemies/big_zombie.json';
import uiHeartEmpty from '../assets/ui/ui_heart_empty.png';
import uiHeartFull from '../assets/ui/ui_heart_full.png';
import cleaver from '../assets/weapons/weapon_cleaver.png';
import chestTexture from '../assets/items/chest.png';
import chestTextureJSON from '../assets/items/chest.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', tilesDungeon);
    this.load.tilemapTiledJSON('dungeon', tilesDungeonJSON);

    this.load.atlas('faune', fauneTexure, fauneTexureJSON);
    this.load.atlas('big-demon', bigDemonTexure, bigDemonTexureJSON);
    this.load.atlas('big-zombie', bigZombieTexure, bigZombieTexureJSON);
    this.load.atlas('chest', chestTexture, chestTextureJSON);

    this.load.image('ui-heart-empty', uiHeartEmpty);
    this.load.image('ui-heart-full', uiHeartFull);

    this.load.image('cleaver', cleaver);
  }

  create() {
    this.scene.start('game');
  }
}