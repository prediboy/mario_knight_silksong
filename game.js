// Mario Knight Silksong - Main Game Engine & Controller

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.hpText = document.getElementById('hp-text');
    this.maskElements = [
      document.getElementById('mask-0'),
      document.getElementById('mask-1'),
      document.getElementById('mask-2'),
      document.getElementById('mask-3'),
      document.getElementById('mask-4'),
      document.getElementById('mask-5'),
    ];
    this.soulVal = document.getElementById('soul-val');
    this.soulLiquid = document.getElementById('soul-liquid');
    this.soulVessel = document.getElementById('soul-vessel');
    this.focusHint = document.getElementById('focus-hint');
    this.levelBadge = document.getElementById('level-badge');
    this.timerDisplay = document.getElementById('timer-display');
    this.distanceCurrent = document.getElementById('distance-current');
    this.distanceTarget = document.getElementById('distance-target');
    this.distanceBarFill = document.getElementById('distance-bar-fill');
    this.distanceMarioPin = document.getElementById('distance-mario-pin');
    this.bossHud = document.getElementById('boss-hud');
    this.bossName = document.getElementById('boss-name');
    this.bossSubtitle = document.getElementById('boss-subtitle');
    this.bossBarFill = document.getElementById('boss-bar-fill');
    this.toastContainer = document.getElementById('toast-container');

    // Modals
    this.modalStart = document.getElementById('modal-start');
    this.modalPause = document.getElementById('modal-pause');
    this.modalLevelClear = document.getElementById('modal-level-clear');
    this.modalGameOver = document.getElementById('modal-game-over');
    this.modalGameWin = document.getElementById('modal-game-win');

    // Stats UI in Modals
    this.statTime = document.getElementById('stat-time');
    this.statKills = document.getElementById('stat-kills');
    this.statNextDist = document.getElementById('stat-next-dist');
    this.clearLevelTitle = document.getElementById('clear-level-title');
    this.rewardIcon = document.getElementById('reward-icon');
    this.rewardName = document.getElementById('reward-name');
    this.rewardDesc = document.getElementById('reward-desc');
    this.deathReason = document.getElementById('death-reason');
    this.deathLevelText = document.getElementById('death-level-text');

    // Game Core State
    this.state = 'START'; // START, PLAYING, BOSS, LEVEL_CLEAR, GAME_OVER, WIN
    this.paused = false;
    this.currentLevel = 1;
    this.levelTimer = 35.0; // Strict 35-Second Rush Countdown!
    this.traveledKm = 0.0;
    this.levelKills = 0;
    this.cameraX = 0;
    this.screenShake = 0;

    // Entities & Subsystems
    this.levelManager = new LevelManager();
    this.player = new Player(120, 460);
    this.monsters = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.activeBoss = null;

    // Input state
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      slash: false,
      dash: false,
      spell: false,
      heal: false
    };

    // Timing loop
    this.lastTime = performance.now();
    this.resizeCanvas();
    
    // Viewport & Auto-rotation handling
    const handleViewportChange = () => {
      this.resizeCanvas();
      setTimeout(() => this.resizeCanvas(), 60);
      setTimeout(() => this.resizeCanvas(), 250);
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleViewportChange);
    }

    this.bindEvents();
    this.bindTouchControls();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  togglePause() {
    if (this.state !== 'PLAYING' && this.state !== 'BOSS') return;
    this.paused = !this.paused;
    window.soundEngine.playPause();
    if (this.paused) {
      if (this.modalPause) this.modalPause.classList.add('active');
      window.soundEngine.stopBGM();
    } else {
      if (this.modalPause) this.modalPause.classList.remove('active');
      window.soundEngine.startBGM(this.state === 'BOSS' ? 'boss' : 'ambient');
      this.lastTime = performance.now();
    }
  }

  bindEvents() {
    // Keyboard Input Listeners
    window.addEventListener('keydown', (e) => {
      window.soundEngine.init();
      const code = e.code;

      // Pause toggle (P or Escape)
      if (code === 'KeyP' || code === 'Escape') {
        e.preventDefault();
        this.togglePause();
        return;
      }

      // Modal keyboard fast-advance
      if (this.state === 'START') {
        if (code === 'Space' || code === 'Enter' || code === 'KeyW' || code === 'KeyJ' || code === 'KeyZ') {
          e.preventDefault();
          window.soundEngine.init();
          this.modalStart.classList.remove('active');
          this.startLevel(1);
          return;
        }
      } else if (this.state === 'GAME_OVER') {
        if (code === 'Space' || code === 'Enter' || code === 'KeyW' || code === 'KeyJ' || code === 'KeyZ') {
          e.preventDefault();
          this.modalGameOver.classList.remove('active');
          this.startLevel(this.currentLevel);
          return;
        }
      } else if (this.state === 'LEVEL_CLEAR') {
        if (code === 'Space' || code === 'Enter' || code === 'KeyW' || code === 'KeyJ' || code === 'KeyZ') {
          e.preventDefault();
          this.modalLevelClear.classList.remove('active');
          if (this.currentLevel < 8) {
            this.startLevel(this.currentLevel + 1);
          } else {
            this.showGameWin();
          }
          return;
        }
      }

      // Intercept Enter key during gameplay
      if (code === 'Enter') {
        e.preventDefault();
        if (document.activeElement) document.activeElement.blur();
        return;
      }

      // Blur any button currently focused to prevent Space/Enter from triggering button clicks!
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.blur();
      }

      // Prevent scrolling / default browser actions for game keys
      if ([
        'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab',
        'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyK', 'KeyL', 'KeyZ', 'KeyX', 'KeyC', 'KeyF', 'KeyE', 'KeyQ', 'KeyH', 'KeyP'
      ].includes(code)) {
        e.preventDefault();
      }

      if (this.paused) return;

      if (code === 'ArrowLeft' || code === 'KeyA') this.input.left = true;
      if (code === 'ArrowRight' || code === 'KeyD') this.input.right = true;
      if (code === 'ArrowUp' || code === 'KeyW' || code === 'KeyK' || code === 'Space') {
        if (!this.input.jump && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.jump(this.particles);
        }
        this.input.jump = true;
      }
      if (code === 'ArrowDown' || code === 'KeyS') {
        this.input.down = true;
        if (!this.player.grounded && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.triggerGroundSlam();
        }
      }
      // Axe Slash Attack keys (J, Z, F, X)
      if (code === 'KeyJ' || code === 'KeyZ' || code === 'KeyF' || code === 'KeyX') {
        if (!this.input.slash && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.slash(this.projectiles, this.particles);
        }
        this.input.slash = true;
      }
      // Dash keys (L, Shift, C)
      if (code === 'KeyL' || code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyC') {
        if (!this.input.dash && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.dash(this.particles);
        }
        this.input.dash = true;
      }
      // Spell keys (Q, R, E)
      if (code === 'KeyQ' || code === 'KeyR' || code === 'KeyE') {
        if (!this.input.spell && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.castSpell(this.projectiles);
        }
        this.input.spell = true;
      }
      // Heal keys (H, U)
      if (code === 'KeyH' || code === 'KeyU') {
        if (!this.input.heal && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          if (this.player.focusHeal()) {
            this.showToast('✨ 10/10 SOUL FOCUSED: FULL HP RESTORED!');
            this.updateHPUI();
            this.updateSoulUI();
          }
        }
        this.input.heal = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      if (code === 'ArrowLeft' || code === 'KeyA') this.input.left = false;
      if (code === 'ArrowRight' || code === 'KeyD') this.input.right = false;
      if (code === 'ArrowUp' || code === 'KeyW' || code === 'KeyK' || code === 'Space') this.input.jump = false;
      if (code === 'ArrowDown' || code === 'KeyS') this.input.down = false;
      if (code === 'KeyJ' || code === 'KeyZ' || code === 'KeyF' || code === 'KeyX') this.input.slash = false;
      if (code === 'KeyL' || code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyC') this.input.dash = false;
      if (code === 'KeyQ' || code === 'KeyR' || code === 'KeyE') this.input.spell = false;
      if (code === 'KeyH' || code === 'KeyU') this.input.heal = false;
    });

    // Mouse controls on canvas:
    // Left Click = Silksong Great Axe Slash!
    // Right Click = Tornado Silk Dash!
    // Middle Click = Soul Spell (Meteor / Void)!
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.paused) return;
      if (this.state === 'PLAYING' || this.state === 'BOSS') {
        if (e.button === 0) {
          this.player.slash(this.projectiles, this.particles);
        } else if (e.button === 2) {
          this.player.dash(this.particles);
        } else if (e.button === 1) {
          this.player.castSpell(this.projectiles);
        }
      }
    });

    window.addEventListener('contextmenu', (e) => {
      if (this.state === 'PLAYING' || this.state === 'BOSS') {
        e.preventDefault();
      }
    });

    // Pause Toggle Button in Header
    const btnPause = document.getElementById('btn-pause');
    if (btnPause) {
      btnPause.addEventListener('click', (e) => {
        e.target.blur();
        this.togglePause();
      });
    }

    // Sound Toggle Button
    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', (e) => {
      e.target.blur();
      const isAudible = window.soundEngine.toggleMute();
      btnSound.textContent = isAudible ? '🔊' : '🔇';
    });

    // Modal Button Helper with instant touch response & debouncing
    const addAction = (id, fn) => {
      const el = document.getElementById(id);
      if (!el) return;

      let lastTriggerTime = 0;
      const trigger = (e) => {
        const now = performance.now();
        if (now - lastTriggerTime < 350) return; // Prevent double trigger from touch+click
        lastTriggerTime = now;

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        try { window.soundEngine.init(); } catch (err) {}
        if (document.activeElement) document.activeElement.blur();
        fn();
      };

      el.addEventListener('pointerup', trigger);
      el.addEventListener('touchend', trigger, { passive: false });
      el.addEventListener('click', trigger);
    };

    // Pause Modal Buttons
    addAction('btn-resume', () => {
      this.togglePause();
    });

    addAction('btn-restart-level', () => {
      if (this.modalPause) this.modalPause.classList.remove('active');
      this.paused = false;
      this.startLevel(this.currentLevel);
    });

    // Start Journey Buttons (Top & Bottom)
    const handleStartGame = () => {
      try { window.soundEngine.init(); } catch (err) {}
      if (this.modalStart) this.modalStart.classList.remove('active');
      this.startLevel(1);
    };
    addAction('btn-play-game', handleStartGame);
    addAction('btn-play-game-bottom', handleStartGame);

    // Next Level Button
    addAction('btn-next-level', () => {
      if (this.modalLevelClear) this.modalLevelClear.classList.remove('active');
      if (this.currentLevel < 8) {
        this.startLevel(this.currentLevel + 1);
      } else {
        this.showGameWin();
      }
    });

    // Retry Level Button
    addAction('btn-retry', () => {
      if (this.modalGameOver) this.modalGameOver.classList.remove('active');
      this.startLevel(this.currentLevel);
    });

    // Play Again (After Win) Button
    addAction('btn-play-again', () => {
      if (this.modalGameWin) this.modalGameWin.classList.remove('active');
      this.startLevel(1);
    });
  }

  bindTouchControls() {
    // =========================================
    // 1. VIRTUAL ANALOG JOYSTICK (LEFT THUMB)
    // =========================================
    const joystickZone = document.getElementById('joystick-zone');
    const joystickBase = document.getElementById('joystick-base');
    const joystickKnob = document.getElementById('joystick-knob');

    let joystickActive = false;
    let joystickTouchId = null;
    let baseCenterX = 0;
    let baseCenterY = 0;
    const maxRadius = 38;

    const updateJoystickPosition = (touchX, touchY) => {
      let dx = touchX - baseCenterX;
      let dy = touchY - baseCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance > maxRadius) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * maxRadius;
        dy = Math.sin(angle) * maxRadius;
      }

      if (joystickKnob) {
        joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      // Horizontal Run Deadzone
      if (dx < -10) {
        this.input.left = true;
        this.input.right = false;
      } else if (dx > 10) {
        this.input.right = true;
        this.input.left = false;
      } else {
        this.input.left = false;
        this.input.right = false;
      }

      // Vertical Down / Ground Slam Deadzone
      if (dy > 18) {
        this.input.down = true;
        if (!this.player.grounded && (this.state === 'PLAYING' || this.state === 'BOSS')) {
          this.player.triggerGroundSlam();
        }
      } else {
        this.input.down = false;
      }
    };

    const startJoystick = (touchX, touchY, id) => {
      joystickActive = true;
      joystickTouchId = id;
      try { window.soundEngine.init(); } catch (err) {}

      if (joystickBase) {
        const rect = joystickBase.getBoundingClientRect();
        baseCenterX = rect.left + rect.width / 2;
        baseCenterY = rect.top + rect.height / 2;
        joystickBase.classList.add('active');
      }
      if (joystickKnob) {
        joystickKnob.style.transition = 'none';
      }
      updateJoystickPosition(touchX, touchY);
    };

    const endJoystick = () => {
      if (!joystickActive) return;
      joystickActive = false;
      joystickTouchId = null;
      this.input.left = false;
      this.input.right = false;
      this.input.down = false;

      if (joystickBase) joystickBase.classList.remove('active');
      if (joystickKnob) {
        joystickKnob.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        joystickKnob.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { if (joystickKnob) joystickKnob.style.transition = ''; }, 160);
      }
    };

    if (joystickZone) {
      joystickZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.changedTouches && e.changedTouches.length > 0) {
          const t = e.changedTouches[0];
          startJoystick(t.clientX, t.clientY, t.identifier);
        }
      }, { passive: false });

      joystickZone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!joystickActive) return;
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === joystickTouchId) {
            updateJoystickPosition(e.touches[i].clientX, e.touches[i].clientY);
            break;
          }
        }
      }, { passive: false });

      joystickZone.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        endJoystick();
      }, { passive: false });

      joystickZone.addEventListener('touchcancel', (e) => {
        endJoystick();
      }, { passive: false });

      // Mouse drag fallback for desktop testing
      joystickZone.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        startJoystick(e.clientX, e.clientY, 'mouse');
        const onMouseMove = (ev) => {
          if (joystickActive) updateJoystickPosition(ev.clientX, ev.clientY);
        };
        const onMouseUp = () => {
          endJoystick();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    // =========================================
    // 2. ARCADE COMBAT BUTTONS (RIGHT THUMB)
    // =========================================
    const bindArcadeButton = (id, actionFn) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        try { window.soundEngine.init(); } catch (err) {}
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 120);

        if (this.state === 'PLAYING' || this.state === 'BOSS' || id === 'touch-pause') {
          actionFn();
        }
      };

      el.addEventListener('touchstart', trigger, { passive: false });
      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return; // Handled by touchstart
        trigger(e);
      });
    };

    // Button A: Super Jump / Monarch Triple Jump
    bindArcadeButton('touch-jump', () => {
      this.player.jump(this.particles);
    });

    // Button B: Great Axe Cleave / Slash
    bindArcadeButton('touch-slash', () => {
      this.player.slash(this.projectiles, this.particles);
    });

    // Button X: Tornado Silk Dash
    bindArcadeButton('touch-dash', () => {
      this.player.dash(this.particles);
    });

    // Button Y: Meteor Magma / Void Spell
    bindArcadeButton('touch-spell', () => {
      this.player.castSpell(this.projectiles);
    });

    // Soul Focus Full Heal (10/10)
    bindArcadeButton('touch-heal', () => {
      if (this.player.focusHeal()) {
        this.showToast('✨ 10/10 SOUL FOCUSED: FULL HP RESTORED!');
        this.updateHPUI();
        this.updateSoulUI();
      }
    });

    // Pause Game Button
    bindArcadeButton('touch-pause', () => {
      this.togglePause();
    });

    // Global touch cleanup
    window.addEventListener('touchend', (e) => {
      if (e.touches && e.touches.length === 0) {
        endJoystick();
      }
    });

    window.addEventListener('touchcancel', () => {
      endJoystick();
    });
  }

  startLevel(levelNum) {
    this.currentLevel = levelNum;
    this.levelTimer = 35.0; // Intense 35s Hardcore Speedrun Countdown!
    this.traveledKm = 0.0;
    this.levelKills = 0;
    this.screenShake = 0.3;
    this.paused = false;

    // Load level map & start player at the beginning of the level
    this.levelManager.loadLevel(levelNum);
    this.player.resetPosition(100, 460);
    this.monsters = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.activeBoss = null;

    // Hornet cage appears strictly after defeating the final boss (Level 8)
    this.hornetCage = null;

    // Initial monsters in 4400px traversal path
    const types = this.levelManager.config.monsterTypes;
    for (let i = 0; i < 11; i++) {
      const sx = 380 + i * 350;
      const type = types[i % types.length];
      const sy = (type === 'needle_wasp' || type === 'shadow_wisp') ? 240 + Math.random() * 100 : 490;
      this.monsters.push(new SmallMonster(sx, sy, type));
    }

    // UI Updates
    this.levelBadge.textContent = `LEVEL ${levelNum}: ${this.levelManager.config.name.toUpperCase()}`;
    this.distanceTarget.textContent = `${this.levelManager.config.targetKm.toFixed(1)}`;
    this.distanceCurrent.textContent = `0.0`;
    this.distanceBarFill.style.width = '0%';
    this.distanceMarioPin.style.left = '0%';
    this.bossHud.classList.add('hidden');

    this.updateHPUI();
    this.updateSoulUI();
    this.updatePowerIconsUI();

    this.state = 'PLAYING';
    window.soundEngine.startBGM('ambient');
    this.showToast(`⚡ 35s HARDCORE RUSH: ${this.levelManager.config.name} ⚡`);
  }

  handleBossDefeat() {
    if (this.currentLevel === 8) {
      // Spawn Hornet's Trapping Cage right where Radiance Koopa God was slain!
      const spawnX = this.activeBoss ? Math.max(this.levelManager.bossArenaStartX + 80, Math.min(this.levelManager.levelWidth - 250, this.activeBoss.x)) : (this.levelManager.bossSpawnX + 240);
      this.hornetCage = new HornetCage(spawnX, 420);
      this.screenShake = 1.0;
      window.soundEngine.playBossRoar();
      window.soundEngine.playPowerUp();
      
      // Giant radiant summoning burst
      for (let i = 0; i < 35; i++) {
        this.particles.push(new Particle(
          spawnX + 35,
          465,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          Math.random() > 0.5 ? '#ffd700' : '#ff4081',
          6,
          1.2
        ));
      }
      this.floatingTexts.push(new FloatingText('🪡 HORNET TRAPPED IN CAGE! BREAK IT! ⚔️', spawnX - 30, 370, '#ffd700', 14));
      this.showToast('⚔️ THE RADIANCE GOD IS SLAIN! THE CAGE APPEARED! STRIKE IT WITH YOUR NAIL TO FREE HORNET! ⚔️');
    } else {
      this.showLevelClear();
    }
  }

  updateHPUI() {
    this.hpText.textContent = `(${this.player.masks}/${this.player.maxMasks})`;
    for (let i = 0; i < 6; i++) {
      const maskEl = this.maskElements[i];
      if (i < this.player.masks) {
        maskEl.className = 'mask full';
      } else {
        maskEl.className = 'mask empty';
      }
    }
  }

  updateSoulUI() {
    this.soulVal.textContent = this.player.soul;
    const pct = (this.player.soul / this.player.maxSoul) * 100;
    this.soulLiquid.style.height = `${pct}%`;

    if (this.player.soul >= 10) {
      this.soulVessel.classList.add('ready');
      this.focusHint.classList.add('visible');
    } else {
      this.soulVessel.classList.remove('ready');
      this.focusHint.classList.remove('visible');
    }
  }

  updatePowerIconsUI() {
    const powerMap = [
      { id: 'power-p1', unlocked: this.player.powers.lightningAxe },
      { id: 'power-p2', unlocked: this.player.powers.tornadoDash },
      { id: 'power-p3', unlocked: this.player.powers.meteorBlaster },
      { id: 'power-p4', unlocked: this.player.powers.monarchTripleJump },
      { id: 'power-p5', unlocked: this.player.powers.aegisReflect },
      { id: 'power-p6', unlocked: this.player.powers.seismicSlam },
      { id: 'power-p7', unlocked: this.player.powers.voidVortex },
    ];

    powerMap.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) {
        if (p.unlocked) {
          el.className = 'power-icon unlocked';
        } else {
          el.className = 'power-icon locked';
        }
      }
    });
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  showGameOver(reason) {
    this.state = 'GAME_OVER';
    window.soundEngine.stopBGM();
    this.deathReason.textContent = reason;
    this.deathLevelText.textContent = `Level ${this.currentLevel} (${this.levelManager.config.name})`;
    this.modalGameOver.classList.add('active');
  }

  showLevelClear() {
    this.state = 'LEVEL_CLEAR';
    window.soundEngine.stopBGM();
    window.soundEngine.playVictory();

    // Award Power
    this.player.unlockPower(this.currentLevel);
    this.updatePowerIconsUI();

    const reward = this.levelManager.config.reward;
    this.clearLevelTitle.textContent = `LEVEL ${this.currentLevel} CONQUERED!`;
    this.rewardIcon.textContent = reward.icon;
    this.rewardName.textContent = reward.name;
    this.rewardDesc.textContent = reward.desc;

    this.statTime.textContent = `${this.levelTimer.toFixed(1)}s`;
    this.statKills.textContent = `${this.levelKills}`;
    this.statNextDist.textContent = this.currentLevel < 8 ? `${(1000 + this.currentLevel * 15)} km` : 'FINAL';

    this.modalLevelClear.classList.add('active');
  }

  showGameWin() {
    this.state = 'WIN';
    window.soundEngine.stopBGM();
    window.soundEngine.playVictory();
    this.modalGameWin.classList.add('active');
  }

  // Main Game Loop
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    if (!this.paused && (this.state === 'PLAYING' || this.state === 'BOSS')) {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Timer Countdown (35 seconds)
    this.levelTimer -= dt;
    this.timerDisplay.textContent = Math.max(0, this.levelTimer).toFixed(1);

    if (this.levelTimer <= 8.0) {
      this.timerDisplay.parentElement.classList.add('danger');
    } else {
      this.timerDisplay.parentElement.classList.remove('danger');
    }

    if (this.levelTimer <= 0) {
      this.showGameOver('TIME RAN OUT! You ran out of your 35 seconds.');
      return;
    }

    // 2. Traveled Distance Calculation
    const targetKm = this.levelManager.config.targetKm;
    const progressPct = Math.min(1, Math.max(0, this.player.x / this.levelManager.bossArenaStartX));
    this.traveledKm = progressPct * targetKm;
    this.distanceCurrent.textContent = this.traveledKm.toFixed(1);
    this.distanceBarFill.style.width = `${progressPct * 100}%`;
    this.distanceMarioPin.style.left = `${progressPct * 100}%`;

    // 3. Boss Arena Trigger & Locking at the end of the level
    if (this.state === 'PLAYING' && this.player.x >= this.levelManager.bossArenaStartX - 20) {
      this.state = 'BOSS';
      this.monsters = []; // Clear monsters for a clean 1-on-1 boss arena
      window.soundEngine.startBGM('boss');
      this.activeBoss = new Boss(this.currentLevel, this.levelManager.bossSpawnX, this.levelManager.bossSpawnY);
      this.bossHud.classList.remove('hidden');
      this.bossName.textContent = this.activeBoss.name;
      this.bossSubtitle.textContent = this.activeBoss.title.toUpperCase();
      this.bossBarFill.style.width = '100%';
      this.screenShake = 0.8;
      this.showToast(`🔒 TITAN ENCOUNTER: ${this.activeBoss.name}! 🔒`);
    }

    // 4. Update Player
    this.player.update(dt, this.input, this.levelManager.platforms, this.particles, this.floatingTexts);

    // Keep Player and Boss inside the arena during Boss fight
    if (this.state === 'BOSS') {
      this.player.x = Math.max(this.levelManager.bossArenaStartX + 10, Math.min(this.player.x, this.levelManager.levelWidth - this.player.width - 20));
      if (this.activeBoss && this.activeBoss.alive) {
        this.activeBoss.x = Math.max(this.levelManager.bossArenaStartX + 40, Math.min(this.activeBoss.x, this.levelManager.levelWidth - this.activeBoss.width - 40));
      }
    } else {
      this.player.x = Math.max(20, Math.min(this.player.x, this.levelManager.levelWidth - this.player.width - 20));
    }

    // Player Spike Hazard Check
    for (const s of this.levelManager.spikes) {
      if (this.player.checkOverlap(s)) {
        if (this.player.takeDamage(2)) {
          this.screenShake = 0.5;
          this.player.pogoBounce();
          this.updateHPUI();
        }
      }
    }

    // Player Pit Fall Check
    if (this.player.y > 650) {
      this.showGameOver('You plunged into the endless black void of Pharloom.');
      return;
    }

    // Player Death Check
    if (this.player.dead) {
      this.showGameOver('Your Life Masks shattered completely from monster bites.');
      return;
    }

    // 5. Update Monsters & Spawner
    this.levelManager.updateMonsterSpawns(dt, this.player, this.monsters, this.state === 'BOSS');

    const attackBox = this.player.getAttackHitbox();

    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      m.update(dt, this.player, this.levelManager.platforms, this.projectiles);

      // Monster Attack / Slash Collision with Player (Single hit per swing)
      if (attackBox && !this.player.attackHitEntities.has(m) && m.checkOverlap(attackBox)) {
        this.player.attackHitEntities.add(m);
        const monsterDied = m.takeDamage(this.player.damage, this.particles, this.floatingTexts);
        this.screenShake = 0.2;
        this.player.addSoul(1); // Soul gained on hit!
        this.updateSoulUI();
        if (this.player.vy > 0) this.player.pogoBounce();

        if (monsterDied) {
          this.levelKills++;
          this.monsters.splice(i, 1);
          continue;
        }
      }

      // Tornado Dash shred monsters (Single hit per dash)
      if (this.player.dashing && this.player.powers.tornadoDash && !this.player.dashHitEntities.has(m) && this.player.checkOverlap(m)) {
        this.player.dashHitEntities.add(m);
        const died = m.takeDamage(25, this.particles, this.floatingTexts);
        this.player.addSoul(1);
        this.updateSoulUI();
        if (died) {
          this.levelKills++;
          this.monsters.splice(i, 1);
          continue;
        }
      }

      // Ground slam hit monsters (Single hit per slam)
      if (this.player.groundSlamming && !this.player.slamHitEntities.has(m) && (this.player.checkOverlap(m) || (this.player.powers.seismicSlam && Math.abs(m.x - this.player.x) < 140))) {
        this.player.slamHitEntities.add(m);
        const died = m.takeDamage(40, this.particles, this.floatingTexts);
        this.player.addSoul(1);
        this.updateSoulUI();
        if (died) {
          this.levelKills++;
          this.monsters.splice(i, 1);
          continue;
        }
      }

      // Monster Bites Player -> Loses 2/6 HP (2 Masks)
      if (this.player.checkOverlap(m)) {
        if (this.player.takeDamage(2)) {
          this.screenShake = 0.5;
          this.updateHPUI();
          this.floatingTexts.push(new FloatingText('💥 BITTEN! -2/6 HP', this.player.x - 20, this.player.y - 20, '#ff4d61', 12));
          this.showToast(`⚠️ BITTEN BY MONSTER! -2/6 HP (${this.player.masks}/6 MASKS LEFT)`);
        }
      }

      // Despawn far away monsters
      if (Math.abs(m.x - this.player.x) > 1200) {
        this.monsters.splice(i, 1);
      }
    }

    // 6. Update Boss
    if (this.activeBoss && this.activeBoss.alive) {
      this.activeBoss.update(dt, this.player, this.levelManager.platforms, this.projectiles, this.particles);

      // Boss Health Bar UI
      const bossHpPct = Math.max(0, (this.activeBoss.hp / this.activeBoss.maxHp) * 100);
      this.bossBarFill.style.width = `${bossHpPct}%`;

      // Player melee attacks Boss (Single hit per swing)
      if (attackBox && !this.player.attackHitEntities.has(this.activeBoss) && this.activeBoss.checkOverlap(attackBox)) {
        this.player.attackHitEntities.add(this.activeBoss);
        const bossDied = this.activeBoss.takeDamage(this.player.damage, this.particles, this.floatingTexts);
        this.screenShake = 0.3;
        this.player.addSoul(1); // Soul gained on Boss hit!
        this.updateSoulUI();
        if (this.player.vy > 0) this.player.pogoBounce();

        if (bossDied) {
          this.handleBossDefeat();
        }
      }

      // Tornado Dash vs Boss
      if (this.player.dashing && this.player.powers.tornadoDash && !this.player.dashHitEntities.has(this.activeBoss) && this.player.checkOverlap(this.activeBoss)) {
        this.player.dashHitEntities.add(this.activeBoss);
        const bossDied = this.activeBoss.takeDamage(25, this.particles, this.floatingTexts);
        this.player.addSoul(1);
        this.updateSoulUI();
        if (bossDied) {
          this.handleBossDefeat();
        }
      }

      // Ground Slam vs Boss
      if (this.player.groundSlamming && !this.player.slamHitEntities.has(this.activeBoss) && (this.player.checkOverlap(this.activeBoss) || (this.player.powers.seismicSlam && Math.abs(this.activeBoss.x - this.player.x) < 140))) {
        this.player.slamHitEntities.add(this.activeBoss);
        const bossDied = this.activeBoss.takeDamage(40, this.particles, this.floatingTexts);
        this.player.addSoul(1);
        this.updateSoulUI();
        if (bossDied) {
          this.handleBossDefeat();
        }
      }

      // Boss bites / hits Player
      if (this.player.checkOverlap(this.activeBoss)) {
        if (this.player.takeDamage(3)) {
          this.screenShake = 0.5;
          this.updateHPUI();
          this.floatingTexts.push(new FloatingText('TITAN CRUSH! -3/6 HP', this.player.x - 25, this.player.y - 25, '#ff4d61', 12));
        }
      }
    }

    // 6.5 Update Hornet Cage (Level 8 Climax)
    if (this.hornetCage) {
      this.hornetCage.update(dt, this.particles);

      // Player strikes Hornet Cage with Nail / Axe to free Hornet!
      if (!this.hornetCage.broken && attackBox && !this.player.attackHitEntities.has(this.hornetCage) && this.hornetCage.checkOverlap(attackBox)) {
        this.player.attackHitEntities.add(this.hornetCage);
        const broken = this.hornetCage.takeDamage(1, this.particles, this.floatingTexts);
        this.screenShake = 0.4;
        if (this.player.vy > 0) this.player.pogoBounce();
        if (broken) {
          this.screenShake = 1.3;
          window.soundEngine.playVictory();
          this.showToast('✨ HORNET FREED! PHARLOOM IS SAVED! ✨');
          setTimeout(() => this.showGameWin(), 2400);
        }
      }

      // Tornado Dash vs Cage
      if (!this.hornetCage.broken && this.player.dashing && this.player.powers.tornadoDash && !this.player.dashHitEntities.has(this.hornetCage) && this.player.checkOverlap(this.hornetCage)) {
        this.player.dashHitEntities.add(this.hornetCage);
        const broken = this.hornetCage.takeDamage(1, this.particles, this.floatingTexts);
        if (broken) {
          this.screenShake = 1.3;
          window.soundEngine.playVictory();
          this.showToast('✨ HORNET FREED! PHARLOOM IS SAVED! ✨');
          setTimeout(() => this.showGameWin(), 2400);
        }
      }

      // Ground Slam vs Cage
      if (!this.hornetCage.broken && this.player.groundSlamming && !this.player.slamHitEntities.has(this.hornetCage) && this.player.checkOverlap(this.hornetCage)) {
        this.player.slamHitEntities.add(this.hornetCage);
        const broken = this.hornetCage.takeDamage(1, this.particles, this.floatingTexts);
        if (broken) {
          this.screenShake = 1.3;
          window.soundEngine.playVictory();
          this.showToast('✨ HORNET FREED! PHARLOOM IS SAVED! ✨');
          setTimeout(() => this.showGameWin(), 2400);
        }
      }
    }

    // 7. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const alive = p.update(dt, this.levelManager.levelWidth, this.levelManager.levelHeight);
      if (!alive) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Player Projectile hitting monsters, Boss, or Cage
      if (p.isPlayer) {
        for (let mIdx = this.monsters.length - 1; mIdx >= 0; mIdx--) {
          const m = this.monsters[mIdx];
          if (p.x > m.x - 15 && p.x < m.x + m.width + 15 && p.y > m.y - 15 && p.y < m.y + m.height + 15) {
            if (p.type !== 'black_hole') p.alive = false;
            const died = m.takeDamage(p.damage, this.particles, this.floatingTexts);
            this.player.addSoul(1); // Soul on projectile hit!
            this.updateSoulUI();
            if (died) {
              this.levelKills++;
              this.monsters.splice(mIdx, 1);
            }
            break;
          }
        }

        if (this.activeBoss && this.activeBoss.alive && p.alive) {
          if (p.x > this.activeBoss.x - 20 && p.x < this.activeBoss.x + this.activeBoss.width + 20 &&
              p.y > this.activeBoss.y - 20 && p.y < this.activeBoss.y + this.activeBoss.height + 20) {
            if (p.type !== 'black_hole') p.alive = false;
            const bossDied = this.activeBoss.takeDamage(p.damage, this.particles, this.floatingTexts);
            this.player.addSoul(1); // Soul on boss hit!
            this.updateSoulUI();
            if (bossDied) {
              this.handleBossDefeat();
            }
          }
        }

        if (this.hornetCage && !this.hornetCage.broken && p.alive) {
          if (p.x > this.hornetCage.x - 10 && p.x < this.hornetCage.x + this.hornetCage.width + 10 &&
              p.y > this.hornetCage.y - 10 && p.y < this.hornetCage.y + this.hornetCage.height + 10) {
            if (p.type !== 'black_hole') p.alive = false;
            const broken = this.hornetCage.takeDamage(1, this.particles, this.floatingTexts);
            if (broken) {
              this.screenShake = 1.3;
              window.soundEngine.playVictory();
              this.showToast('✨ HORNET FREED! PHARLOOM IS SAVED! ✨');
              setTimeout(() => this.showGameWin(), 2400);
            }
          }
        }
      } else {
        // Monster/Boss Projectile hitting Player
        if (p.x > this.player.x && p.x < this.player.x + this.player.width &&
            p.y > this.player.y && p.y < this.player.y + this.player.height) {
          p.alive = false;
          if (this.player.takeDamage(2)) {
            this.screenShake = 0.4;
            this.updateHPUI();
            this.floatingTexts.push(new FloatingText('⚡ BLASTED! -2/6 HP', this.player.x - 20, this.player.y - 20, '#ff4d61', 12));
          }
        }
      }
    }

    // 8. Update Particles & Floating Texts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update(dt)) this.particles.splice(i, 1);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      if (!this.floatingTexts[i].update(dt)) this.floatingTexts.splice(i, 1);
    }

    // 9. Camera Tracking (Centered & smooth throughout level and boss arena)
    let targetCamX = this.player.x - this.canvas.width * 0.35;
    if (this.state === 'BOSS') {
      targetCamX = Math.max(this.levelManager.bossArenaStartX - 50, Math.min(targetCamX, this.levelManager.levelWidth - this.canvas.width));
    } else {
      targetCamX = Math.max(0, Math.min(targetCamX, this.levelManager.levelWidth - this.canvas.width));
    }
    this.cameraX += (targetCamX - this.cameraX) * 0.1;

    const targetCamY = Math.max(0, (520 + 80) - this.canvas.height);
    this.cameraY = (this.cameraY || 0) + (targetCamY - (this.cameraY || 0)) * 0.1;

    if (this.screenShake > 0) {
      this.screenShake -= dt * 2.5;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const time = performance.now() / 1000;

    // Draw Parallax Background
    this.levelManager.drawBackground(this.ctx, this.cameraX, this.canvas.width, this.canvas.height, time);

    this.ctx.save();
    // Screen Shake effect
    if (this.screenShake > 0) {
      const shakeAmt = this.screenShake * 12;
      this.ctx.translate(
        (Math.random() - 0.5) * shakeAmt,
        (Math.random() - 0.5) * shakeAmt
      );
    }

    // Camera Translate (X and Y)
    this.ctx.translate(-this.cameraX, - (this.cameraY || 0));

    // Draw Level Platforms & Spikes (with locked arena barrier if boss is active)
    this.levelManager.drawLevel(this.ctx, time, this.state === 'BOSS');

    // Draw Small Monsters
    for (const m of this.monsters) {
      m.draw(this.ctx);
    }

    // Draw Boss
    if (this.activeBoss && this.activeBoss.alive) {
      this.activeBoss.draw(this.ctx);
    }

    // Draw Hornet Cage (Level 8 Climax)
    if (this.hornetCage) {
      this.hornetCage.draw(this.ctx);
    }

    // Draw Mario Knight Player
    this.player.draw(this.ctx);

    // Draw Overhead Mario HP Masks & Soul Indicator
    this.drawOverheadHUD(this.ctx);

    // Draw Projectiles
    for (const p of this.projectiles) {
      p.draw(this.ctx);
    }

    // Draw Particles
    for (const pt of this.particles) {
      pt.draw(this.ctx);
    }

    // Draw Floating Texts
    for (const ft of this.floatingTexts) {
      ft.draw(this.ctx);
    }

    this.ctx.restore();
  }

  drawOverheadHUD(ctx) {
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y - 28;

    ctx.save();
    // Draw 6 miniature Life Masks above Mario's head
    const maskCount = this.player.maxMasks; // 6
    const totalW = maskCount * 9;
    const startX = px - totalW / 2;

    for (let i = 0; i < maskCount; i++) {
      const mx = startX + i * 9;
      const isFull = i < this.player.masks;

      ctx.fillStyle = isFull ? '#ffffff' : '#222634';
      ctx.strokeStyle = isFull ? '#ffd54f' : '#444c66';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(mx + 3, py + 3, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isFull) {
        ctx.fillStyle = '#0a0d16';
        ctx.fillRect(mx + 2, py + 2, 2, 2);
      }
    }

    // Overhead Soul Indicator Pip if soul > 0
    if (this.player.soul > 0) {
      ctx.fillStyle = '#3fe0d0';
      ctx.shadowColor = '#3fe0d0';
      ctx.shadowBlur = 6;
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`✦ ${this.player.soul}/10 SOUL`, px, py - 6);
    }

    ctx.restore();
  }
}

// Instantiate and start Game Loop immediately or on DOM ready
function initMarioKnightGame() {
  if (!window.game) {
    window.game = new Game();
    window.game.loop(performance.now());
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initMarioKnightGame);
} else {
  initMarioKnightGame();
}
