// Mario Knight Silksong - Level Generation & Biome Engine

const LEVEL_CONFIGS = [
  {
    level: 1,
    name: 'Forgotten Mushroom Grotto',
    targetKm: 6000.0,
    themeColor: '#7b1fa2',
    bgColor1: '#0a0512',
    bgColor2: '#190d2e',
    groundColor: '#2d1842',
    platformColor: '#4a256d',
    spikeColor: '#e040fb',
    monsterTypes: ['void_goomba', 'silk_spiny'],
    spawnInterval: 2.4,
    reward: {
      icon: '⚡',
      name: 'LIGHTNING THUNDER AXE',
      desc: 'Slashing with your Great Axe summons crackling thunderbolts and chain lightning that electrocutes all monsters in sight!'
    }
  },
  {
    level: 2,
    name: "Queen's Silk Cradle",
    targetKm: 8000.0,
    themeColor: '#fbc02d',
    bgColor1: '#141208',
    bgColor2: '#2c250b',
    groundColor: '#423712',
    platformColor: '#6d5a1e',
    spikeColor: '#ffd54f',
    monsterTypes: ['void_goomba', 'silk_spiny', 'needle_wasp'],
    spawnInterval: 2.2,
    reward: {
      icon: '🌪️',
      name: 'TORNADO SILK DASH',
      desc: 'Press [Shift]/[L]/Right-Click to morph into an invincible razor tornado vortex that shreds and sweeps away monsters!'
    }
  },
  {
    level: 3,
    name: 'Molten Koopa Core',
    targetKm: 10000.0,
    themeColor: '#e64a19',
    bgColor1: '#140602',
    bgColor2: '#2d0c04',
    groundColor: '#451608',
    platformColor: '#75260e',
    spikeColor: '#ff5722',
    monsterTypes: ['silk_spiny', 'shield_beetle', 'piranha_pod'],
    spawnInterval: 2.0,
    reward: {
      icon: '🔥',
      name: 'METEOR MAGMA BLASTER',
      desc: 'Press [Q]/[E] to blast giant explosive magma meteors that incinerate entire monster swarms on impact!'
    }
  },
  {
    level: 4,
    name: 'Mantis Sanctum Spire',
    targetKm: 12500.0,
    themeColor: '#1976d2',
    bgColor1: '#040b17',
    bgColor2: '#081730',
    groundColor: '#0e274f',
    platformColor: '#184285',
    spikeColor: '#40c4ff',
    monsterTypes: ['needle_wasp', 'shield_beetle', 'shadow_wisp'],
    spawnInterval: 1.9,
    reward: {
      icon: '🪽',
      name: 'HOLY MONARCH TRIPLE JUMP',
      desc: 'Sprout radiant celestial wings for an effortless triple air-jump with featherweight flight control!'
    }
  },
  {
    level: 5,
    name: 'Abyssal Mariana Trench',
    targetKm: 15000.0,
    themeColor: '#00897b',
    bgColor1: '#011210',
    bgColor2: '#032622',
    groundColor: '#063d36',
    platformColor: '#0b665b',
    spikeColor: '#64ffda',
    monsterTypes: ['shadow_wisp', 'piranha_pod', 'void_shade'],
    spawnInterval: 1.8,
    reward: {
      icon: '🛡️',
      name: 'DIVINE AEGIS REFLECTOR',
      desc: 'Hold [S]/[Down] on ground to form an invincible divine mirror shield that deflects bites and reflects attacks at 300% damage!'
    }
  },
  {
    level: 6,
    name: 'Crystal Geode Cavern',
    targetKm: 18000.0,
    themeColor: '#ab47bc',
    bgColor1: '#120417',
    bgColor2: '#24082e',
    groundColor: '#3c0e4c',
    platformColor: '#651780',
    spikeColor: '#ea80fc',
    monsterTypes: ['silk_spiny', 'needle_wasp', 'cog_sentinel'],
    spawnInterval: 1.6,
    reward: {
      icon: '🌋',
      name: 'TITAN SEISMIC EARTHQUAKE',
      desc: 'Press [S]/[Down] in mid-air to slam down and shatter the earth with screen-clearing erupting lava pillars!'
    }
  },
  {
    level: 7,
    name: 'Scarlet Nightmare Realm',
    targetKm: 22000.0,
    themeColor: '#d32f2f',
    bgColor1: '#1a0406',
    bgColor2: '#33080b',
    groundColor: '#4f0d12',
    platformColor: '#80151d',
    spikeColor: '#ff1744',
    monsterTypes: ['shadow_wisp', 'shield_beetle', 'void_shade'],
    spawnInterval: 1.5,
    reward: {
      icon: '🌌',
      name: 'ABYSSAL BLACK HOLE VOID',
      desc: 'Press [Q]/[E] to channel a dark matter black hole vortex that pulls all enemies into an imploding singularity!'
    }
  },
  {
    level: 8,
    name: 'The Pantheon of Radiance',
    targetKm: 26000.0,
    themeColor: '#fbc02d',
    bgColor1: '#1a1705',
    bgColor2: '#3b3309',
    groundColor: '#5c4f0d',
    platformColor: '#8f7b15',
    spikeColor: '#ffee58',
    monsterTypes: ['needle_wasp', 'astral_phantom', 'void_goomba'],
    spawnInterval: 1.4,
    reward: {
      icon: '☀️',
      name: 'RADIANT SOLAR AURA',
      desc: 'Unleashes radiant blinding solar halos on every Great Axe swing that incinerates nearby foes!'
    }
  },
  {
    level: 9,
    name: 'Astral Weaver Citadel',
    targetKm: 31000.0,
    themeColor: '#9c27b0',
    bgColor1: '#12002b',
    bgColor2: '#240046',
    groundColor: '#3c096c',
    platformColor: '#5a189a',
    spikeColor: '#e0aaff',
    monsterTypes: ['astral_phantom', 'needle_wasp', 'void_shade'],
    spawnInterval: 1.3,
    reward: {
      icon: '🌟',
      name: 'STELLAR PRISM LANCE',
      desc: 'Press [Q]/[E] to loose a piercing cosmic starlight lance that shatters through enemy lines!'
    }
  },
  {
    level: 10,
    name: 'Clockwork Core of Pharloom',
    targetKm: 36000.0,
    themeColor: '#ff6f00',
    bgColor1: '#1b0d00',
    bgColor2: '#3e1f00',
    groundColor: '#5d2e00',
    platformColor: '#8d4600',
    spikeColor: '#ffab00',
    monsterTypes: ['cog_sentinel', 'shield_beetle', 'piranha_pod'],
    spawnInterval: 1.2,
    reward: {
      icon: '⚙️',
      name: 'TIME-WARP CHRONO GEAR',
      desc: 'Releases a localized temporal shockwave that damages and freezes all surrounding foes!'
    }
  },
  {
    level: 11,
    name: 'The Void Throne of the Shadow King',
    targetKm: 42000.0,
    themeColor: '#00e5ff',
    bgColor1: '#050a14',
    bgColor2: '#0b162c',
    groundColor: '#102347',
    platformColor: '#17366d',
    spikeColor: '#18ffff',
    monsterTypes: ['void_shade', 'astral_phantom', 'shadow_wisp'],
    spawnInterval: 1.1,
    reward: {
      icon: '👁️',
      name: 'SHADOW SOUL CLEAVE',
      desc: 'Slashes summon ethereal void scythes that track and destroy distant enemies!'
    }
  },
  {
    level: 12,
    name: 'Apex of Silksong - The Infinite Godweaver',
    targetKm: 50000.0,
    themeColor: '#ffd700',
    bgColor1: '#261c00',
    bgColor2: '#4a3700',
    groundColor: '#6e5200',
    platformColor: '#997300',
    spikeColor: '#fff59d',
    monsterTypes: ['astral_phantom', 'void_shade', 'cog_sentinel', 'needle_wasp'],
    spawnInterval: 1.0,
    reward: {
      icon: '👑',
      name: 'ASCENDED CHAMPION OF SILKSONG',
      desc: 'You have slain the Infinite Godweaver, freed Hornet from the Golden Cage, and restored eternal peace to Pharloom!'
    }
  }
];

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.config = LEVEL_CONFIGS[0];
    this.levelWidth = 9600;
    this.levelHeight = 600;
    this.platforms = [];
    this.spikes = [];
    this.bossArenaStartX = 8000;
    this.bossSpawnX = 8800;
    this.bossSpawnY = 380;
    this.spawnTimer = 0;
  }

  loadLevel(levelIndex) {
    this.currentLevel = levelIndex;
    this.config = LEVEL_CONFIGS[levelIndex - 1] || LEVEL_CONFIGS[0];

    // Grand Long-Haul Expedition maps scaling from 8,000px up to 42,000px!
    const arenaMap = [
      { start: 8000, width: 9600, spawnX: 8800, spawnY: 380 },
      { start: 10000, width: 11800, spawnX: 10900, spawnY: 380 },
      { start: 12000, width: 14000, spawnX: 13000, spawnY: 380 },
      { start: 14500, width: 16700, spawnX: 15600, spawnY: 380 },
      { start: 17000, width: 19400, spawnX: 18200, spawnY: 380 },
      { start: 20000, width: 22600, spawnX: 21300, spawnY: 380 },
      { start: 23000, width: 25800, spawnX: 24400, spawnY: 380 },
      { start: 26500, width: 29500, spawnX: 28000, spawnY: 380 },
      { start: 30000, width: 33200, spawnX: 31600, spawnY: 380 },
      { start: 34000, width: 37400, spawnX: 35700, spawnY: 380 },
      { start: 38000, width: 41600, spawnX: 39800, spawnY: 380 },
      { start: 42000, width: 46000, spawnX: 44000, spawnY: 380 },
    ];
    const aCfg = arenaMap[levelIndex - 1] || arenaMap[0];
    this.bossArenaStartX = aCfg.start;
    this.levelWidth = aCfg.width;
    this.bossSpawnX = aCfg.spawnX;
    this.bossSpawnY = aCfg.spawnY;

    this.generateMap();
  }

  generateMap() {
    this.platforms = [];
    this.spikes = [];

    // Main base ground across entire level
    this.platforms.push({ x: 0, y: 520, w: this.levelWidth, h: 80 });

    // Left and Right level boundaries
    this.platforms.push({ x: -40, y: 0, w: 40, h: 600 });
    this.platforms.push({ x: this.levelWidth, y: 0, w: 40, h: 600 });

    // Stepped Traversal Platforms leading up to Boss Arena
    const chunkWidth = 280;
    const totalChunks = Math.floor(this.bossArenaStartX / chunkWidth);

    for (let c = 1; c < totalChunks; c++) {
      const cx = c * chunkWidth;
      const step1 = 430; // Low step
      const step2 = 330; // Mid step
      const step3 = 230; // High ledge
      const step4 = 150; // Sky perch

      if (c % 3 === 0) {
        this.platforms.push({ x: cx, y: step1, w: 140, h: 20 });
        this.platforms.push({ x: cx + 100, y: step2, w: 140, h: 20 });
        this.platforms.push({ x: cx + 180, y: step3, w: 130, h: 20 });
        this.platforms.push({ x: cx + 80, y: step4, w: 110, h: 20 });
      } else if (c % 3 === 1) {
        this.platforms.push({ x: cx + 20, y: step2, w: 150, h: 20 });
        this.platforms.push({ x: cx + 150, y: step1, w: 130, h: 20 });
      } else {
        this.platforms.push({ x: cx + 40, y: step3, w: 160, h: 20 });
        this.platforms.push({ x: cx + 160, y: step2, w: 140, h: 20 });
      }

      // Ground spike hazards
      if (this.currentLevel === 1) {
        if (c % 4 === 1 && cx < this.bossArenaStartX - 250) {
          this.spikes.push({ x: cx + 60, y: 504, w: 60, h: 16 });
        }
      } else {
        if (c % 2 === 1 && cx < this.bossArenaStartX - 200) {
          this.spikes.push({ x: cx + 50, y: 504, w: 80, h: 16 });
        }
      }
    }

    // Boss Arena Tactical Platforms at the end of the level
    const bx = this.bossArenaStartX;
    this.platforms.push({ x: bx + 120, y: 410, w: 170, h: 20 });
    this.platforms.push({ x: bx + 780, y: 410, w: 170, h: 20 });
    this.platforms.push({ x: bx + 320, y: 310, w: 200, h: 20 });
    this.platforms.push({ x: bx + 560, y: 310, w: 200, h: 20 });
    this.platforms.push({ x: bx + 420, y: 180, w: 240, h: 20 });
  }

  updateMonsterSpawns(dt, player, monsters, isBossActive) {
    if (isBossActive) return; // Boss battle handles its own encounters

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.config.spawnInterval;

      // Spawn monster ahead or behind player within viewing distance
      const spawnAhead = Math.random() > 0.35;
      const spawnX = player.x + (spawnAhead ? 450 + Math.random() * 250 : -350 - Math.random() * 180);

      // Don't spawn outside level or inside boss arena
      if (spawnX > 80 && spawnX < this.bossArenaStartX - 80) {
        const types = this.config.monsterTypes;
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const spawnY = (chosenType === 'needle_wasp' || chosenType === 'shadow_wisp' || chosenType === 'astral_phantom') ? 220 + Math.random() * 140 : 490;
        
        if (monsters.length < 24) {
          monsters.push(new SmallMonster(spawnX, spawnY, chosenType));
        }
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
