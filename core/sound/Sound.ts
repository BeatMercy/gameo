export default class Sound {
    public context: AudioContext
    public oscillator: OscillatorNode
    public gainNode: GainNode


    constructor(context: AudioContext) {
        this.context = context;
    }

    init() {
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
    }

    play(volume?: number) {
        this.init();

        this.gainNode.gain.setValueAtTime(volume || 0.5, this.context.currentTime);

        this.oscillator.start();
    }

    stop() {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
        this.oscillator.stop(this.context.currentTime + 1);
    }

    public static getSound(): Sound {
        const s = new Sound(new AudioContext())
        s.init()
        return s
    }
}