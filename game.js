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
    this.modalStory = document.getElementById('modal-story');
    this.modalCharSelect = document.getElementById('modal-character-select');
    this.charGrid = document.getElementById('char-grid');
    this.modalPause = document.getElementById('modal-pause');
    this.modalLevelClear = document.getElementById('modal-level-clear');
    this.modalGameOver = document.getElementById('modal-game-over');
    this.modalGameWin = document.getElementById('modal-game-win');

    // Story UI Elements
    this.storyChapterTag = document.getElementById('story-chapter-tag');
    this.storyIcon = document.getElementById('story-icon');
    this.storyHeadline = document.getElementById('story-headline');
    this.storyText = document.getElementById('story-text');
    this.btnStoryPrev = document.getElementById('btn-story-prev');
    this.btnStoryNext = document.getElementById('btn-story-next');
    this.btnStorySkip = document.getElementById('btn-story-skip');
    this.currentStoryStep = 0;
    this.hasSeenStory = false;

    this.storyChapters = [
      {
        chapter: 'PROLOGUE • CHAPTER 1 OF 5',
        icon: '🌀',
        headline: 'THE SHATTERED WARP PIPE',
        text: 'Deep beneath the Mushroom Kingdom, a cataclysmic void rift shattered the subterranean warp pipe network. Mario was sucked into a cosmic abyssal whirlpool, plummeting millions of fathoms into the haunted insect kingdom of Pharloom!'
      },
      {
        chapter: 'PROLOGUE • CHAPTER 2 OF 5',
        icon: '🐛',
        headline: 'HOW THE BUGS CAME: THE VOID PLAGUE',
        text: 'Eons ago, Pharloom was a peaceful sanctuary of gentle weavers, worker beetles, and nectar wasps. But a toxic void infection bubbled up from the subterranean abyss—warping the bugs into razor-jawed chitin beasts and corrupting the 12 realm guardians into bloodthirsty Titans!'
      },
      {
        chapter: 'PROLOGUE • CHAPTER 3 OF 5',
        icon: '🕸️',
        headline: 'AMBUSHED & DISARMED',
        text: 'Awaking in the damp gloom of the Moss Grotto, Mario found himself surrounded by swarms of infected void bugs. Stripped of his Fire Flowers and mushrooms, his bare knuckles shattered harmlessly against their iron chitin. He was cornered and weaponless!'
      },
      {
        chapter: 'PROLOGUE • CHAPTER 4 OF 5',
        icon: '🪓',
        headline: 'THE TITAN CLEAVER BATTLE AXE',
        text: 'Desperate, Mario broke through a fragile silk wall into an ancient shrine. Embedded in an altar of petrified silk stood the Titan Cleaver—a colossal double-bladed battle axe forged from starlight steel and fallen god-chitin, waiting ages for a true champion to draw it.'
      },
      {
        chapter: 'PROLOGUE • CHAPTER 5 OF 5',
        icon: '🛡️',
        headline: 'THE 5 SACRED LIFE MASKS & HORNET',
        text: 'As Mario gripped the hilt, 5 ancient Weaver Spirits manifested. To protect his mortal heart from the venomous bug blight, each spirit fused into a resilient Life Mask—granting Mario 5 sacred lives! Through the silk threads, Princess Hornet cried: "Conquer the 12 Titans and break my Golden Cage!"'
      }
    ];

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
    this.elapsedTime = 0.0; // Unlimited exploration time!
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
    this.checkExistingSave();
    this.updateCharacterUI();
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
      window.soundEngine.pauseBGM();
    } else {
      if (this.modalPause) this.modalPause.classList.remove('active');
      window.soundEngine.resumeBGM();
      this.lastTime = performance.now();
    }
  }

  bindEvents() {
    // Global User Interaction Audio Unlock & BGM Autoplay
    const unlockAndPlayBGM = () => {
      try {
        if (!window.soundEngine) return;
        window.soundEngine.init();
        if (!window.soundEngine.bgmPlaying && !window.soundEngine.muted) {
          if (this.state === 'START' || this.state === 'CHAR_SELECT') {
            window.soundEngine.startBGM('title');
          } else if (this.state === 'STORY') {
            window.soundEngine.startBGM('story');
          } else if (this.state === 'BOSS') {
            window.soundEngine.startBGM('boss');
          } else if (this.state === 'PLAYING') {
            window.soundEngine.startBGM('ambient');
          }
        }
      } catch (e) {}
    };

    window.addEventListener('pointerdown', unlockAndPlayBGM, { passive: true });
    window.addEventListener('keydown', unlockAndPlayBGM, { passive: true });
    window.addEventListener('touchstart', unlockAndPlayBGM, { passive: true });

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

      // Save game shortcut (F5 or Ctrl/Cmd + S)
      if (code === 'F5' || ((e.ctrlKey || e.metaKey) && code === 'KeyS')) {
        e.preventDefault();
        this.saveGame();
        return;
      }

      // Load game shortcut (F9 or Ctrl/Cmd + O)
      if (code === 'F9' || ((e.ctrlKey || e.metaKey) && code === 'KeyO')) {
        e.preventDefault();
        this.loadGame();
        return;
      }

      // Modal keyboard fast-advance
      if (this.state === 'START') {
        if (code === 'Space' || code === 'Enter' || code === 'KeyW' || code === 'KeyJ' || code === 'KeyZ') {
          e.preventDefault();
          window.soundEngine.init();
          if (this.modalStart) this.modalStart.classList.remove('active');
          if (!this.hasSeenStory) {
            this.showStory(0);
          } else {
            this.startLevel(1);
          }
          return;
        }
      } else if (this.state === 'STORY') {
        if (code === 'Space' || code === 'Enter' || code === 'KeyJ' || code === 'KeyZ' || code === 'ArrowRight' || code === 'KeyD') {
          e.preventDefault();
          if (this.currentStoryStep < this.storyChapters.length - 1) {
            this.currentStoryStep++;
            this.updateStoryView();
            window.soundEngine.playJump();
          } else {
            this.finishStory();
          }
          return;
        } else if (code === 'ArrowLeft' || code === 'KeyA') {
          e.preventDefault();
          if (this.currentStoryStep > 0) {
            this.currentStoryStep--;
            this.updateStoryView();
            window.soundEngine.playJump();
          }
          return;
        } else if (code === 'Escape') {
          e.preventDefault();
          this.finishStory();
          return;
        }
      } else if (this.state === 'CHAR_SELECT') {
        if (code === 'Escape') {
          e.preventDefault();
          this.closeCharacterSelect();
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
          if (this.currentLevel < 12) {
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
      // Character Select shortcut (C)
      if (code === 'KeyC') {
        e.preventDefault();
        if (this.state === 'CHAR_SELECT') {
          this.closeCharacterSelect();
        } else {
          this.openCharacterSelect();
        }
        return;
      }

      // Dash keys (L, Shift)
      if (code === 'KeyL' || code === 'ShiftLeft' || code === 'ShiftRight') {
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
            this.showToast('✨ 10/10 SOUL FOCUSED: +2 LIVES RESTORED!');
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
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
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
      if (!this.hasSeenStory) {
        this.showStory(0);
      } else {
        this.startLevel(1);
      }
    };
    addAction('btn-play-game', handleStartGame);
    addAction('btn-play-game-bottom', handleStartGame);

    // Story Prologue Actions
    addAction('btn-show-story', () => {
      try { window.soundEngine.init(); } catch (err) {}
      this.showStory(0);
    });

    addAction('btn-story-prev', () => {
      if (this.currentStoryStep > 0) {
        this.currentStoryStep--;
        this.updateStoryView();
        window.soundEngine.playJump();
      }
    });

    addAction('btn-story-next', () => {
      if (this.currentStoryStep < this.storyChapters.length - 1) {
        this.currentStoryStep++;
        this.updateStoryView();
        window.soundEngine.playJump();
      } else {
        this.finishStory();
      }
    });

    addAction('btn-story-skip', () => {
      this.finishStory();
    });

    // Story Dots interactive selection
    const storyDots = document.querySelectorAll('.story-dot');
    storyDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.currentStoryStep = step;
        this.updateStoryView();
        window.soundEngine.playJump();
      });
    });

    // Next Level Button
    addAction('btn-next-level', () => {
      if (this.modalLevelClear) this.modalLevelClear.classList.remove('active');
      if (this.currentLevel < 12) {
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

    // Save & Load Game Buttons (HUD & Modals)
    addAction('btn-save-game', () => this.saveGame());
    addAction('btn-load-game', () => this.loadGame());
    addAction('btn-save-pause', () => this.saveGame());
    addAction('btn-load-pause', () => this.loadGame());
    addAction('btn-load-retry', () => this.loadGame());
    addAction('btn-continue-game', () => this.loadGame());

    // Change Character Buttons (HUD, Start, Pause)
    addAction('btn-change-char-hud', () => this.openCharacterSelect());
    addAction('btn-change-char-start', () => this.openCharacterSelect());
    addAction('btn-change-char-pause', () => this.openCharacterSelect());
    addAction('btn-close-char-select', () => this.closeCharacterSelect());

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
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        }
        try { window.soundEngine.init(); } catch (err) {}
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 120);

        if (this.state === 'PLAYING' || this.state === 'BOSS' || id === 'touch-pause' || id === 'touch-char') {
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

    // Soul Focus Heal +2 Lives (10/10)
    bindArcadeButton('touch-heal', () => {
      if (this.player.focusHeal()) {
        this.showToast('✨ 10/10 SOUL FOCUSED: +2 LIVES RESTORED!');
        this.updateHPUI();
        this.updateSoulUI();
      }
    });

    // Pause Game Button
    bindArcadeButton('touch-pause', () => {
      this.togglePause();
    });

    // Change Character Button on mobile arcade
    bindArcadeButton('touch-char', () => {
      this.openCharacterSelect();
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
    this.elapsedTime = 0.0; // Unlimited exploration time (no time limit!)
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

    // Hornet cage appears strictly after defeating the ultimate boss (Level 12)
    this.hornetCage = null;

    // Initial monsters densely populated across the entire traversal terrain!
    const types = this.levelManager.config.monsterTypes;
    for (let sx = 450; sx < this.levelManager.bossArenaStartX - 150; sx += 240) {
      const type = types[Math.floor(Math.random() * types.length)];
      const isFly = type === 'needle_wasp' || type === 'shadow_wisp' || type === 'astral_phantom' || type === 'void_shade' || type === 'crystal_bat' || type === 'molten_skull';
      const sy = isFly ? 210 + Math.random() * 140 : 490;
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
    this.updateCharacterUI();

    this.state = 'PLAYING';
    window.soundEngine.startBGM('ambient');
    this.showToast(`✨ LEVEL ${levelNum} EXPEDITION: ${this.levelManager.config.name} ✨`);
  }

  handleBossDefeat() {
    if (this.currentLevel === 12) {
      // Spawn Hornet's Golden Cage right where The Ascended Godweaver Koopa was slain!
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
      this.showToast('⚔️ THE ASCENDED GODWEAVER IS SLAIN! THE CAGE APPEARED! STRIKE IT WITH YOUR AXE TO FREE HORNET! ⚔️');
    } else {
      this.showLevelClear();
    }
  }

  updateHPUI() {
    this.hpText.textContent = `(${this.player.masks}/${this.player.maxMasks})`;
    for (let i = 0; i < this.maskElements.length; i++) {
      const maskEl = this.maskElements[i];
      if (!maskEl) continue;
      if (i < this.player.masks) {
        maskEl.className = 'mask full';
      } else {
        maskEl.className = 'mask empty';
      }
    }
  }

  showStory(stepIndex = 0) {
    this.state = 'STORY';
    this.currentStoryStep = Math.max(0, Math.min(this.storyChapters.length - 1, stepIndex));
    if (this.modalStart) this.modalStart.classList.remove('active');
    if (this.modalStory) this.modalStory.classList.add('active');
    this.updateStoryView();
    if (window.soundEngine && window.soundEngine.startBGM) {
      window.soundEngine.startBGM('story');
    }
  }

  updateStoryView() {
    const data = this.storyChapters[this.currentStoryStep];
    if (!data) return;

    if (this.storyChapterTag) this.storyChapterTag.textContent = data.chapter;
    if (this.storyIcon) this.storyIcon.textContent = data.icon;
    if (this.storyHeadline) this.storyHeadline.textContent = data.headline;
    if (this.storyText) this.storyText.textContent = data.text;

    // Update dots
    const dots = document.querySelectorAll('.story-dot');
    dots.forEach((dot, idx) => {
      if (idx === this.currentStoryStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update nav buttons
    if (this.btnStoryPrev) {
      this.btnStoryPrev.disabled = (this.currentStoryStep === 0);
    }
    if (this.btnStoryNext) {
      if (this.currentStoryStep === this.storyChapters.length - 1) {
        this.btnStoryNext.textContent = 'FINISH ⚔️';
      } else {
        this.btnStoryNext.textContent = 'NEXT ❯';
      }
    }
    if (this.btnStorySkip) {
      if (this.currentStoryStep === this.storyChapters.length - 1) {
        this.btnStorySkip.textContent = 'TAKE UP THE AXE ⚔️';
      } else {
        this.btnStorySkip.textContent = 'SKIP PROLOGUE ❯❯';
      }
    }
  }

  finishStory() {
    this.hasSeenStory = true;
    if (this.modalStory) this.modalStory.classList.remove('active');
    if (window.soundEngine && window.soundEngine.playPowerGet) {
      window.soundEngine.playPowerGet();
    }
    this.startLevel(1);
  }

  renderCharacterGrid() {
    if (!this.charGrid) return;
    this.charGrid.innerHTML = '';

    Object.keys(MARIO_CHARACTERS).forEach((charKey) => {
      const char = MARIO_CHARACTERS[charKey];
      const isSelected = this.player && this.player.character === charKey;

      const card = document.createElement('div');
      card.className = `char-card ${isSelected ? 'selected' : ''}`;
      card.dataset.charId = charKey;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      // Create preview canvas with live hero vector sprite
      const cvs = document.createElement('canvas');
      cvs.className = 'char-avatar-canvas';
      cvs.width = 48;
      cvs.height = 56;
      const cctx = cvs.getContext('2d');
      if (cctx) {
        Sprites.drawMarioKnight(
          cctx,
          24 - 15,
          28 - 19,
          30,
          38,
          true,
          { moving: false, slashing: false, slashTimer: 0, slashDuration: 0.22 },
          0,
          false,
          false,
          charKey
        );
      }

      card.appendChild(cvs);

      const nameEl = document.createElement('div');
      nameEl.className = 'char-name';
      nameEl.textContent = `${char.emoji} ${char.name}`;
      card.appendChild(nameEl);

      const titleEl = document.createElement('div');
      titleEl.className = 'char-title';
      titleEl.textContent = char.title;
      card.appendChild(titleEl);

      const perkEl = document.createElement('div');
      perkEl.className = 'char-perk';
      perkEl.textContent = char.perkText;
      card.appendChild(perkEl);

      const badgeEl = document.createElement('div');
      badgeEl.className = 'char-status-badge';
      badgeEl.textContent = isSelected ? 'SELECTED (PLAY ⚔️)' : 'PLAY NOW ⚔️';
      card.appendChild(badgeEl);

      // Fast, debounced multi-input listener for both mobile touch and desktop click
      let lastCardTrigger = 0;
      const handleSelect = (e) => {
        const now = performance.now();
        if (now - lastCardTrigger < 300) return;
        lastCardTrigger = now;
        if (e) {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        }
        this.selectCharacter(charKey);
      };

      card.addEventListener('pointerup', handleSelect);
      card.addEventListener('touchend', handleSelect, { passive: false });
      card.addEventListener('click', handleSelect);
      card.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleSelect(e);
        }
      });

      this.charGrid.appendChild(card);
    });
  }

  selectCharacter(charKey) {
    if (!MARIO_CHARACTERS[charKey]) return;
    this.player.setCharacter(charKey);
    this.updateCharacterUI();
    try {
      if (window.soundEngine && window.soundEngine.playPowerGet) {
        window.soundEngine.playPowerGet();
      }
    } catch (e) {}
    this.showToast(`✨ NOW PLAYING AS ${MARIO_CHARACTERS[charKey].name}! (${MARIO_CHARACTERS[charKey].perkText})`);
    // Direct gameplay activation: "if i click on one of the character, that character should play"
    this.closeCharacterSelect(true);
  }

  updateCharacterUI() {
    const char = (this.player && MARIO_CHARACTERS[this.player.character]) ? MARIO_CHARACTERS[this.player.character] : MARIO_CHARACTERS.mario;
    if (this.distanceMarioPin) {
      this.distanceMarioPin.textContent = char.emoji;
    }
    const startHeroName = document.getElementById('start-hero-name');
    if (startHeroName) {
      startHeroName.textContent = `${char.emoji} ${char.name} (${char.title})`;
    }
    const pauseHeroName = document.getElementById('pause-hero-name');
    if (pauseHeroName) {
      pauseHeroName.textContent = `${char.emoji} ${char.name} (${char.title})`;
    }
    const hudCharLabel = document.getElementById('hud-char-label');
    if (hudCharLabel) {
      hudCharLabel.textContent = `${char.emoji} ${char.name}`;
    }
    const btnPlay = document.getElementById('btn-play-game');
    if (btnPlay) {
      btnPlay.textContent = `START JOURNEY AS ${char.emoji} ${char.name} ⚔️`;
    }
    const btnPlayBottom = document.getElementById('btn-play-game-bottom');
    if (btnPlayBottom) {
      btnPlayBottom.textContent = `START EXPEDITION AS ${char.emoji} ${char.name} ⚔️`;
    }
    if (this.charGrid) {
      const cards = this.charGrid.querySelectorAll('.char-card');
      cards.forEach((c) => {
        const isSel = c.dataset.charId === this.player.character;
        c.className = `char-card ${isSel ? 'selected' : ''}`;
        const badge = c.querySelector('.char-status-badge');
        if (badge) badge.textContent = isSel ? 'SELECTED (PLAY ⚔️)' : 'PLAY NOW ⚔️';
      });
    }
  }

  openCharacterSelect() {
    this.prevModalState = this.state;
    this.wasStartActive = !!(this.modalStart && this.modalStart.classList.contains('active'));
    this.wasPauseActive = !!(this.modalPause && this.modalPause.classList.contains('active'));

    if (this.wasStartActive && this.modalStart) {
      this.modalStart.classList.remove('active');
    }
    if (this.wasPauseActive && this.modalPause) {
      this.modalPause.classList.remove('active');
    }

    this.state = 'CHAR_SELECT';
    this.renderCharacterGrid();
    if (this.modalCharSelect) {
      this.modalCharSelect.classList.add('active');
    }
    try {
      if (window.soundEngine && window.soundEngine.playJump) {
        window.soundEngine.playJump();
      }
    } catch (e) {}
  }

  closeCharacterSelect(startPlaying = false) {
    if (this.modalCharSelect) {
      this.modalCharSelect.classList.remove('active');
    }

    if (startPlaying) {
      if (this.modalStart) this.modalStart.classList.remove('active');
      if (this.modalPause) this.modalPause.classList.remove('active');
      this.paused = false;
      if (this.wasStartActive || this.prevModalState === 'START') {
        this.wasStartActive = false;
        if (!this.hasSeenStory) {
          this.showStory(0);
        } else {
          this.startLevel(1);
        }
      } else {
        this.state = 'PLAYING';
        if (window.soundEngine && window.soundEngine.startBGM) {
          window.soundEngine.startBGM(this.state === 'BOSS' ? 'boss' : 'ambient');
        }
      }
      return;
    }

    // Cancel / Return to previous modal
    if (this.wasStartActive) {
      this.wasStartActive = false;
      this.state = 'START';
      if (this.modalStart) this.modalStart.classList.add('active');
      if (window.soundEngine && window.soundEngine.startBGM) {
        window.soundEngine.startBGM('title');
      }
    } else if (this.wasPauseActive) {
      this.wasPauseActive = false;
      this.state = 'PAUSED';
      if (this.modalPause) this.modalPause.classList.add('active');
      if (window.soundEngine && window.soundEngine.pauseBGM) {
        window.soundEngine.pauseBGM();
      }
    } else if (this.prevModalState && this.prevModalState !== 'CHAR_SELECT') {
      this.state = this.prevModalState;
    } else {
      this.state = 'PLAYING';
      if (window.soundEngine && window.soundEngine.startBGM) {
        window.soundEngine.startBGM('ambient');
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
      { id: 'power-p8', unlocked: this.player.powers.radiantAura },
      { id: 'power-p9', unlocked: this.player.powers.stellarPrism },
      { id: 'power-p10', unlocked: this.player.powers.chronoGear },
      { id: 'power-p11', unlocked: this.player.powers.shadowSoul },
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

    this.statTime.textContent = `${this.elapsedTime.toFixed(1)}s`;
    this.statKills.textContent = `${this.levelKills}`;
    this.statNextDist.textContent = this.currentLevel < 12 ? `${LEVEL_CONFIGS[this.currentLevel].targetKm.toFixed(0)} km` : 'FINAL';

    this.modalLevelClear.classList.add('active');
  }

  showGameWin() {
    this.state = 'WIN';
    window.soundEngine.stopBGM();
    window.soundEngine.playVictory();
    this.modalGameWin.classList.add('active');
  }

  checkExistingSave() {
    try {
      const raw = localStorage.getItem('mario_knight_silksong_save');
      const continueBtn = document.getElementById('btn-continue-game');
      if (raw && continueBtn) {
        const data = JSON.parse(raw);
        if (data && data.level) {
          continueBtn.style.display = 'block';
          continueBtn.textContent = `CONTINUE SAVED GAME (LEVEL ${data.level}) 📂`;
        }
      }
    } catch (e) {}
  }

  saveGame() {
    try {
      window.soundEngine.init();
      const saveData = {
        level: this.currentLevel,
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
        character: this.player.character,
        masks: this.player.masks,
        soul: this.player.soul,
        powers: { ...this.player.powers },
        levelKills: this.levelKills,
        elapsedTime: this.elapsedTime,
        timestamp: Date.now()
      };
      localStorage.setItem('mario_knight_silksong_save', JSON.stringify(saveData));

      if (window.soundEngine && window.soundEngine.playPowerUp) {
        window.soundEngine.playPowerUp();
      }
      this.floatingTexts.push(new FloatingText('💾 GAME SAVED!', this.player.x, this.player.y - 30, '#ffd700', 14));
      this.showToast(`💾 GAME SAVED! Level ${this.currentLevel} Checkpoint Recorded.`);

      const continueBtn = document.getElementById('btn-continue-game');
      if (continueBtn) {
        continueBtn.style.display = 'block';
        continueBtn.textContent = `CONTINUE SAVED GAME (LEVEL ${saveData.level}) 📂`;
      }
      return true;
    } catch (e) {
      console.error(e);
      this.showToast('⚠️ Could not save game to browser storage!');
      return false;
    }
  }

  loadGame() {
    try {
      window.soundEngine.init();
      const raw = localStorage.getItem('mario_knight_silksong_save');
      if (!raw) {
        this.showToast('⚠️ No save file found! Tap [SAVE] during gameplay first.');
        return false;
      }
      const data = JSON.parse(raw);
      if (!data || !data.level) {
        this.showToast('⚠️ Save file data is invalid.');
        return false;
      }

      // Close all overlay modals
      if (this.modalStart) this.modalStart.classList.remove('active');
      if (this.modalPause) this.modalPause.classList.remove('active');
      if (this.modalGameOver) this.modalGameOver.classList.remove('active');
      if (this.modalLevelClear) this.modalLevelClear.classList.remove('active');
      this.paused = false;

      // Start the saved level
      this.startLevel(data.level);

      // Restore position & stats
      this.player.x = data.x !== undefined ? data.x : 100;
      this.player.y = data.y !== undefined ? data.y : 460;
      this.player.masks = data.masks !== undefined ? Math.max(1, Math.min(this.player.maxMasks, data.masks)) : this.player.maxMasks;
      this.player.soul = data.soul !== undefined ? data.soul : 0;
      if (data.character && typeof this.player.setCharacter === 'function') {
        this.player.setCharacter(data.character);
      }
      this.updateCharacterUI();
      if (data.powers) {
        this.player.powers = { ...this.player.powers, ...data.powers };
      }
      this.levelKills = data.levelKills || 0;
      this.elapsedTime = data.elapsedTime || 0;

      // If loaded inside or near boss arena, trigger boss
      if (this.player.x >= this.levelManager.bossArenaStartX - 50) {
        this.state = 'BOSS';
        this.activeBoss = new Boss(this.currentLevel, this.levelManager.bossSpawnX, this.levelManager.bossSpawnY);
        this.bossHud.classList.remove('hidden');
        this.bossName.textContent = this.activeBoss.name;
        this.bossSubtitle.textContent = this.activeBoss.title;
        this.bossBarFill.style.width = '100%';
        window.soundEngine.startBGM('boss');
      }

      this.updateHPUI();
      this.updateSoulUI();
      this.updatePowerIconsUI();

      if (window.soundEngine && window.soundEngine.playPowerUp) {
        window.soundEngine.playPowerUp();
      }
      this.floatingTexts.push(new FloatingText('📂 GAME LOADED!', this.player.x, this.player.y - 30, '#00e5ff', 14));
      this.showToast(`📂 GAME LOADED! Resumed Level ${data.level}`);
      return true;
    } catch (e) {
      console.error(e);
      this.showToast('⚠️ Error loading saved progress!');
      return false;
    }
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
    // 1. Elapsed Exploration Time (No time limits!)
    this.elapsedTime += dt;

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
        if (this.player.takeDamage(1)) {
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

      // Remove monsters left far behind player during the long sprint
      if (m.x < this.player.x - 1300) {
        this.monsters.splice(i, 1);
        continue;
      }

      // Only run physics & AI for active monsters near screen to keep 60 FPS buttery smooth
      if (Math.abs(m.x - this.player.x) > 1800) {
        continue;
      }

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

      // Monster Bites Player -> Loses 1 Life (1 Mask)
      if (this.player.checkOverlap(m)) {
        if (this.player.takeDamage(1)) {
          this.screenShake = 0.5;
          this.updateHPUI();
          this.floatingTexts.push(new FloatingText('💥 BITTEN! -1 LIFE', this.player.x - 20, this.player.y - 20, '#ff4d61', 12));
          this.showToast(`⚠️ BITTEN BY MONSTER! -1 LIFE (${this.player.masks}/${this.player.maxMasks} LIVES LEFT)`);
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

      // Boss bites / hits Player (Direct titan body collision deals 1 life with safe recoil)
      if (this.player.checkOverlap(this.activeBoss)) {
        if (this.player.takeDamage(1)) {
          this.screenShake = 0.45;
          this.updateHPUI();
          this.floatingTexts.push(new FloatingText('TITAN CRUSH! -1 LIFE', this.player.x - 25, this.player.y - 25, '#ff4d61', 13));
        }
      }
    }

    // 6.5 Update Hornet Cage (Level 12 Climax)
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
          if (this.player.takeDamage(1)) {
            this.screenShake = 0.4;
            this.updateHPUI();
            this.floatingTexts.push(new FloatingText('⚡ BLASTED! -1 LIFE', this.player.x - 20, this.player.y - 20, '#ff4d61', 12));
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
