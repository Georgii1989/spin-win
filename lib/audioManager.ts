import { Howl } from 'howler';

class AudioManager {
  private sounds = new Map<string, Howl>();
  private initialized = false;
  private volume = 0.5;

  init(): void {
    if (this.initialized) return;
    
    this.sounds.set('spin', new Howl({
      src: [this.generateSpinSound()],
      volume: this.volume,
      loop: true,
    }));
    
    this.sounds.set('stop', new Howl({
      src: [this.generateStopSound()],
      volume: this.volume * 0.8,
    }));
    
    this.sounds.set('win', new Howl({
      src: [this.generateWinSound()],
      volume: this.volume * 0.9,
    }));
    
    this.sounds.set('jackpot', new Howl({
      src: [this.generateJackpotSound()],
      volume: this.volume,
    }));
    
    this.sounds.set('click', new Howl({
      src: [this.generateClickSound()],
      volume: this.volume * 0.6,
    }));
    
    this.sounds.set('tension', new Howl({
      src: [this.generateTensionSound()],
      volume: this.volume * 0.7,
      loop: true,
    }));
    
    this.initialized = true;
  }

  private generateSpinSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 0.5;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 200 + (t / duration) * 100;
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.1 * (1 - t / duration);
    }
    
    return this.bufferToDataURL(buffer);
  }

  private generateStopSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 0.15;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 150 * t) * 0.3 * Math.exp(-t * 10);
    }
    
    return this.bufferToDataURL(buffer);
  }

  private generateWinSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 0.8;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    const notes = [523.25, 659.25, 783.99];
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      for (let j = 0; j < notes.length; j++) {
        const noteStart = (j * duration) / notes.length;
        if (t >= noteStart) {
          const noteT = t - noteStart;
          sample += Math.sin(2 * Math.PI * notes[j] * noteT) * 0.1 * Math.exp(-noteT * 3);
        }
      }
      
      data[i] = sample;
    }
    
    return this.bufferToDataURL(buffer);
  }

  private generateJackpotSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 1.5;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 440 * Math.pow(2, t);
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 * (1 - t / duration);
    }
    
    return this.bufferToDataURL(buffer);
  }

  private generateClickSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 0.05;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / length);
    }
    
    return this.bufferToDataURL(buffer);
  }

  private generateTensionSound(): string {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 2.0;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const freq = 100 + (t / duration) * 300;
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.15 * (t / duration);
    }
    
    return this.bufferToDataURL(buffer);
  }

  private bufferToDataURL(buffer: AudioBuffer): string {
    const data = buffer.getChannelData(0);
    const wav = this.createWAV(data, buffer.sampleRate);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private createWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    const writeString = (offset: number, str: string): void => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);
    
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    
    return buffer;
  }

  play(soundName: string): void {
    if (!this.initialized) this.init();
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  stop(soundName: string): void {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.stop();
    }
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    this.sounds.forEach((sound: Howl) => {
      sound.volume(this.volume);
    });
  }
}

export const audioManager = new AudioManager();
