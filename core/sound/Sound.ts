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
    inputType: 'record' | 'input'

    audioContext: AudioContext
    source: AudioBufferSourceNode
    analyser: AnalyserNode
    public playing: boolean = false

    constructor(inputType: 'record' | 'input' = 'record') {
        this.audioContext = new AudioContext();
        this.inputType = inputType

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
        if (this.inputType === 'input') {
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
        else if (this.inputType === 'record') {
            const mediaDevices = window.navigator.mediaDevices
            mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 44100, // 采样率
                    channelCount: 2,   // 声道
                }
            }).then((mediaStream: MediaStream) => {
                console.log(mediaStream);
                let mediaNode = this.audioContext.createMediaStreamSource(mediaStream);
                mediaNode.connect(this.audioContext.destination);
                let jsNode = this.createJSNode()

                jsNode.connect(this.analyser);
                jsNode.onaudioprocess = (event) => {
                    let audioBuffer = event.inputBuffer;
                    let leftChannelData = audioBuffer.getChannelData(0),
                        rightChannelData = audioBuffer.getChannelData(1);
                    console.log(leftChannelData, rightChannelData);
                };
                // 把mediaNode连接到jsNode
                mediaNode.connect(jsNode);
            }).catch(error => {
                // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
                // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误 
                switch (error.code || error.name) {
                    case 'PERMISSION_DENIED':
                    case 'PermissionDeniedError':
                        new Error('用户拒绝提供信息。');
                        break;
                    case 'NOT_SUPPORTED_ERROR':
                    case 'NotSupportedError':
                        new Error('浏览器不支持硬件设备。');
                        break;
                    case 'MANDATORY_UNSATISFIED_ERROR':
                    case 'MandatoryUnsatisfiedError':
                        new Error('无法发现指定的硬件设备。');
                        break;
                    default:
                        new Error('无法打开麦克风。异常信息:' + (error.code || error.name));
                        break;
                }
            });
        }
    }
    private createJSNode(): ScriptProcessorNode {
        const BUFFER_SIZE = 4096;
        const INPUT_CHANNEL_COUNT = 2;
        const OUTPUT_CHANNEL_COUNT = 2;
        let creator = this.audioContext.createScriptProcessor
        creator = creator.bind(this.audioContext);
        return creator(BUFFER_SIZE,
            INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);

    }

}

