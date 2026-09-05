// Mario Knight Silksong - Procedural Vector Canvas Sprites & Visuals

// Universal polyfill for CanvasRenderingContext2D.prototype.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (typeof radii === 'undefined') radii = 0;
    const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? (radii[0] || 0) : 0);
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

const Sprites = {
  // Draw Mario Knight
  drawMarioKnight(ctx, x, y, width, height, facingRight, state, time, isInvulnerable, hasParry) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) ctx.scale(-1, 1);

    // Invulnerability flashing
    if (isInvulnerable && Math.floor(time * 25) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Active parry shield glow
    if (hasParry) {
      ctx.strokeStyle = '#3fe0d0';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#3fe0d0';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }

    const bob = state.moving ? Math.sin(time * 15) * 2 : Math.sin(time * 4) * 1;
    const legSwing = state.moving ? Math.sin(time * 15) * 8 : 0;

    // 1. Flowing Silk Knight Cloak (Back)
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.moveTo(-10, -5 + bob);
    ctx.quadraticCurveTo(-22 + Math.sin(time * 8) * 4, 10, -18 + Math.cos(time * 6) * 6, 22);
    ctx.lineTo(-4, 18);
    ctx.closePath();
    ctx.fill();

    // 2. Legs / Boots (Blue overalls / knight greaves)
    ctx.fillStyle = '#1a237e'; // Dark Royal Blue
    // Left Leg
    ctx.beginPath();
    ctx.roundRect(-10 + legSwing, 10 + bob, 8, 12, 3);
    ctx.fill();
    // Right Leg
    ctx.beginPath();
    ctx.roundRect(2 - legSwing, 10 + bob, 8, 12, 3);
    ctx.fill();
    // Boots
    ctx.fillStyle = '#4e342e'; // Dark brown boots
    ctx.beginPath();
    ctx.roundRect(-12 + legSwing, 18 + bob, 10, 5, 2);
    ctx.roundRect(0 - legSwing, 18 + bob, 10, 5, 2);
    ctx.fill();

    // 3. Body (Red Tunic + Blue Overalls)
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.roundRect(-11, -8 + bob, 22, 18, 5);
    ctx.fill();

    // Overalls
    ctx.fillStyle = '#1a237e';
    ctx.beginPath();
    ctx.roundRect(-9, 0 + bob, 18, 12, 3);
    ctx.fill();
    // Gold buttons
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(-5, 3 + bob, 2, 0, Math.PI * 2);
    ctx.arc(5, 3 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // 4. Head / Mask (Mario Face with Pale Knight Mask Sheen)
    ctx.fillStyle = '#ffcc80'; // Flesh tone
    ctx.beginPath();
    ctx.arc(0, -12 + bob, 11, 0, Math.PI * 2);
    ctx.fill();

    // Mario Iconic Mustache
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.ellipse(3, -9 + bob, 6, 3.5, 0.1, 0, Math.PI * 2);
    ctx.ellipse(8, -10 + bob, 3, 2.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Knight Glowing Soul Eyes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#3fe0d0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(4, -14 + bob, 2.5, 4, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mario Cap with Horned Knight Crest
    ctx.fillStyle = '#d32f2f'; // Red Cap
    ctx.beginPath();
    ctx.arc(0, -16 + bob, 12, Math.PI, 0);
    ctx.lineTo(14, -13 + bob);
    ctx.lineTo(-12, -13 + bob);
    ctx.closePath();
    ctx.fill();

    // Cap Visor
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.roundRect(0, -15 + bob, 15, 4, 2);
    ctx.fill();

    // Cap Emblem (Gold Mario 'M' on White Badge)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(2, -18 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 6px Cinzel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 2, -18 + bob);

    // 5. Weapon: Silksong Great Battle Axe
    if (state.slashing) {
      const slashProgress = state.slashTimer / state.slashDuration;
      const slashAngle = (slashProgress - 0.5) * Math.PI * 1.8;

      ctx.save();
      ctx.translate(8, -2 + bob);
      ctx.rotate(slashAngle);

      // Wooden / Steel Axe Shaft
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(-3, -32, 6, 44);

      // Gold Shaft Rings
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(-4, -20, 8, 3);
      ctx.fillRect(-4, -6, 8, 3);
      ctx.fillRect(-4, 8, 8, 3);

      // Great Axe Double-Crescent Blades
      ctx.fillStyle = '#eceff1';
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#3fe0d0';
      ctx.shadowBlur = 12;

      // Front Axe Blade (Large Cleaver)
      ctx.beginPath();
      ctx.moveTo(3, -28);
      ctx.quadraticCurveTo(28, -36, 32, -18);
      ctx.quadraticCurveTo(24, 0, 3, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Back Axe Spike / Beard
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.quadraticCurveTo(-18, -30, -18, -18);
      ctx.quadraticCurveTo(-12, -10, -3, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Center Emblem & Spool
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, -18, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Giant Glowing Axe Cleave Arc Effect
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#3fe0d0';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(8, -2 + bob, 56, -Math.PI * 0.65, Math.PI * 0.65);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(8, -2 + bob, 60, -Math.PI * 0.55, Math.PI * 0.55);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // Wielding Silksong Great Battle Axe in Hands (Always Ready in Combat Stance!)
      ctx.save();
      const readyAngle = 0.35 + Math.sin(time * 3) * 0.08;
      ctx.translate(6, 4 + bob);
      ctx.rotate(readyAngle);

      // Shaft (Sturdy carved wood & steel)
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(-3, -34, 6, 46);

      // Gold Bindings / Rings
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(-4, -22, 8, 3);
      ctx.fillRect(-4, -8, 8, 3);
      ctx.fillRect(-4, 6, 8, 3);
      ctx.fillRect(-4, 12, 8, 3);

      // Axe Head - Massive Front Crescent Cleaver Blade
      ctx.fillStyle = '#eceff1';
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#3fe0d0';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(3, -32);
      ctx.quadraticCurveTo(32, -40, 36, -20);
      ctx.quadraticCurveTo(28, 2, 3, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Axe Head - Back Cleaver Spike / Crescent
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.moveTo(-3, -30);
      ctx.quadraticCurveTo(-22, -34, -20, -18);
      ctx.quadraticCurveTo(-14, -8, -3, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Center Core Rune & Spool
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, -20, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Cyan Silk Core Rune
      ctx.fillStyle = '#3fe0d0';
      ctx.beginPath();
      ctx.arc(0, -20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Mario Hands gripping the Battle Axe
      ctx.fillStyle = '#ffffff'; // White Mario Gloves
      ctx.beginPath();
      ctx.arc(6, 6 + bob, 4.5, 0, Math.PI * 2);
      ctx.arc(2, 2 + bob, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  },

  // Draw Small Monsters (6 Types)
  drawSmallMonster(ctx, type, x, y, width, height, facingRight, time, hitFlash) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) ctx.scale(-1, 1);

    if (hitFlash) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
      return;
    }

    const bob = Math.sin(time * 10) * 2;

    switch (type) {
      case 'void_goomba': {
        // Void Goomba (Dark Fungal Chitin)
        ctx.fillStyle = '#3a2336';
        ctx.beginPath();
        ctx.arc(0, -4 + bob, 15, Math.PI * 0.9, Math.PI * 2.1);
        ctx.quadraticCurveTo(15, 12 + bob, -15, 12 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7b1fa2';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Horns
        ctx.fillStyle = '#120d17';
        ctx.beginPath();
        ctx.moveTo(-10, -14 + bob);
        ctx.lineTo(-16, -22 + bob);
        ctx.lineTo(-6, -16 + bob);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(10, -14 + bob);
        ctx.lineTo(16, -22 + bob);
        ctx.lineTo(6, -16 + bob);
        ctx.fill();

        // Glowing Purple Eyes & Sharp Fangs
        ctx.fillStyle = '#e040fb';
        ctx.shadowColor = '#e040fb';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(5, -2 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Fangs
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(3, 8 + bob);
        ctx.lineTo(6, 3 + bob);
        ctx.lineTo(9, 8 + bob);
        ctx.fill();
        break;
      }

      case 'silk_spiny': {
        // Silk Spiny Crawler (Crystal Spikes)
        ctx.fillStyle = '#c2185b';
        ctx.beginPath();
        ctx.arc(0, 2 + bob, 14, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        // Sharp Spikes
        ctx.fillStyle = '#f8bbd0';
        ctx.strokeStyle = '#ffffff';
        for (let a = Math.PI * 0.1; a <= Math.PI * 0.9; a += Math.PI * 0.22) {
          const sx = Math.cos(a) * 14;
          const sy = -Math.sin(a) * 14 + 2 + bob;
          const tipX = Math.cos(a) * 24;
          const tipY = -Math.sin(a) * 24 + 2 + bob;
          ctx.beginPath();
          ctx.moveTo(sx - 3, sy);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(sx + 3, sy);
          ctx.fill();
        }

        // Skittering legs
        ctx.strokeStyle = '#880e4f';
        ctx.lineWidth = 2;
        [-10, -2, 6].forEach((lx) => {
          ctx.beginPath();
          ctx.moveTo(lx, 6 + bob);
          ctx.lineTo(lx + 4, 14 + Math.sin(time * 20 + lx) * 3);
          ctx.stroke();
        });
        break;
      }

      case 'needle_wasp': {
        // Needle Wasp (Aerial Swooper)
        const wingFlap = Math.sin(time * 30) * 12;
        // Wings
        ctx.fillStyle = 'rgba(178, 235, 242, 0.6)';
        ctx.beginPath();
        ctx.ellipse(-4, -14 + wingFlap, 12, 5, -0.4, 0, Math.PI * 2);
        ctx.ellipse(4, -14 - wingFlap, 12, 5, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#ff8f00';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Dark Stripes
        ctx.fillStyle = '#212121';
        ctx.fillRect(-6, -4, 12, 3);
        ctx.fillRect(-7, 2, 14, 3);

        // Needle Stinger
        ctx.fillStyle = '#cfd8dc';
        ctx.beginPath();
        ctx.moveTo(-2, 10);
        ctx.lineTo(0, 22);
        ctx.lineTo(2, 10);
        ctx.fill();
        break;
      }

      case 'piranha_pod': {
        // Pharloom Piranha Pod
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 16, 2);
        ctx.fill();

        // Red Snapping Head
        ctx.fillStyle = '#d32f2f';
        const mouthOpen = Math.abs(Math.sin(time * 8)) * 10;
        // Upper Jaw
        ctx.beginPath();
        ctx.arc(0, -6 - mouthOpen / 2, 12, Math.PI, 0);
        ctx.fill();
        // Lower Jaw
        ctx.beginPath();
        ctx.arc(0, -6 + mouthOpen / 2, 12, 0, Math.PI);
        ctx.fill();

        // Sharp White Teeth
        ctx.fillStyle = '#ffffff';
        [-8, -2, 4].forEach((tx) => {
          ctx.fillRect(tx, -7 - mouthOpen / 2, 3, 4);
          ctx.fillRect(tx, -7 + mouthOpen / 2, 3, 4);
        });
        break;
      }

      case 'shield_beetle': {
        // Armored Shield Beetle
        ctx.fillStyle = '#00695c';
        ctx.beginPath();
        ctx.arc(0, 0 + bob, 15, 0, Math.PI * 2);
        ctx.fill();

        // Reinforced Front Chitin Shield
        ctx.fillStyle = '#ffd54f';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(6, 0 + bob, 10, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();

        // Glowing Blue Eyes
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(6, -4 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 'shadow_wisp': {
        // Floating Shadow Wisp
        const pulse = Math.sin(time * 6) * 3;
        ctx.fillStyle = 'rgba(74, 20, 140, 0.8)';
        ctx.shadowColor = '#b388ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 12 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner Core
        ctx.fillStyle = '#ede7f6';
        ctx.beginPath();
        ctx.arc(2, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
    }

    ctx.restore();
  },

  // Draw 8 Distinct Giant Bosses
  drawBoss(ctx, bossLevel, x, y, width, height, facingRight, time, hitFlash, phase, specialState) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) ctx.scale(-1, 1);

    if (hitFlash) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
      return;
    }

    const bob = Math.sin(time * 5) * 4;

    switch (bossLevel) {
      case 1: {
        // BOSS 1: Giga Goomba Colossus (Towering Chitin Earth Titan)
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.roundRect(-width * 0.45, -height * 0.4 + bob, width * 0.9, height * 0.8, 20);
        ctx.fill();
        ctx.strokeStyle = '#d7ccc8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Colossal Brow
        ctx.fillStyle = '#271714';
        ctx.fillRect(-width * 0.4, -height * 0.25 + bob, width * 0.8, 18);

        // Horned Fungal Spines
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.moveTo(-40, -height * 0.4 + bob);
        ctx.lineTo(-55, -height * 0.55 + bob);
        ctx.lineTo(-20, -height * 0.4 + bob);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(40, -height * 0.4 + bob);
        ctx.lineTo(55, -height * 0.55 + bob);
        ctx.lineTo(20, -height * 0.4 + bob);
        ctx.fill();

        // Glowing Void Eyes
        ctx.fillStyle = '#ff1744';
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(20, -height * 0.15 + bob, 8, 14, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Massive Colossus Fangs
        ctx.fillStyle = '#ffffff';
        [-25, -5, 15, 35].forEach((fx) => {
          ctx.beginPath();
          ctx.moveTo(fx, height * 0.15 + bob);
          ctx.lineTo(fx + 6, height * 0.0 + bob);
          ctx.lineTo(fx + 12, height * 0.15 + bob);
          ctx.fill();
        });
        break;
      }

      case 2: {
        // BOSS 2: Broodmother Hornet Queen (Needle Queen with Monarch Wings)
        const wingSpread = Math.sin(time * 20) * 20;
        // Monarch Gossamer Wings
        ctx.fillStyle = 'rgba(255, 235, 59, 0.45)';
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(-30, -30 + wingSpread, 45, 18, -0.6, 0, Math.PI * 2);
        ctx.ellipse(-30, 20 - wingSpread, 35, 14, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Queen Robes / Body
        ctx.fillStyle = '#c2185b';
        ctx.beginPath();
        ctx.ellipse(0, 0 + bob, 30, 50, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Hornet White Mask & Horns
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(10, -35 + bob, 18, 22, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Long Curved Horns
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(5, -50 + bob);
        ctx.quadraticCurveTo(15, -85 + bob, 30, -80 + bob);
        ctx.quadraticCurveTo(12, -60 + bob, 0, -45 + bob);
        ctx.fill();

        // Giant Needle Lance
        ctx.fillStyle = '#e0f7fa';
        ctx.strokeStyle = '#00bcd4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(20, 0 + bob);
        ctx.lineTo(100, -10 + bob);
        ctx.lineTo(20, 10 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        break;
      }

      case 3: {
        // BOSS 3: Molten Bowser Knight (Spiked Magma Dragon Turtle)
        ctx.fillStyle = '#bf360c';
        ctx.beginPath();
        ctx.arc(0, 0 + bob, width * 0.42, 0, Math.PI * 2);
        ctx.fill();

        // Spiked Carapace
        ctx.fillStyle = '#2e7d32'; // Green Shell
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(-15, 0 + bob, width * 0.35, Math.PI * 0.5, Math.PI * 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Magma Spikes
        ctx.fillStyle = '#ff3d00';
        for (let i = 0; i < 4; i++) {
          const sy = -35 + i * 25 + bob;
          ctx.beginPath();
          ctx.moveTo(-45, sy - 8);
          ctx.lineTo(-75, sy);
          ctx.lineTo(-45, sy + 8);
          ctx.fill();
        }

        // Dragon Head & Fiery Horns
        ctx.fillStyle = '#e65100';
        ctx.beginPath();
        ctx.roundRect(15, -30 + bob, 45, 50, 10);
        ctx.fill();

        // Burning Horns
        ctx.fillStyle = '#ffab00';
        ctx.beginPath();
        ctx.moveTo(25, -30 + bob);
        ctx.lineTo(40, -65 + bob);
        ctx.lineTo(45, -30 + bob);
        ctx.fill();

        // Fire in Throat
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ff3d00';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(45, 0 + bob, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 4: {
        // BOSS 4: Arcane Mantis Kamek (Teleporting Gothic Mantis Wizard)
        ctx.fillStyle = '#1565c0'; // Blue Arcane Robes
        ctx.beginPath();
        ctx.moveTo(0, -60 + bob);
        ctx.lineTo(35, 55 + bob);
        ctx.lineTo(-35, 55 + bob);
        ctx.closePath();
        ctx.fill();

        // Wizard Hat
        ctx.fillStyle = '#0d47a1';
        ctx.beginPath();
        ctx.moveTo(-25, -45 + bob);
        ctx.lineTo(25, -45 + bob);
        ctx.lineTo(5, -95 + bob);
        ctx.closePath();
        ctx.fill();

        // Pointy Glasses & Glowing Gaze
        ctx.fillStyle = '#ffeb3b';
        ctx.shadowColor = '#ffeb3b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(15, -40 + bob, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Mantis Scythe Claws
        ctx.fillStyle = '#00e676';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, -10 + bob);
        ctx.quadraticCurveTo(65, -30 + bob, 75, 20 + bob);
        ctx.lineTo(55, 10 + bob);
        ctx.stroke();

        // Arcane Wand
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(60, -25 + bob, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 5: {
        // BOSS 5: Abyssal Cheep Leviathan (Deep-Sea Angler Terror)
        ctx.fillStyle = '#004d40';
        ctx.beginPath();
        ctx.ellipse(0, 0 + bob, width * 0.45, height * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#80cbc4';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glowing Angler Lure
        ctx.strokeStyle = '#00bcd4';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(20, -30 + bob);
        ctx.quadraticCurveTo(50, -80 + bob, 70, -60 + bob);
        ctx.stroke();

        // Lure Bulb
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(70, -60 + bob, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Giant Razor Fins
        ctx.fillStyle = '#00796b';
        ctx.beginPath();
        ctx.moveTo(-40, 0 + bob);
        ctx.lineTo(-85, -35 + bob);
        ctx.lineTo(-85, 35 + bob);
        ctx.closePath();
        ctx.fill();

        // Maw of Needles
        ctx.fillStyle = '#ffffff';
        for (let a = -0.3; a <= 0.3; a += 0.15) {
          ctx.beginPath();
          ctx.moveTo(35, Math.sin(a) * 30 + bob);
          ctx.lineTo(55, Math.sin(a) * 30 + bob);
          ctx.lineTo(35, Math.sin(a) * 30 + 6 + bob);
          ctx.fill();
        }
        break;
      }

      case 6: {
        // BOSS 6: Crystal Koopa Titan (Gemstone Colossus)
        ctx.fillStyle = '#4a148c';
        ctx.beginPath();
        ctx.roundRect(-width * 0.4, -height * 0.35 + bob, width * 0.8, height * 0.7, 15);
        ctx.fill();

        // Sprouting Prismatic Crystals
        const crystalColors = ['#e040fb', '#00e5ff', '#76ff03', '#ffd600'];
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = crystalColors[i % crystalColors.length];
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          const cx = -40 + i * 16;
          ctx.beginPath();
          ctx.moveTo(cx - 8, -height * 0.35 + bob);
          ctx.lineTo(cx, -height * 0.65 - (i % 2) * 15 + bob);
          ctx.lineTo(cx + 8, -height * 0.35 + bob);
          ctx.closePath();
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Gem Laser Eye Core
        ctx.fillStyle = '#ff007f';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(20, -5 + bob, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 7: {
        // BOSS 7: Grimm Bowser of Pharloom (Scarlet Nightmare Lord)
        ctx.fillStyle = '#b71c1c'; // Scarlet Cloak
        ctx.beginPath();
        ctx.moveTo(0, -65 + bob);
        ctx.lineTo(45, 60 + bob);
        ctx.lineTo(-45, 60 + bob);
        ctx.closePath();
        ctx.fill();

        // Scarlet Flame Bat Wings
        ctx.fillStyle = '#d50000';
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(0, -20 + bob);
        ctx.quadraticCurveTo(80, -80 + bob, 110, -20 + bob);
        ctx.quadraticCurveTo(60, 20 + bob, 0, 10 + bob);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -20 + bob);
        ctx.quadraticCurveTo(-80, -80 + bob, -110, -20 + bob);
        ctx.quadraticCurveTo(-60, 20 + bob, 0, 10 + bob);
        ctx.fill();

        // White Grimm Mask
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(12, -45 + bob, 16, 22, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Scarlet Slit Eyes
        ctx.fillStyle = '#d50000';
        ctx.beginPath();
        ctx.ellipse(18, -45 + bob, 3, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }

      case 8: {
        // BOSS 8: The Radiance Koopa God (Ascended Final Boss)
        // Blinding Solar Corona
        ctx.fillStyle = '#fff9c4';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 35;
        const rays = 12;
        for (let r = 0; r < rays; r++) {
          const angle = (r / rays) * Math.PI * 2 + time * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0 + bob);
          ctx.lineTo(Math.cos(angle - 0.15) * 85, Math.sin(angle - 0.15) * 85 + bob);
          ctx.lineTo(Math.cos(angle) * 115, Math.sin(angle) * 115 + bob);
          ctx.lineTo(Math.cos(angle + 0.15) * 85, Math.sin(angle + 0.15) * 85 + bob);
          ctx.closePath();
          ctx.fill();
        }

        // Ascended Divine Wings
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(-45, -30 + bob, 65, 25, -0.4, 0, Math.PI * 2);
        ctx.ellipse(-45, 30 + bob, 55, 20, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Golden Radiant Core & Crown
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0 + bob, 36, 0, Math.PI * 2);
        ctx.fill();

        // Divine Holy Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(12, -6 + bob, 6, 12, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
    }

    ctx.restore();
  },

  // Draw Silksong Hornet Sprite
  drawHornet(ctx, x, y, width, height, facingRight, state, time) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) ctx.scale(-1, 1);

    const bob = Math.sin(time * 6) * 2;

    // 1. Hornet Flowing Silk Cloak
    ctx.fillStyle = '#ad1457'; // Deep Silksong Crimson
    ctx.beginPath();
    ctx.moveTo(0, -10 + bob);
    ctx.lineTo(16, 20 + bob);
    ctx.lineTo(-16, 20 + bob);
    ctx.closePath();
    ctx.fill();

    // Inner cloak shadow
    ctx.fillStyle = '#880e4f';
    ctx.beginPath();
    ctx.moveTo(0, -6 + bob);
    ctx.lineTo(8, 20 + bob);
    ctx.lineTo(-4, 20 + bob);
    ctx.closePath();
    ctx.fill();

    // 2. Head / Mask (Iconic Hornet White & Black with Curved Horns)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -16 + bob, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-6, -24 + bob);
    ctx.quadraticCurveTo(-14, -40 + bob, -20, -36 + bob);
    ctx.quadraticCurveTo(-10, -28 + bob, -2, -26 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -24 + bob);
    ctx.quadraticCurveTo(14, -40 + bob, 20, -36 + bob);
    ctx.quadraticCurveTo(10, -28 + bob, 2, -26 + bob);
    ctx.closePath();
    ctx.fill();

    // Glowing Almond Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-3.5, -16 + bob, 2, 4.5, -0.2, 0, Math.PI * 2);
    ctx.ellipse(3.5, -16 + bob, 2, 4.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Iconic Silksong Needle Blade
    ctx.save();
    ctx.translate(14, 2 + bob);
    ctx.rotate(0.3 + Math.sin(time * 3) * 0.1);
    ctx.fillStyle = '#cfd8dc';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(5, 14);
    ctx.lineTo(-5, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Needle Thread Eyelet
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.arc(0, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  },

  // Draw Hornet's Trapping Cage (Appears after Radiance Koopa God is slain)
  drawHornetCage(ctx, x, y, width, height, time, hp, isBroken, hitFlash, freedTimer) {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2;

    if (!isBroken) {
      // Golden Silk Chains suspended from ceiling
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 16, 0);
      ctx.lineTo(cx - 16, y);
      ctx.moveTo(cx + 16, 0);
      ctx.lineTo(cx + 16, y);
      ctx.stroke();

      // Cage Base & Roof Dome
      ctx.fillStyle = hitFlash ? '#ffffff' : '#b78103';
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      // Roof Dome
      ctx.beginPath();
      ctx.arc(cx, y + 16, width / 2, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      // Floor
      ctx.beginPath();
      ctx.roundRect(x - 4, y + height - 12, width + 8, 12, 4);
      ctx.fill();
      ctx.stroke();

      // Hornet inside the cage
      Sprites.drawHornet(ctx, x + 8, y + 18, width - 16, height - 30, true, 'trapped', time);

      // Trapping Golden Bars
      ctx.strokeStyle = hitFlash ? '#ffffff' : '#ffd700';
      ctx.lineWidth = 3;
      const barCount = 5;
      for (let i = 0; i <= barCount; i++) {
        const bx = x + 6 + (i * (width - 12) / barCount);
        ctx.beginPath();
        ctx.moveTo(bx, y + 16);
        ctx.lineTo(bx, y + height - 12);
        ctx.stroke();
      }

      // Vulnerable Crystal Aura
      ctx.fillStyle = `rgba(0, 229, 255, ${0.15 + Math.sin(time * 8) * 0.1})`;
      ctx.beginPath();
      ctx.roundRect(x, y + 14, width, height - 24, 8);
      ctx.fill();

      // Fracture Cracks when damaged
      if (hp < 3) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 10);
        ctx.lineTo(cx + 4, cy + 6);
        ctx.lineTo(cx - 8, cy + 22);
        if (hp < 2) {
          ctx.moveTo(cx + 12, cy - 16);
          ctx.lineTo(cx - 2, cy);
          ctx.lineTo(cx + 18, cy + 18);
        }
        ctx.stroke();
      }

      // Overhead Strike Hint
      ctx.fillStyle = '#ffd700';
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('STRIKE WITH NAIL! ⚔️', cx, y - 14 + Math.sin(time * 6) * 3);
    } else {
      // Cage Shattered: Broken Bars on the ground
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(x - 4, y + height - 8, width + 8, 8);
      // Shattered Bar Debris
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y + height - 4);
      ctx.lineTo(x + 10, y + height - 16);
      ctx.moveTo(x + width - 10, y + height - 18);
      ctx.lineTo(x + width + 12, y + height - 4);
      ctx.stroke();

      // Hornet Standing Proud & Victorious beside Mario!
      const hopY = Math.max(0, 1 - (freedTimer || 0) * 2) * -30;
      Sprites.drawHornet(ctx, x + 8, y + 18 + hopY, width - 16, height - 30, false, 'freed', time);

      // Heart & Silk emotes floating above Hornet!
      ctx.fillStyle = '#e91e63';
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText('❤️ 🪡', cx, y - 8 + Math.sin(time * 5) * 4);
    }

    ctx.restore();
  }
};
