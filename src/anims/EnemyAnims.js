import Phaser from 'phaser';

const createBigZombieAnims = (anims) => {
  anims.create({
    key: 'big-zombie-idle',
    frames: anims.generateFrameNames('big-zombie', {
      start: 0,
      end: 3,
      prefix: 'big_zombie_idle_anim_f',
      suffix: '.png'
    }),
    repeat: -1,
    frameRate: 10
  });

  anims.create({
    key: 'big-zombie-run',
    frames: anims.generateFrameNames('big-zombie', {
      start: 0,
      end: 3,
      prefix: 'big_zombie_run_anim_f',
      suffix: '.png'
    }),
    repeat: -1,
    frameRate: 10
  });
};

export {
  createBigZombieAnims
};