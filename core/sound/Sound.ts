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
export class Visualizer {
    file: File
    fileName: string
    audioContext: AudioContext
    source: AudioBufferSourceNode
    analyser: AnalyserNode
    public playing: boolean = false

    prepareAPI() {
        this.audioContext = new AudioContext();
    }

    visualize(buffer: AudioBuffer) {
        this.source = this.audioContext.createBufferSource()
        this.analyser = this.audioContext.createAnalyser()

        this.source.connect(this.analyser)
        this.analyser.connect(this.audioContext.destination)
        this.source.buffer = buffer
        this.source.start(0)
        this.playing = true

    }

    doAnalyser(meterNum: number, drawMeter: (meterValue: number, meterIndex: number) => void) {
        const array = new Uint8Array(this.analyser.frequencyBinCount)
        this.analyser.getByteFrequencyData(array)
        var step = Math.round(array.length / meterNum); // 计算从analyser中的采样步长
        //对信源数组进行抽样遍历，画出每个频谱条
        for (var i = 0; i < meterNum; i++) {
            drawMeter(array[i * step], i)
        }
    }

    start() {
        const that = this //当前this指代Visualizer对象，赋值给that以以便在其他地方使用
        const file = this.file //从Visualizer对象上获取前面得到的文件
        const fr = new FileReader() //实例化一个FileReader用于读取文件
        fr.onload = (e: ProgressEvent<FileReader>) => { //文件读取完后调用此函数
            if (!e.target) return
            const fileResult: ArrayBuffer = <ArrayBuffer>e.target.result; //这是读取成功得到的结果ArrayBuffer数据
            var audioContext = that.audioContext; //从Visualizer得到最开始实例化的AudioContext用来做解码ArrayBuffer

            audioContext.decodeAudioData(fileResult,
                (buffer: AudioBuffer) => { that.visualize(buffer) },
                (e: Error) => { console.log("!哎玛，文件解码失败:(") });
        };
        fr.readAsArrayBuffer(file);
    }
}

