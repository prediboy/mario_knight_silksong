// Mario Knight Silksong - Entities Engine

// Floating Text (Damage / Soul Notifications)
class FloatingText {
  constructor(text, x, y, color = '#ffffff', size = 12) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.life = 1.0;
    this.vy = -1.5;
  }

  update(dt) {
    this.y += this.vy * 60 * dt;
    this.life -= dt * 1.4;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.size}px 'Press Start 2P', monospace`;
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Particle System
class Particle {
  constructor(x, y, vx, vy, color, size, life, type = 'normal') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.type = type;
  }

  update(dt) {
    this.x += this.vx * 60 * dt;
    this.y += this.vy * 60 * dt;
    if (this.type !== 'soul_absorb') {
      this.vy += 0.15; // Gravity
    }
    this.life -= dt;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    const progress = this.life / this.maxLife;
    ctx.globalAlpha = progress;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * progress, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Projectile
class Projectile {
  constructor(x, y, vx, vy, isPlayer, type = 'beam', damage = 20, radius = 8) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isPlayer = isPlayer;
    this.type = type;
    this.damage = damage;
    this.radius = radius;
    this.alive = true;
    this.time = 0;
  }

  update(dt, levelWidth, levelHeight) {
    this.time += dt;
    this.x += this.vx * 60 * dt;
    this.y += this.vy * 60 * dt;

    if (this.x < -100 || this.x > levelWidth + 200 || this.y < -100 || this.y > levelHeight + 100) {
      this.alive = false;
    }
    return this.alive;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'beam' || this.type === 'lightning') {
      // Lightning Thunder Bolt
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-4, -6);
      ctx.lineTo(4, 4);
      ctx.lineTo(18, 0);
      ctx.lineTo(6, -4);
      ctx.lineTo(-2, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'meteor') {
      // Giant Magma Meteor
      ctx.fillStyle = '#ff3d00';
      ctx.shadowColor = '#ffab00';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(-3, -3, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'black_hole') {
      // Abyssal Black Hole Singularity
      ctx.rotate(this.time * 8);
      ctx.fillStyle = '#0a0014';
      ctx.strokeStyle = '#d500f9';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#e040fb';
      ctx.shadowBlur = 26;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Orbiting accretion ring
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 10, this.time * 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'fireball') {
      ctx.fillStyle = '#ff5722';
      ctx.shadowColor = '#ff9800';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff59d';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'boss_spore') {
      ctx.fillStyle = '#7b1fa2';
      ctx.shadowColor = '#e040fb';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'boss_needle') {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#00bcd4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
    } else if (this.type === 'boss_fire') {
      ctx.fillStyle = '#e65100';
      ctx.shadowColor = '#ffab00';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'boss_sun_lance') {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 6, Math.atan2(this.vy, this.vx), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Mario Knight Player
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 38;
    this.vx = 0;
    this.vy = 0;
    this.speed = 6.2;
    this.jumpForce = -22.5; // Super high, platform-conquering jump!
    this.gravity = 0.36;
    this.facingRight = true;
    this.grounded = false;

    // HP System (6 Masks, losing 1/6 HP per bite)
    this.maxMasks = 6;
    this.masks = 6;
    this.invulnerableTimer = 0;
    this.dead = false;

    // Soul System (10 notches, charged on every monster hit!)
    this.maxSoul = 10;
    this.soul = 0;

    // Attack state (Silksong Great Battle Axe)
    this.slashing = false;
    this.slashTimer = 0;
    this.slashDuration = 0.22;
    this.slashCooldown = 0.12;
    this.damage = 32; // Balanced Great Axe damage per hit

    // Sets to prevent multi-hit frame glitches during a single swing/dash/slam
    this.attackHitEntities = new Set();
    this.dashHitEntities = new Set();
    this.slamHitEntities = new Set();

    // Overhauled 7 Epic Powers - Unlocked by conquering each level!
    this.powers = {
      lightningAxe: false,       // Level 1: Thunderbolts & chain lightning
      tornadoDash: false,        // Level 2: Invincible razor tornado whirlwind
      meteorBlaster: false,      // Level 3: Giant explosive magma meteors [Q]/[E]
      monarchTripleJump: false,  // Level 4: Celestial Triple Jump with golden wings
      aegisReflect: false,       // Level 5: Divine Aegis barrier that reflects hits
      seismicSlam: false,        // Level 6: Screen-wide earthquake with lava pillars
      voidVortex: false,         // Level 7: Abyssal black hole gravity vortex
    };

    // Movement state
    this.airJumpsLeft = 0;
    this.dashing = false;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.dashSpeed = 15.0;

    // Ground slam state
    this.groundSlamming = false;

    // Parry state
    this.parryActive = false;
    this.parryTimer = 0;

    this.time = 0;
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.masks = this.maxMasks;
    this.soul = 0;
    this.dead = false;
    this.invulnerableTimer = 0;
    this.dashing = false;
    this.groundSlamming = false;
    this.airJumpsLeft = 0;
    if (!this.attackHitEntities) this.attackHitEntities = new Set();
    else this.attackHitEntities.clear();
    if (!this.dashHitEntities) this.dashHitEntities = new Set();
    else this.dashHitEntities.clear();
    if (!this.slamHitEntities) this.slamHitEntities = new Set();
    else this.slamHitEntities.clear();
  }

  unlockPower(level) {
    if (level === 1) this.powers.lightningAxe = true;
    if (level === 2) this.powers.tornadoDash = true;
    if (level === 3) this.powers.meteorBlaster = true;
    if (level === 4) this.powers.monarchTripleJump = true;
    if (level === 5) this.powers.aegisReflect = true;
    if (level === 6) this.powers.seismicSlam = true;
    if (level === 7) this.powers.voidVortex = true;
  }

  takeDamage(amountMasks = 1) {
    if (this.invulnerableTimer > 0 || this.dead || this.dashing) return false;

    // Divine Aegis Reflect Deflects Damage!
    if (this.parryActive || (this.powers.aegisReflect && this.parryActive)) {
      window.soundEngine.playPogo();
      return false;
    }

    this.masks = Math.max(0, this.masks - amountMasks);
    this.invulnerableTimer = 1.3; // 1.3 seconds invulnerability
    window.soundEngine.playHurt();

    if (this.masks <= 0) {
      this.dead = true;
      window.soundEngine.playGameOver();
    }
    return true;
  }

  addSoul(amount = 1) {
    if (this.soul < this.maxSoul) {
      this.soul = Math.min(this.maxSoul, this.soul + amount);
      window.soundEngine.playSoulAbsorb();
      if (this.soul === this.maxSoul) {
        window.soundEngine.playSoulFullReady();
      }
    }
  }

  focusHeal() {
    // Only restores ALL HP if soul is 10/10!
    if (this.soul >= this.maxSoul && this.masks < this.maxMasks) {
      this.masks = this.maxMasks;
      this.soul = 0;
      window.soundEngine.playFocusHeal();
      return true;
    }
    return false;
  }

  slash(projectiles, particles) {
    if (this.slashCooldown > 0 || this.dashing) return;

    this.slashing = true;
    this.slashTimer = 0;
    this.slashCooldown = 0.12;
    if (!this.attackHitEntities) this.attackHitEntities = new Set();
    else this.attackHitEntities.clear();

    if (this.powers.lightningAxe) {
      // Crackling Lightning Thunder Axe Slash!
      window.soundEngine.playThunder();
      const beamVx = (this.facingRight ? 1 : -1) * 16;
      projectiles.push(new Projectile(
        this.x + (this.facingRight ? this.width + 12 : -12),
        this.y + this.height / 2,
        beamVx,
        0,
        true,
        'lightning',
        25,
        18
      ));

      // Electric sparks
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(
          this.x + (this.facingRight ? this.width + 15 : -15),
          this.y + this.height / 2 + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 12 + (this.facingRight ? 6 : -6),
          (Math.random() - 0.5) * 12,
          Math.random() > 0.5 ? '#00e5ff' : '#ffd700',
          5,
          0.35
        ));
      }
    } else {
      window.soundEngine.playSlash();
      // Heavy Axe impact spark particles
      for (let i = 0; i < 6; i++) {
        particles.push(new Particle(
          this.x + (this.facingRight ? this.width + 15 : -15),
          this.y + this.height / 2,
          (Math.random() - 0.5) * 8 + (this.facingRight ? 4 : -4),
          (Math.random() - 0.5) * 8,
          '#ffd700',
          4,
          0.3
        ));
      }
    }
  }

  dash(particles) {
    if (this.dashCooldown > 0) return;

    this.dashing = true;
    this.dashTimer = 0.22;
    this.dashCooldown = 0.45;
    if (!this.dashHitEntities) this.dashHitEntities = new Set();
    else this.dashHitEntities.clear();
    this.vy = 0;
    this.dashSpeed = this.powers.tornadoDash ? 18.0 : 14.5;
    this.vx = (this.facingRight ? 1 : -1) * this.dashSpeed;

    if (this.powers.tornadoDash) {
      window.soundEngine.playTornado();
      // Whirlwind tornado particles
      for (let i = 0; i < 16; i++) {
        particles.push(new Particle(
          this.x + Math.random() * this.width,
          this.y + Math.random() * this.height,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          Math.random() > 0.5 ? '#3fe0d0' : '#ffffff',
          6,
          0.4
        ));
      }
    } else {
      window.soundEngine.playDash();
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(
          this.x + Math.random() * this.width,
          this.y + Math.random() * this.height,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          '#ffffff',
          4,
          0.3
        ));
      }
    }
  }

  castSpell(projectiles) {
    if (this.powers.voidVortex) {
      // Cast Abyssal Black Hole Singularity!
      window.soundEngine.playBlackHole();
      const vx = (this.facingRight ? 1 : -1) * 7;
      projectiles.push(new Projectile(
        this.x + (this.facingRight ? this.width + 16 : -16),
        this.y + this.height / 2 - 10,
        vx,
        0,
        true,
        'black_hole',
        35,
        24
      ));
    } else if (this.powers.meteorBlaster) {
      // Cast Explosive Magma Meteor!
      window.soundEngine.playMeteor();
      const vx = (this.facingRight ? 1 : -1) * 11;
      projectiles.push(new Projectile(
        this.x + (this.facingRight ? this.width + 14 : -14),
        this.y + this.height / 2,
        vx,
        0,
        true,
        'meteor',
        50,
        18
      ));
    }
  }

  triggerGroundSlam() {
    if (!this.grounded && !this.groundSlamming) {
      this.groundSlamming = true;
      if (!this.slamHitEntities) this.slamHitEntities = new Set();
      else this.slamHitEntities.clear();
      this.vy = 20;
      this.vx = 0;
    }
  }

  update(dt, input, platforms, particles, floatingTexts) {
    this.time += dt;

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    if (this.slashCooldown > 0) this.slashCooldown -= dt;
    if (this.dashCooldown > 0) this.dashCooldown -= dt;

    // Handle Slashing animation timer
    if (this.slashing) {
      this.slashTimer += dt;
      if (this.slashTimer >= this.slashDuration) {
        this.slashing = false;
      }
    }

    // Handle Dash duration
    if (this.dashing) {
      this.dashTimer -= dt;
      this.vy = 0;
      if (this.dashTimer <= 0) {
        this.dashing = false;
      }
    } else {
      // Normal horizontal movement
      if (input.left) {
        this.vx = -this.speed;
        this.facingRight = false;
      } else if (input.right) {
        this.vx = this.speed;
        this.facingRight = true;
      } else {
        this.vx *= 0.8;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;
      }

      // Gravity
      this.vy += this.gravity * 60 * dt;
      if (this.vy > 14) this.vy = 14;
    }

    // Ground Slam landing shockwave
    if (this.groundSlamming && this.grounded) {
      this.groundSlamming = false;
      window.soundEngine.playGroundSlam();
      floatingTexts.push(new FloatingText(this.powers.seismicSlam ? '🌋 TITAN SEISMIC EARTHQUAKE!' : 'SLAM SHOCKWAVE!', this.x - 30, this.y - 15, '#ffeb3b', 12));
      
      const pCount = this.powers.seismicSlam ? 32 : 16;
      for (let i = 0; i < pCount; i++) {
        particles.push(new Particle(
          this.x + this.width / 2 + (Math.random() - 0.5) * (this.powers.seismicSlam ? 160 : 40),
          this.y + this.height,
          (Math.random() - 0.5) * 16,
          -Math.random() * 10 - 2,
          Math.random() > 0.5 ? '#ff3d00' : '#ffd700',
          6,
          0.5
        ));
      }
    }

    // Move X & resolve platform collisions
    this.x += this.vx * 60 * dt;
    this.resolveCollisionX(platforms);

    // Move Y & resolve platform collisions
    this.y += this.vy * 60 * dt;
    this.grounded = false;
    this.resolveCollisionY(platforms);

    // Jump reset on ground
    if (this.grounded) {
      this.airJumpsLeft = this.powers.monarchTripleJump ? 2 : 0;
    }

    // Parry Shield Active Timer
    if (input.down && this.grounded) {
      this.parryActive = true;
    } else {
      this.parryActive = false;
    }
  }

  jump(particles = null) {
    if (this.grounded) {
      this.vy = this.jumpForce;
      this.grounded = false;
      this.airJumpsLeft = this.powers.monarchTripleJump ? 2 : 0;
      window.soundEngine.playJump();
    } else if (this.airJumpsLeft > 0) {
      this.vy = this.jumpForce * 0.94;
      this.airJumpsLeft--;
      window.soundEngine.playJump();
      if (particles) {
        // Celestial Monarch Wings burst particles
        for (let i = 0; i < 16; i++) {
          particles.push(new Particle(
            this.x + this.width / 2 + (Math.random() - 0.5) * 24,
            this.y + this.height - 4,
            (Math.random() - 0.5) * 12,
            Math.random() * 4 + 1,
            '#ffd700',
            5,
            0.4
          ));
        }
      }
    }
  }

  pogoBounce() {
    this.vy = this.jumpForce * 0.92;
    this.grounded = false;
    this.airJumpsLeft = this.powers.monarchTripleJump ? 2 : 0;
    window.soundEngine.playPogo();
  }

  resolveCollisionX(platforms) {
    for (const p of platforms) {
      if (this.checkOverlap(p)) {
        if (this.vx > 0) {
          this.x = p.x - this.width;
          this.vx = 0;
        } else if (this.vx < 0) {
          this.x = p.x + p.w;
          this.vx = 0;
        }
      }
    }
  }

  resolveCollisionY(platforms) {
    for (const p of platforms) {
      if (this.checkOverlap(p)) {
        if (this.vy > 0) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.grounded = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }
    }
  }

  checkOverlap(rect) {
    if (!rect) return false;
    const rw = rect.w !== undefined ? rect.w : (rect.width !== undefined ? rect.width : 0);
    const rh = rect.h !== undefined ? rect.h : (rect.height !== undefined ? rect.height : 0);
    const tw = this.w !== undefined ? this.w : (this.width !== undefined ? this.width : 0);
    const th = this.h !== undefined ? this.h : (this.height !== undefined ? this.height : 0);
    return (
      this.x < rect.x + rw &&
      this.x + tw > rect.x &&
      this.y < rect.y + rh &&
      this.y + th > rect.y
    );
  }

  getAttackHitbox() {
    if (!this.slashing) return null;
    const reach = 84; // Massive sweeping reach for Great Battle Axe
    return {
      x: this.facingRight ? this.x + 4 : this.x - reach + 26,
      y: this.y - 22,
      w: reach,
      h: this.height + 44,
      width: reach,
      height: this.height + 44
    };
  }

  draw(ctx) {
    Sprites.drawMarioKnight(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      {
        moving: Math.abs(this.vx) > 0.5,
        slashing: this.slashing,
        slashTimer: this.slashTimer,
        slashDuration: this.slashDuration
      },
      this.time,
      this.invulnerableTimer > 0,
      this.parryActive
    );
  }
}

// Small Monster Class
class SmallMonster {
  constructor(x, y, type = 'void_goomba') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.facingRight = false;
    this.alive = true;
    this.time = Math.random() * 10;
    this.hitFlashTimer = 0;

    // Attributes by monster type
    switch (type) {
      case 'void_goomba':
        this.width = 30;
        this.height = 28;
        this.hp = 25;
        this.speed = 1.2;
        this.flying = false;
        break;
      case 'silk_spiny':
        this.width = 32;
        this.height = 24;
        this.hp = 35;
        this.speed = 1.6;
        this.flying = false;
        break;
      case 'needle_wasp':
        this.width = 28;
        this.height = 28;
        this.hp = 20;
        this.speed = 2.4;
        this.flying = true;
        this.baseY = y;
        break;
      case 'piranha_pod':
        this.width = 28;
        this.height = 36;
        this.hp = 40;
        this.speed = 0;
        this.flying = false;
        break;
      case 'shield_beetle':
        this.width = 32;
        this.height = 30;
        this.hp = 50;
        this.speed = 1.4;
        this.flying = false;
        break;
      case 'shadow_wisp':
        this.width = 26;
        this.height = 26;
        this.hp = 18;
        this.speed = 2.0;
        this.flying = true;
        this.baseY = y;
        break;
      default:
        this.width = 28;
        this.height = 28;
        this.hp = 25;
        this.speed = 1.2;
        this.flying = false;
    }

    this.vx = -this.speed;
    this.vy = 0;
    this.shootTimer = 2.0 + Math.random() * 2.0;
  }

  takeDamage(amount, particles, floatingTexts) {
    if (this.hitFlashTimer > 0.04) return false;
    this.hp -= amount;
    this.hitFlashTimer = 0.18;
    window.soundEngine.playHit();
    floatingTexts.push(new FloatingText(`-${amount}`, this.x, this.y - 10, '#ffd700', 10));
    floatingTexts.push(new FloatingText('+1 SOUL ✦', this.x - 5, this.y - 25, '#3fe0d0', 11));

    // Soul orbs yield on EVERY SINGLE HIT!
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        (Math.random() - 0.5) * 6,
        -Math.random() * 5 - 1,
        '#3fe0d0',
        4,
        0.45,
        'soul_absorb'
      ));
    }

    if (this.hp <= 0) {
      this.alive = false;
      window.soundEngine.playMonsterDeath();
      for (let i = 0; i < 14; i++) {
        particles.push(new Particle(
          this.x + Math.random() * this.width,
          this.y + Math.random() * this.height,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          '#ff3d00',
          5,
          0.6
        ));
      }
      return true; // Monster dead
    }
    return false;
  }

  update(dt, player, platforms, projectiles) {
    this.time += dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    // Movement AI
    if (this.flying) {
      this.y = this.baseY + Math.sin(this.time * 3) * 35;
      this.x += this.vx * 60 * dt;
    } else {
      this.vy += 0.35 * 60 * dt; // Gravity
      this.x += this.vx * 60 * dt;
      this.y += this.vy * 60 * dt;

      // Platform collisions
      for (const p of platforms) {
        if (this.checkOverlap(p)) {
          if (this.vy > 0) {
            this.y = p.y - this.height;
            this.vy = 0;
          }
        }
      }
    }

    // Turn around at level borders
    if (this.x < 30) {
      this.x = 30;
      this.vx = Math.abs(this.vx);
      this.facingRight = true;
    } else if (this.x > 1350) {
      this.x = 1350;
      this.vx = -Math.abs(this.vx);
      this.facingRight = false;
    }

    // Ranged attacks for Piranha / Spiny / Wisp
    if (this.type === 'piranha_pod' || this.type === 'shadow_wisp') {
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = 2.4 + Math.random() * 1.5;
        const shootVx = (player.x > this.x ? 1 : -1) * 4.5;
        projectiles.push(new Projectile(
          this.x + this.width / 2,
          this.y + this.height / 2,
          shootVx,
          -1.5,
          false,
          'fireball',
          1,
          10
        ));
      }
    }
  }

  checkOverlap(rect) {
    if (!rect) return false;
    const rw = rect.w !== undefined ? rect.w : (rect.width !== undefined ? rect.width : 0);
    const rh = rect.h !== undefined ? rect.h : (rect.height !== undefined ? rect.height : 0);
    return (
      this.x < rect.x + rw &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rh &&
      this.y + this.height > rect.y
    );
  }

  draw(ctx) {
    Sprites.drawSmallMonster(
      ctx,
      this.type,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      this.time,
      this.hitFlashTimer > 0
    );
  }
}

// Giant Boss Class (8 Distinct Bosses)
class Boss {
  constructor(bossLevel, arenaX, arenaY) {
    this.bossLevel = bossLevel;
    this.x = arenaX;
    this.y = arenaY;
    this.vx = 0;
    this.vy = 0;
    this.alive = true;
    this.time = 0;
    this.hitFlashTimer = 0;
    this.facingRight = false;
    this.attackTimer = 1.5;
    this.phase = 1;

    // Boss Name & Config by Level
    const bossConfigs = [
      { name: 'GIGA GOOMBA COLOSSUS', title: 'Titan of the First Chasm', maxHp: 240, w: 90, h: 80, speed: 2.2 },
      { name: 'BROODMOTHER HORNET QUEEN', title: 'Matriarch of Needles', maxHp: 320, w: 80, h: 90, speed: 3.5 },
      { name: 'MOLTEN BOWSER KNIGHT', title: 'Lord of Magma Chitin', maxHp: 420, w: 95, h: 95, speed: 2.8 },
      { name: 'ARCANE MANTIS KAMEK', title: 'Grand Sorcerer of Silk', maxHp: 520, w: 85, h: 100, speed: 3.8 },
      { name: 'ABYSSAL CHEEP LEVIATHAN', title: 'Deep Sea Angler Terror', maxHp: 640, w: 110, h: 85, speed: 3.2 },
      { name: 'CRYSTAL KOOPA TITAN', title: 'Prismatic Gem Fortress', maxHp: 760, w: 105, h: 95, speed: 2.5 },
      { name: 'GRIMM BOWSER OF PHARLOOM', title: 'The Scarlet Nightmare Dragon', maxHp: 900, w: 95, h: 110, speed: 4.2 },
      { name: 'THE RADIANCE KOOPA GOD', title: 'Ascended Light of the Void', maxHp: 1100, w: 115, h: 115, speed: 4.5 }
    ];

    const cfg = bossConfigs[bossLevel - 1];
    this.name = cfg.name;
    this.title = cfg.title;
    this.maxHp = cfg.maxHp;
    this.hp = cfg.maxHp;
    this.width = cfg.w;
    this.height = cfg.h;
    this.baseSpeed = cfg.speed;

    window.soundEngine.playBossRoar();
  }

  takeDamage(amount, particles, floatingTexts) {
    if (this.hitFlashTimer > 0.05) return false;
    this.hp -= amount;
    this.hitFlashTimer = 0.22;
    window.soundEngine.playHit();
    floatingTexts.push(new FloatingText(`-${amount}`, this.x + this.width / 2, this.y - 15, '#ff4d61', 13));
    floatingTexts.push(new FloatingText('+1 SOUL ✦', this.x + this.width / 2, this.y - 32, '#3fe0d0', 12));

    // Soul orbs yield on every boss strike
    for (let i = 0; i < 4; i++) {
      particles.push(new Particle(
        this.x + this.width / 2,
        this.y + this.height / 2,
        (Math.random() - 0.5) * 8,
        -Math.random() * 6 - 2,
        '#3fe0d0',
        5,
        0.5,
        'soul_absorb'
      ));
    }

    // Phase shift at 50% HP
    if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
      this.phase = 2;
      window.soundEngine.playBossRoar();
      floatingTexts.push(new FloatingText('PHASE 2 ENRAGED!', this.x, this.y - 45, '#ffd700', 14));
    }

    if (this.hp <= 0) {
      this.alive = false;
      window.soundEngine.playBossRoar();
      // Grand boss burst
      for (let i = 0; i < 35; i++) {
        particles.push(new Particle(
          this.x + Math.random() * this.width,
          this.y + Math.random() * this.height,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          '#ffd700',
          6,
          1.2
        ));
      }
      return true; // Boss slain!
    }
    return false;
  }

  update(dt, player, platforms, projectiles, particles) {
    this.time += dt;
    if (this.hitFlashTimer > 0) this.hitFlashTimer -= dt;

    this.facingRight = player.x > this.x;
    this.attackTimer -= dt;

    const dx = player.x - this.x;
    const dy = player.y - this.y;

    // Execute Boss Attack Patterns
    if (this.attackTimer <= 0) {
      this.executeAttack(player, projectiles, particles);
      this.attackTimer = this.phase === 2 ? 1.6 : 2.4;
    }

    // Boss Level Specific AI Movement
    switch (this.bossLevel) {
      case 1: // Giga Goomba (Stomp & Leap)
        this.vy += 0.4 * 60 * dt;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 0.7 * 60 * dt;
        break;

      case 2: // Hornet Queen (Air Dash & Hover)
        this.y += Math.sin(this.time * 4) * 2;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 60 * dt * 0.5;
        break;

      case 3: // Molten Bowser (Shell Roll & Ground Dash)
        this.vy += 0.4 * 60 * dt;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 60 * dt;
        break;

      case 4: // Mantis Kamek (Teleport & Glide)
        this.y += Math.cos(this.time * 3) * 2.5;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 60 * dt * 0.4;
        break;

      case 5: // Abyssal Leviathan (Wave Breach & Submerge)
        this.y += Math.sin(this.time * 2.5) * 3.5;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 60 * dt * 0.6;
        break;

      case 6: // Crystal Koopa (Tremor Quake)
        this.vy += 0.4 * 60 * dt;
        this.x += (this.facingRight ? 1 : -1) * this.baseSpeed * 60 * dt * 0.5;
        break;

      case 7: // Grimm Bowser (Nightmare Swoop)
        this.y += Math.sin(this.time * 5) * 3;
        this.x += (dx / 40) * this.baseSpeed;
        break;

      case 8: // Radiance Koopa God (Ascended Solar Halo)
        this.y += Math.sin(this.time * 3.5) * 3.0;
        this.x += (dx / 50) * this.baseSpeed;
        break;
    }

    // Platform collisions
    this.y += this.vy * 60 * dt;
    for (const p of platforms) {
      if (this.checkOverlap(p)) {
        if (this.vy > 0) {
          this.y = p.y - this.height;
          this.vy = 0;
        }
      }
    }
  }

  executeAttack(player, projectiles, particles) {
    const dir = this.facingRight ? 1 : -1;

    switch (this.bossLevel) {
      case 1: // Spore eruption shockwave
        for (let a = -0.5; a <= 0.5; a += 0.25) {
          projectiles.push(new Projectile(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.sin(a) * 6 * dir,
            -Math.cos(a) * 6,
            false,
            'boss_spore',
            1,
            9
          ));
        }
        break;

      case 2: // Needle Barrage
        for (let i = 0; i < 3; i++) {
          projectiles.push(new Projectile(
            this.x + (this.facingRight ? this.width : 0),
            this.y + 20 + i * 18,
            dir * 8,
            (i - 1) * 2,
            false,
            'boss_needle',
            1,
            8
          ));
        }
        break;

      case 3: // Bowser Fireball Breath
        for (let i = 0; i < 4; i++) {
          projectiles.push(new Projectile(
            this.x + (this.facingRight ? this.width : 0),
            this.y + 30,
            dir * (6 + i * 1.5),
            (Math.random() - 0.5) * 3,
            false,
            'boss_fire',
            1,
            11
          ));
        }
        break;

      case 4: // Mantis Arcane Blast
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          projectiles.push(new Projectile(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.cos(a) * 5,
            Math.sin(a) * 5,
            false,
            'boss_spore',
            1,
            8
          ));
        }
        break;

      case 5: // Bubble mines & Angler surge
        for (let i = 0; i < 5; i++) {
          projectiles.push(new Projectile(
            this.x + Math.random() * this.width,
            this.y + this.height / 2,
            (Math.random() - 0.5) * 7,
            -Math.random() * 8,
            false,
            'boss_needle',
            1,
            8
          ));
        }
        break;

      case 6: // Crystal Gem Shards
        for (let a = -0.6; a <= 0.6; a += 0.3) {
          projectiles.push(new Projectile(
            this.x + this.width / 2,
            this.y + 10,
            Math.sin(a) * 8 * dir,
            -Math.abs(Math.cos(a)) * 7,
            false,
            'boss_sun_lance',
            1,
            10
          ));
        }
        break;

      case 7: // Grimm Scarlet Bat Storm
        for (let i = 0; i < 6; i++) {
          projectiles.push(new Projectile(
            this.x + this.width / 2,
            this.y + 20 + i * 10,
            dir * (7 + i * 0.8),
            Math.sin(i) * 3,
            false,
            'boss_fire',
            1,
            10
          ));
        }
        break;

      case 8: // Radiance Koopa God Sun Lance Barrage
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
          projectiles.push(new Projectile(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.cos(a) * 7,
            Math.sin(a) * 7,
            false,
            'boss_sun_lance',
            1,
            12
          ));
        }
        break;
    }
  }

  checkOverlap(rect) {
    if (!rect) return false;
    const rw = rect.w !== undefined ? rect.w : (rect.width !== undefined ? rect.width : 0);
    const rh = rect.h !== undefined ? rect.h : (rect.height !== undefined ? rect.height : 0);
    const tw = this.w !== undefined ? this.w : (this.width !== undefined ? this.width : 0);
    const th = this.h !== undefined ? this.h : (this.height !== undefined ? this.height : 0);
    return (
      this.x < rect.x + rw &&
      this.x + tw > rect.x &&
      this.y < rect.y + rh &&
      this.y + th > rect.y
    );
  }

  draw(ctx) {
    Sprites.drawBoss(
      ctx,
      this.bossLevel,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      this.time,
      this.hitFlashTimer > 0,
      this.phase
    );
  }
}
