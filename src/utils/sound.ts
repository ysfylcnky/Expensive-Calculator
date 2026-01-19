// Utility to play a "Cha-Ching" sound using Web Audio API
// No external files needed!

export const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        // 1. High pitched "Ding" (Coins)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1200, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);

        gain1.gain.setValueAtTime(0.1, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start();
        osc1.stop(ctx.currentTime + 0.5);

        // 2. Cash Register Drawer Sound (visualize "Ka-Ching")
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(600, ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);

            gain2.gain.setValueAtTime(0.1, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc2.start();
            osc2.stop(ctx.currentTime + 0.4);
        }, 100);

    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export const playClickSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Very short, subtle "pop" or "tick"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
        // ignore
    }
};
