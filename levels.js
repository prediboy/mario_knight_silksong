// Mario Knight Silksong - Level Generation & Biome Engine

const LEVEL_CONFIGS = [
  {
    level: 1,
    name: 'Forgotten Mushroom Grotto',
    targetKm: 1000.0,
    themeColor: '#7b1fa2',
    bgColor1: '#0a0512',
    bgColor2: '#190d2e',
    groundColor: '#2d1842',
    platformColor: '#4a256d',
    spikeColor: '#e040fb',
    monsterTypes: ['void_goomba', 'silk_spiny', 'piranha_pod'],
    spawnInterval: 1.8,
    reward: {
      icon: '⚡',
      name: 'LIGHTNING THUNDER AXE',
      desc: 'Slashing with your Great Axe summons crackling thunderbolts and chain lightning that electrocutes all monsters in sight!'
    }
  },
  {
    level: 2,
    name: "Queen's Silk Cradle",
    targetKm: 1015.0,
    themeColor: '#fbc02d',
    bgColor1: '#141208',
    bgColor2: '#2c250b',
    groundColor: '#423712',
    platformColor: '#6d5a1e',
    spikeColor: '#ffd54f',
    monsterTypes: ['silk_spiny', 'needle_wasp', 'void_goomba'],
    spawnInterval: 1.6,
    reward: {
      icon: '🌪️',
      name: 'TORNADO SILK DASH',
      desc: 'Press [Shift]/[L]/Right-Click to morph into an invincible razor tornado vortex that shreds and sweeps away monsters!'
    }
  },
  {
    level: 3,
    name: 'Molten Koopa Core',
    targetKm: 1030.0,
    themeColor: '#e64a19',
    bgColor1: '#140602',
    bgColor2: '#2d0c04',
    groundColor: '#451608',
    platformColor: '#75260e',
    spikeColor: '#ff5722',
    monsterTypes: ['shield_beetle', 'silk_spiny', 'piranha_pod'],
    spawnInterval: 1.5,
    reward: {
      icon: '🔥',
      name: 'METEOR MAGMA BLASTER',
      desc: 'Press [Q]/[E] to blast giant explosive magma meteors that incinerate entire monster swarms on impact!'
    }
  },
  {
    level: 4,
    name: 'Mantis Sanctum Spire',
    targetKm: 1045.0,
    themeColor: '#1976d2',
    bgColor1: '#040b17',
    bgColor2: '#081730',
    groundColor: '#0e274f',
    platformColor: '#184285',
    spikeColor: '#40c4ff',
    monsterTypes: ['needle_wasp', 'shield_beetle', 'shadow_wisp'],
    spawnInterval: 1.4,
    reward: {
      icon: '🪽',
      name: 'HOLY MONARCH TRIPLE JUMP',
      desc: 'Sprout radiant celestial wings for an effortless triple air-jump with featherweight flight control!'
    }
  },
  {
    level: 5,
    name: 'Abyssal Mariana Trench',
    targetKm: 1060.0,
    themeColor: '#00897b',
    bgColor1: '#011210',
    bgColor2: '#032622',
    groundColor: '#063d36',
    platformColor: '#0b665b',
    spikeColor: '#64ffda',
    monsterTypes: ['shadow_wisp', 'piranha_pod', 'void_goomba'],
    spawnInterval: 1.3,
    reward: {
      icon: '🛡️',
      name: 'DIVINE AEGIS REFLECTOR',
      desc: 'Hold [S]/[Down] on ground to form an invincible divine mirror shield that deflects bites and reflects attacks at 300% damage!'
    }
  },
  {
    level: 6,
    name: 'Crystal Geode Cavern',
    targetKm: 1075.0,
    themeColor: '#ab47bc',
    bgColor1: '#120417',
    bgColor2: '#24082e',
    groundColor: '#3c0e4c',
    platformColor: '#651780',
    spikeColor: '#ea80fc',
    monsterTypes: ['silk_spiny', 'shield_beetle', 'needle_wasp'],
    spawnInterval: 1.2,
    reward: {
      icon: '🌋',
      name: 'TITAN SEISMIC EARTHQUAKE',
      desc: 'Press [S]/[Down] in mid-air to slam down and shatter the earth with screen-clearing erupting lava pillars!'
    }
  },
  {
    level: 7,
    name: 'Scarlet Nightmare Realm',
    targetKm: 1090.0,
    themeColor: '#d32f2f',
    bgColor1: '#1a0406',
    bgColor2: '#33080b',
    groundColor: '#4f0d12',
    platformColor: '#80151d',
    spikeColor: '#ff1744',
    monsterTypes: ['shadow_wisp', 'needle_wasp', 'shield_beetle', 'void_goomba'],
    spawnInterval: 1.1,
    reward: {
      icon: '🌌',
      name: 'ABYSSAL BLACK HOLE VOID',
      desc: 'Press [Q]/[E] to channel a dark matter black hole vortex that pulls all enemies into an imploding singularity!'
    }
  },
  {
    level: 8,
    name: 'The Pantheon of Radiance',
    targetKm: 1105.0,
    themeColor: '#fbc02d',
    bgColor1: '#1a1705',
    bgColor2: '#3b3309',
    groundColor: '#5c4f0d',
    platformColor: '#8f7b15',
    spikeColor: '#ffee58',
    monsterTypes: ['needle_wasp', 'shadow_wisp', 'shield_beetle', 'silk_spiny', 'void_goomba'],
    spawnInterval: 1.0,
    reward: {
      icon: '👑',
      name: 'CHAMPION OF SILKSONG',
      desc: 'You have slain all 8 Colossal Monsters and saved the Mushroom Realm of Pharloom!'
    }
  }
];

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.config = LEVEL_CONFIGS[0];
    this.levelWidth = 1400;
    this.levelHeight = 600;
    this.platforms = [];
    this.spikes = [];
    this.bossArenaStartX = 0;
    this.bossSpawnX = 750;
    this.bossSpawnY = 380;
    this.spawnTimer = 0;
  }

  loadLevel(levelIndex) {
    this.currentLevel = levelIndex;
    this.config = LEVEL_CONFIGS[levelIndex - 1];
    this.generateMap();
  }

  generateMap() {
    this.platforms = [];
    this.spikes = [];

    // Main Colosseum Ground Arena
    this.platforms.push({ x: 0, y: 520, w: this.levelWidth, h: 80 });

    // Left and Right Arena Boundaries
    this.platforms.push({ x: -30, y: 0, w: 30, h: 600 });
    this.platforms.push({ x: this.levelWidth, y: 0, w: 40, h: 600 });

    // Tactical Multi-Tier Battle Platforms (Wide open, NO blocking poles)
    this.platforms.push({ x: 120, y: 410, w: 160, h: 20 });
    this.platforms.push({ x: 840, y: 410, w: 160, h: 20 });
    this.platforms.push({ x: 320, y: 320, w: 180, h: 20 });
    this.platforms.push({ x: 620, y: 320, w: 180, h: 20 });
    this.platforms.push({ x: 440, y: 190, w: 240, h: 20 });
  }

  updateMonsterSpawns(dt, player, monsters, isBossActive) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.config.spawnInterval;

      // Spawn supporting small monsters on the sides to harvest Soul
      if (monsters.length < 5) {
        const types = this.config.monsterTypes;
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const spawnX = Math.random() > 0.5 ? 160 + Math.random() * 150 : 850 + Math.random() * 200;
        const spawnY = (chosenType === 'needle_wasp' || chosenType === 'shadow_wisp') ? 240 + Math.random() * 80 : 490;
        monsters.push(new SmallMonster(spawnX, spawnY, chosenType));
      }
    }
  }

  drawBackground(ctx, cameraX, canvasWidth, canvasHeight, time) {
    // Parallax Gradient Sky
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, this.config.bgColor1);
    grad.addColorStop(1, this.config.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Far Parallax Mountain / Mushroom Spire Silhouettes
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    const farOffset = cameraX * 0.15;
    for (let i = 0; i < 15; i++) {
      const px = (i * 320 - (farOffset % 320));
      const py = canvasHeight - 240;
      ctx.beginPath();
      ctx.moveTo(px - 100, canvasHeight);
      ctx.lineTo(px + 40, py - (i % 3) * 40);
      ctx.lineTo(px + 180, canvasHeight);
      ctx.fill();
    }

    // Mid Parallax Gothic Pillars & Silk Strands
    ctx.fillStyle = 'rgba(15, 20, 35, 0.65)';
    const midOffset = cameraX * 0.4;
    for (let i = 0; i < 20; i++) {
      const px = (i * 260 - (midOffset % 260));
      ctx.fillRect(px, 100, 24, canvasHeight);

      // Hanging silk strands
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 12, 100);
      ctx.quadraticCurveTo(px + 40, 240 + Math.sin(time * 2 + i) * 10, px + 80, 100);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawLevel(ctx, time, isBossActive = false) {
    // Draw Platforms
    for (const p of this.platforms) {
      if (p.isBossGate) {
        // Grand Boss Gate Pillar & Locked Energy Barrier
        ctx.fillStyle = '#141824';
        ctx.strokeStyle = isBossActive ? '#ff1744' : '#f0c355';
        ctx.lineWidth = 4;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Runes on Boss Gate
        ctx.fillStyle = isBossActive ? '#ff1744' : '#f0c355';
        ctx.shadowColor = isBossActive ? '#ff1744' : '#f0c355';
        ctx.shadowBlur = 15;
        ctx.font = 'bold 18px Cinzel';
        ctx.fillText('⚔️', p.x + 8, 240);
        ctx.fillText('❖', p.x + 12, 290);
        ctx.fillText('🔒', p.x + 8, 340);
        ctx.fillText('❖', p.x + 12, 390);

        // If Boss is active, draw vertical energy barrier sealing the arena entrance!
        if (isBossActive) {
          ctx.strokeStyle = `rgba(255, 23, 68, ${0.5 + Math.sin(time * 8) * 0.3})`;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(p.x + p.w / 2, 0);
          ctx.lineTo(p.x + p.w / 2, 520);
          ctx.stroke();

          // Crackling barrier sparks
          ctx.strokeStyle = '#ffd54f';
          ctx.lineWidth = 2;
          for (let i = 0; i < 6; i++) {
            const sy = ((time * 300 + i * 90) % 520);
            ctx.beginPath();
            ctx.moveTo(p.x, sy);
            ctx.lineTo(p.x + p.w + Math.sin(time * 10 + i) * 10, sy + 15);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      } else {
        // Platform Body
        ctx.fillStyle = p.y >= 500 ? this.config.groundColor : this.config.platformColor;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, p.h, 4);
        ctx.fill();

        // Platform Top Highlight
        ctx.fillStyle = this.config.themeColor;
        ctx.fillRect(p.x, p.y, p.w, 4);
      }
    }

    // Draw Spikes
    for (const s of this.spikes) {
      ctx.fillStyle = this.config.spikeColor;
      ctx.shadowColor = this.config.spikeColor;
      ctx.shadowBlur = 6;
      const spikeCount = Math.floor(s.w / 12);
      for (let i = 0; i < spikeCount; i++) {
        const sx = s.x + i * 12;
        ctx.beginPath();
        ctx.moveTo(sx, s.y + s.h);
        ctx.lineTo(sx + 6, s.y);
        ctx.lineTo(sx + 12, s.y + s.h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }
}
