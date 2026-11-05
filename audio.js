// Mario Knight Silksong - Web Audio Synthesizer & Polyphonic BGM Engine
const BGM_NOTES = {
  REST: 0,
  B1: 61.74,
  C2: 65.41, Cs2: 69.30, D2: 73.42, Ds2: 77.78, E2: 82.41, F2: 87.31, Fs2: 92.50, G2: 98.00, Gs2: 103.83, A2: 110.00, As2: 116.54, B2: 123.47,
  C3: 130.81, Cs3: 138.59, D3: 146.83, Ds3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Gs3: 207.65, A3: 220.00, As3: 233.08, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
  C6: 1046.50, Cs6: 1108.73, D6: 1174.66, Ds6: 1244.51, E6: 1318.51
};

const BGM_THEMES = {
  title: {
    tempo: 104,
    stepDuration: (60 / 104) / 4, // 16th note step = ~0.144s
    length: 64, // 4 bars of 16 steps
    lead: [
      // Bar 1: Majestic Hollow Knight / Mario opening motif
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.C5,
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.G4, BGM_NOTES.REST,
      // Bar 2: Atmospheric cavern phrase
      BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.G4, BGM_NOTES.REST, BGM_NOTES.E4, BGM_NOTES.REST, BGM_NOTES.A4, BGM_NOTES.REST,
      BGM_NOTES.B4, BGM_NOTES.REST, BGM_NOTES.As4, BGM_NOTES.REST, BGM_NOTES.A4, BGM_NOTES.REST, BGM_NOTES.G4, BGM_NOTES.REST,
      // Bar 3: Silksong string rising melodic tension
      BGM_NOTES.E5, BGM_NOTES.G5, BGM_NOTES.A5, BGM_NOTES.REST, BGM_NOTES.F5, BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.E5,
      BGM_NOTES.REST, BGM_NOTES.C5, BGM_NOTES.D5, BGM_NOTES.B4, BGM_NOTES.REST, BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.REST,
      // Bar 4: Minor cadence & turnaround
      BGM_NOTES.G5, BGM_NOTES.Fs5, BGM_NOTES.F5, BGM_NOTES.Ds5, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.Gs4, BGM_NOTES.A4,
      BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.A4, BGM_NOTES.C5, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.B4, BGM_NOTES.REST
    ],
    bass: [
      // Bar 1: Am -> G
      BGM_NOTES.A2, BGM_NOTES.REST, BGM_NOTES.A3, BGM_NOTES.REST, BGM_NOTES.E3, BGM_NOTES.REST, BGM_NOTES.A3, BGM_NOTES.REST,
      BGM_NOTES.G2, BGM_NOTES.REST, BGM_NOTES.G3, BGM_NOTES.REST, BGM_NOTES.D3, BGM_NOTES.REST, BGM_NOTES.G3, BGM_NOTES.REST,
      // Bar 2: F -> Em
      BGM_NOTES.F2, BGM_NOTES.REST, BGM_NOTES.F3, BGM_NOTES.REST, BGM_NOTES.C3, BGM_NOTES.REST, BGM_NOTES.F3, BGM_NOTES.REST,
      BGM_NOTES.E2, BGM_NOTES.REST, BGM_NOTES.E3, BGM_NOTES.REST, BGM_NOTES.B2, BGM_NOTES.REST, BGM_NOTES.E3, BGM_NOTES.REST,
      // Bar 3: Dm -> C
      BGM_NOTES.D2, BGM_NOTES.REST, BGM_NOTES.D3, BGM_NOTES.REST, BGM_NOTES.A2, BGM_NOTES.REST, BGM_NOTES.D3, BGM_NOTES.REST,
      BGM_NOTES.C2, BGM_NOTES.REST, BGM_NOTES.C3, BGM_NOTES.REST, BGM_NOTES.G2, BGM_NOTES.REST, BGM_NOTES.C3, BGM_NOTES.REST,
      // Bar 4: F -> E7 (cadence)
      BGM_NOTES.F2, BGM_NOTES.REST, BGM_NOTES.F3, BGM_NOTES.REST, BGM_NOTES.G2, BGM_NOTES.REST, BGM_NOTES.G3, BGM_NOTES.REST,
      BGM_NOTES.E2, BGM_NOTES.REST, BGM_NOTES.Gs2, BGM_NOTES.REST, BGM_NOTES.B2, BGM_NOTES.REST, BGM_NOTES.E3, BGM_NOTES.REST
    ],
    arp: [
      // Shimmering cave arpeggio
      BGM_NOTES.A3, BGM_NOTES.C4, BGM_NOTES.E4, BGM_NOTES.A4, BGM_NOTES.E4, BGM_NOTES.C4, BGM_NOTES.A3, BGM_NOTES.E3,
      BGM_NOTES.G3, BGM_NOTES.B3, BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.D4, BGM_NOTES.B3, BGM_NOTES.G3, BGM_NOTES.D3,
      BGM_NOTES.F3, BGM_NOTES.A3, BGM_NOTES.C4, BGM_NOTES.F4, BGM_NOTES.C4, BGM_NOTES.A3, BGM_NOTES.F3, BGM_NOTES.C3,
      BGM_NOTES.E3, BGM_NOTES.G3, BGM_NOTES.B3, BGM_NOTES.E4, BGM_NOTES.B3, BGM_NOTES.G3, BGM_NOTES.E3, BGM_NOTES.B2,
      BGM_NOTES.D3, BGM_NOTES.F3, BGM_NOTES.A3, BGM_NOTES.D4, BGM_NOTES.A3, BGM_NOTES.F3, BGM_NOTES.D3, BGM_NOTES.A2,
      BGM_NOTES.C3, BGM_NOTES.E3, BGM_NOTES.G3, BGM_NOTES.C4, BGM_NOTES.G3, BGM_NOTES.E3, BGM_NOTES.C3, BGM_NOTES.G2,
      BGM_NOTES.F3, BGM_NOTES.A3, BGM_NOTES.C4, BGM_NOTES.F4, BGM_NOTES.G3, BGM_NOTES.B3, BGM_NOTES.D4, BGM_NOTES.G4,
      BGM_NOTES.E3, BGM_NOTES.Gs3, BGM_NOTES.B3, BGM_NOTES.E4, BGM_NOTES.B3, BGM_NOTES.Gs3, BGM_NOTES.E3, BGM_NOTES.REST
    ],
    drums: [
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', '', '', 'k', 'h',
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', '', '', '', 'h',
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', '', '', 'k', 'h',
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', 'k', '', '', ''
    ]
  },

  ambient: {
    tempo: 128,
    stepDuration: (60 / 128) / 4, // ~0.117s
    length: 64,
    lead: [
      // Bar 1: Catchy heroic adventure drive
      BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.C6, BGM_NOTES.REST,
      BGM_NOTES.B5, BGM_NOTES.A5, BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.C5, BGM_NOTES.REST,
      // Bar 2: Rhythmic bounce
      BGM_NOTES.F5, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.REST, BGM_NOTES.C6, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.REST,
      BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.G4, BGM_NOTES.REST,
      // Bar 3: Playful syncopated heroic melody
      BGM_NOTES.C5, BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.C5,
      BGM_NOTES.A4, BGM_NOTES.REST, BGM_NOTES.F4, BGM_NOTES.REST, BGM_NOTES.G4, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST,
      // Bar 4: Energetic turnaround
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.B4, BGM_NOTES.REST,
      BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.REST
    ],
    bass: [
      // Driving walking synth bass
      BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.C3, BGM_NOTES.E3,
      BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.D3, BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.D3, BGM_NOTES.G2, BGM_NOTES.B2,
      BGM_NOTES.F2, BGM_NOTES.F2, BGM_NOTES.C3, BGM_NOTES.F2, BGM_NOTES.F2, BGM_NOTES.C3, BGM_NOTES.F2, BGM_NOTES.A2,
      BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.B2, BGM_NOTES.D3,
      BGM_NOTES.A2, BGM_NOTES.A2, BGM_NOTES.E3, BGM_NOTES.A2, BGM_NOTES.F2, BGM_NOTES.F2, BGM_NOTES.C3, BGM_NOTES.F2,
      BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.D3, BGM_NOTES.G2, BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.C3,
      BGM_NOTES.F2, BGM_NOTES.F2, BGM_NOTES.C3, BGM_NOTES.F2, BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.D3, BGM_NOTES.G2,
      BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.E2, BGM_NOTES.G2, BGM_NOTES.C3, BGM_NOTES.REST, BGM_NOTES.G3, BGM_NOTES.REST
    ],
    arp: [
      // 16th note chiptune harmony
      BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4,
      BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.B4, BGM_NOTES.G4, BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.B4, BGM_NOTES.G4,
      BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.C5, BGM_NOTES.A4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.C5, BGM_NOTES.A4,
      BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4, BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.B4, BGM_NOTES.G4,
      BGM_NOTES.C4, BGM_NOTES.E4, BGM_NOTES.A4, BGM_NOTES.E4, BGM_NOTES.C4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.F4,
      BGM_NOTES.B3, BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.D4, BGM_NOTES.C4, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.E4,
      BGM_NOTES.C4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.F4, BGM_NOTES.D4, BGM_NOTES.G4, BGM_NOTES.B4, BGM_NOTES.G4,
      BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4, BGM_NOTES.E4, BGM_NOTES.C4, BGM_NOTES.G3, BGM_NOTES.REST
    ],
    drums: [
      'k', 'h', '', 'h', 's', 'h', '', 'h',
      'k', 'h', 'k', 'h', 's', 'h', '', 'o',
      'k', 'h', '', 'h', 's', 'h', '', 'h',
      'k', 'h', 'k', 'h', 's', 'h', 'k', 'o',
      'k', 'h', '', 'h', 's', 'h', '', 'h',
      'k', 'h', 'k', 'h', 's', 'h', '', 'o',
      'k', 'h', '', 'h', 's', 'h', '', 'h',
      'k', 'k', 's', 'h', 's', 's', 'k', 'o'
    ]
  },

  boss: {
    tempo: 156,
    stepDuration: (60 / 156) / 4, // ~0.096s
    length: 64,
    lead: [
      // Fast, aggressive Gothic battle riffs
      BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.F5, BGM_NOTES.A5, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.F5,
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.G5, BGM_NOTES.As5, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.G5,
      BGM_NOTES.F5, BGM_NOTES.E5, BGM_NOTES.D5, BGM_NOTES.Cs5, BGM_NOTES.D5, BGM_NOTES.E5, BGM_NOTES.F5, BGM_NOTES.G5,
      BGM_NOTES.A5, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.REST, BGM_NOTES.A4, BGM_NOTES.REST, BGM_NOTES.Cs5, BGM_NOTES.E5,
      BGM_NOTES.D5, BGM_NOTES.D5, BGM_NOTES.F5, BGM_NOTES.D5, BGM_NOTES.G5, BGM_NOTES.G5, BGM_NOTES.As5, BGM_NOTES.G5,
      BGM_NOTES.A5, BGM_NOTES.A5, BGM_NOTES.Cs6, BGM_NOTES.A5, BGM_NOTES.D6, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.REST,
      BGM_NOTES.As5, BGM_NOTES.A5, BGM_NOTES.G5, BGM_NOTES.F5, BGM_NOTES.E5, BGM_NOTES.F5, BGM_NOTES.G5, BGM_NOTES.E5,
      BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.A4, BGM_NOTES.REST, BGM_NOTES.D4, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST
    ],
    bass: [
      // Pumping double-time 16th bass
      BGM_NOTES.D2, BGM_NOTES.D2, BGM_NOTES.D3, BGM_NOTES.D2, BGM_NOTES.D2, BGM_NOTES.D3, BGM_NOTES.D2, BGM_NOTES.F2,
      BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.G3, BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.G3, BGM_NOTES.G2, BGM_NOTES.As2,
      BGM_NOTES.As2, BGM_NOTES.As2, BGM_NOTES.F3, BGM_NOTES.As2, BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G3, BGM_NOTES.C3,
      BGM_NOTES.A2, BGM_NOTES.A2, BGM_NOTES.E3, BGM_NOTES.A2, BGM_NOTES.A2, BGM_NOTES.Cs3, BGM_NOTES.E3, BGM_NOTES.A2,
      BGM_NOTES.D2, BGM_NOTES.D2, BGM_NOTES.D3, BGM_NOTES.D2, BGM_NOTES.G2, BGM_NOTES.G2, BGM_NOTES.G3, BGM_NOTES.G2,
      BGM_NOTES.A2, BGM_NOTES.A2, BGM_NOTES.A3, BGM_NOTES.A2, BGM_NOTES.D2, BGM_NOTES.D2, BGM_NOTES.D3, BGM_NOTES.D2,
      BGM_NOTES.As2, BGM_NOTES.As2, BGM_NOTES.F2, BGM_NOTES.As2, BGM_NOTES.C3, BGM_NOTES.C3, BGM_NOTES.G2, BGM_NOTES.C3,
      BGM_NOTES.D2, BGM_NOTES.A2, BGM_NOTES.D3, BGM_NOTES.A2, BGM_NOTES.D2, BGM_NOTES.REST, BGM_NOTES.D3, BGM_NOTES.REST
    ],
    arp: [
      // Rapid menacing arpeggio runs
      BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.D5, BGM_NOTES.A4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.D5, BGM_NOTES.A4,
      BGM_NOTES.G4, BGM_NOTES.As4, BGM_NOTES.D5, BGM_NOTES.As4, BGM_NOTES.G4, BGM_NOTES.As4, BGM_NOTES.D5, BGM_NOTES.As4,
      BGM_NOTES.D4, BGM_NOTES.F4, BGM_NOTES.As4, BGM_NOTES.F4, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4,
      BGM_NOTES.Cs4, BGM_NOTES.E4, BGM_NOTES.A4, BGM_NOTES.E4, BGM_NOTES.Cs4, BGM_NOTES.E4, BGM_NOTES.A4, BGM_NOTES.E4,
      BGM_NOTES.D4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.D5, BGM_NOTES.G4, BGM_NOTES.As4, BGM_NOTES.D5, BGM_NOTES.G5,
      BGM_NOTES.A4, BGM_NOTES.Cs5, BGM_NOTES.E5, BGM_NOTES.A5, BGM_NOTES.F5, BGM_NOTES.D5, BGM_NOTES.A4, BGM_NOTES.F4,
      BGM_NOTES.G4, BGM_NOTES.As4, BGM_NOTES.D5, BGM_NOTES.As4, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.C5, BGM_NOTES.G4,
      BGM_NOTES.F4, BGM_NOTES.D4, BGM_NOTES.A3, BGM_NOTES.F3, BGM_NOTES.D3, BGM_NOTES.REST, BGM_NOTES.A3, BGM_NOTES.REST
    ],
    drums: [
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'k', 's', 's', 'k', 'k', 's', 'o',
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'h', 's', 'h', 'k', 'k', 's', 'o',
      'k', 'k', 's', 'k', 's', 's', 'k', 'o'
    ]
  },

  story: {
    tempo: 96,
    stepDuration: (60 / 96) / 4,
    length: 32,
    lead: [
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.B5, BGM_NOTES.REST, BGM_NOTES.A5, BGM_NOTES.REST,
      BGM_NOTES.F5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.D5, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST,
      BGM_NOTES.C5, BGM_NOTES.REST, BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.G5, BGM_NOTES.REST, BGM_NOTES.Fs5, BGM_NOTES.REST,
      BGM_NOTES.E5, BGM_NOTES.REST, BGM_NOTES.B4, BGM_NOTES.REST, BGM_NOTES.E4, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST
    ],
    bass: [
      BGM_NOTES.E2, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.E3, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST,
      BGM_NOTES.D2, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.D3, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST,
      BGM_NOTES.C2, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.C3, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST,
      BGM_NOTES.B1, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.B2, BGM_NOTES.REST, BGM_NOTES.REST, BGM_NOTES.REST
    ],
    arp: [
      BGM_NOTES.B3, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.B4, BGM_NOTES.G4, BGM_NOTES.E4, BGM_NOTES.B3, BGM_NOTES.G3,
      BGM_NOTES.A3, BGM_NOTES.D4, BGM_NOTES.F4, BGM_NOTES.A4, BGM_NOTES.F4, BGM_NOTES.D4, BGM_NOTES.A3, BGM_NOTES.F3,
      BGM_NOTES.G3, BGM_NOTES.C4, BGM_NOTES.E4, BGM_NOTES.G4, BGM_NOTES.E4, BGM_NOTES.C4, BGM_NOTES.G3, BGM_NOTES.E3,
      BGM_NOTES.Fs3, BGM_NOTES.B3, BGM_NOTES.Ds4, BGM_NOTES.Fs4, BGM_NOTES.Ds4, BGM_NOTES.B3, BGM_NOTES.Fs3, BGM_NOTES.REST
    ],
    drums: [
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', '', '', '', '',
      'k', '', '', '', '', '', '', 'h',
      '', '', '', '', '', '', '', ''
    ]
  }
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmMasterGain = null;
    this.bgmPlaying = false;
    this.bgmSchedulerTimer = null;
    this.currentTheme = 'silence';
    this.stepIndex = 0;
    this.nextNoteTime = 0;
    this.noiseBuffer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        try {
          this.bgmMasterGain = this.ctx.createGain();
          this.bgmMasterGain.gain.setValueAtTime(this.muted ? 0 : 0.40, this.ctx.currentTime);

          const compressor = this.ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
          compressor.knee.setValueAtTime(10, this.ctx.currentTime);
          compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
          compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
          compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

          this.bgmMasterGain.connect(compressor);
          compressor.connect(this.ctx.destination);

          // Pre-generate 0.5s of white noise for chiptune percussion
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
          this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = this.noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
        } catch (e) {}
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      if (this.bgmMasterGain && this.ctx) {
        this.bgmMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      this.stopBGM();
    } else {
      this.init();
      if (this.bgmMasterGain && this.ctx) {
        this.bgmMasterGain.gain.setValueAtTime(0.40, this.ctx.currentTime);
      }
      if (this.currentTheme && this.currentTheme !== 'silence') {
        this.startBGM(this.currentTheme);
      }
    }
    return !this.muted;
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playSlash() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // White noise / metallic swoosh
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playPogo() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playMonsterDeath() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (err) {}
  }

  playCageCrack() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (err) {}
  }

  playCageShatter() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587.33, 880.00, 1174.66, 1760.00].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.05 + 0.35);

        gain.gain.setValueAtTime(0.25, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.42);
      });
    } catch (err) {}
  }

  playSoulAbsorb() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playSoulFullReady() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  playFocusHeal() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Harmonious shimmering chord
    [261.63, 329.63, 392.00, 523.25, 659.25].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.5);

      gain.gain.setValueAtTime(0.25 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  playDash() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    noise.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playFireball() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  playGroundSlam() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playThunder() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playTornado() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 50);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playMeteor() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  playBlackHole() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.62);
  }

  playPause() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(330, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playBossRoar() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.62);
  }

  playHurt() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [220, 207.65, 196.00, 185.00].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0.3, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.18 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.36);
    });
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.35 } // C6
    ];
    let offset = 0;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + offset);

      gain.gain.setValueAtTime(0.35, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + note.d + 0.05);

      offset += note.d + 0.02;
    });
  }

  // Polyphonic Multi-Voice Synthesis Channels
  playLeadNote(freq, time, duration, theme) {
    if (!freq || this.muted || !this.ctx || !this.bgmMasterGain) return;
    try {
      const isBoss = (theme === 'boss');
      const isAcoustic = (theme === 'title' || theme === 'story');

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = isBoss ? 'sawtooth' : (isAcoustic ? 'triangle' : 'square');
      osc.frequency.setValueAtTime(freq, time);

      // Subtle vibrato on sustained notes
      if (duration > 0.22) {
        osc.frequency.setTargetAtTime(freq * 1.015, time + 0.1, 0.04);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isBoss ? 2800 : (isAcoustic ? 1900 : 2200), time);

      const peakVol = isBoss ? 0.16 : (isAcoustic ? 0.18 : 0.13);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(peakVol, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(peakVol * 0.7, time + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playBassNote(freq, time, duration, isBoss) {
    if (!freq || this.muted || !this.ctx || !this.bgmMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = isBoss ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isBoss ? 450 : 360, time);

      const vol = isBoss ? 0.20 : 0.24;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playArpNote(freq, time, duration) {
    if (!freq || this.muted || !this.ctx || !this.bgmMasterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.07, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.85);

      osc.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  playDrum(type, time, isBoss) {
    if (!type || this.muted || !this.ctx || !this.bgmMasterGain) return;
    try {
      if (type === 'k') {
        // Punchy Chiptune Kick
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isBoss ? 150 : 130, time);
        osc.frequency.exponentialRampToValueAtTime(35, time + 0.07);

        gain.gain.setValueAtTime(0.38, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc.start(time);
        osc.stop(time + 0.085);
      } else if (type === 's' && this.noiseBuffer) {
        // Snappy Chiptune Snare
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, time);
        filter.Q.value = 2.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.24, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);

        noise.start(time);
        noise.stop(time + 0.095);

        // Body pop
        const body = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();
        body.type = 'triangle';
        body.frequency.setValueAtTime(190, time);
        body.frequency.exponentialRampToValueAtTime(70, time + 0.05);
        bodyGain.gain.setValueAtTime(0.18, time);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        body.connect(bodyGain);
        bodyGain.connect(this.bgmMasterGain);
        body.start(time);
        body.stop(time + 0.055);
      } else if ((type === 'h' || type === 'o') && this.noiseBuffer) {
        // Closed / Open Hi-hat
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(type === 'o' ? 5200 : 7200, time);

        const dur = (type === 'o') ? 0.15 : 0.035;
        const vol = (type === 'o') ? 0.09 : 0.045;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);

        noise.start(time);
        noise.stop(time + dur + 0.01);
      }
    } catch (e) {}
  }

  // Atmospheric background synthesizer with lookahead scheduling
  startBGM(theme = 'ambient') {
    if (!BGM_THEMES[theme]) theme = 'ambient';
    if (this.currentTheme === theme && this.bgmPlaying) return;
    this.currentTheme = theme;
    if (this.muted) return;

    this.init();
    if (!this.ctx) return;

    this.stopBGM();

    const t = BGM_THEMES[theme];
    this.bgmPlaying = true;
    this.stepIndex = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    if (this.bgmMasterGain) {
      this.bgmMasterGain.gain.setValueAtTime(0.40, this.ctx.currentTime);
    }

    const lookahead = 0.16; // 160ms lookahead
    const schedule = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
        const s = this.stepIndex % t.length;
        const dur = t.stepDuration;

        if (t.bass && t.bass[s] !== undefined) {
          this.playBassNote(t.bass[s], this.nextNoteTime, dur * 1.5, theme === 'boss');
        }
        if (t.lead && t.lead[s] !== undefined) {
          this.playLeadNote(t.lead[s], this.nextNoteTime, dur * 1.4, theme);
        }
        if (t.arp && t.arp[s] !== undefined) {
          this.playArpNote(t.arp[s], this.nextNoteTime, dur * 0.9);
        }
        if (t.drums && t.drums[s]) {
          this.playDrum(t.drums[s], this.nextNoteTime, theme === 'boss');
        }

        this.stepIndex = (this.stepIndex + 1) % t.length;
        this.nextNoteTime += dur;
      }
    };

    schedule();
    this.bgmSchedulerTimer = setInterval(schedule, 35);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmSchedulerTimer) {
      clearInterval(this.bgmSchedulerTimer);
      this.bgmSchedulerTimer = null;
    }
  }

  pauseBGM() {
    if (this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain.gain.setTargetAtTime(0.08, this.ctx.currentTime, 0.08);
    }
  }

  resumeBGM() {
    if (this.bgmMasterGain && this.ctx && !this.muted) {
      this.bgmMasterGain.gain.setTargetAtTime(0.40, this.ctx.currentTime, 0.08);
    }
    if (!this.bgmPlaying && this.currentTheme && this.currentTheme !== 'silence' && !this.muted) {
      this.startBGM(this.currentTheme);
    }
  }
}

window.soundEngine = new Proxy(new SoundEngine(), {
  get(target, prop) {
    if (prop in target) {
      const val = target[prop];
      if (typeof val === 'function') {
        return function(...args) {
          try {
            return val.apply(target, args);
          } catch (err) {
            return null;
          }
        };
      }
      return val;
    }
    // Return safe no-op function for any undefined sound methods
    return function() { return null; };
  }
});
