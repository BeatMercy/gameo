interface AudioWorkletProcessor {
    readonly port: MessagePort;
    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ): boolean;
}

declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(
    name: string,
    processorCtor: (new (
        options?: AudioWorkletNodeOptions
    ) => AudioWorkletProcessor) & {
        parameterDescriptors?: AudioParamDescriptor[];
    }
): any

/*     const recorderNode = new window.AudioWorkletNode(
      audioContext,
      'recorder-worklet'
    );
    yourSourceNode.connect(recorderNode);
    recorderNode.connect(audioContext.destination);
    recorderNode.port.onmessage = (e) => {
      if (e.data.eventType === 'data') {
        const audioData = e.data.audioBuffer;
        // process pcm data
      }
      if (e.data.eventType === 'stop') {
        // recording has stopped
      }
    };
    recorderNode.parameters.get('isRecording').setValueAtTime(1, time);
    recorderNode.parameters.get('isRecording').setValueAtTime(
      0,
      time + duration
    );
    yourSourceNode.start(time); */

export default class RecorderWorkletProcessor extends AudioWorkletProcessor {
    private _bufferSize: number
    private _bytesWritten: number
    private _buffer: Float32Array

    static get parameterDescriptors() {
        return [{
            name: 'isRecording',
            defaultValue: 0
        }];
    }

    constructor() {
        super();
        this._bufferSize = 2048;
        this._buffer = new Float32Array(this._bufferSize);
        this._initBuffer();
    }

    _initBuffer() {
        this._bytesWritten = 0;
    }

    _isBufferEmpty() {
        return this._bytesWritten === 0;
    }

    _isBufferFull() {
        return this._bytesWritten === this._bufferSize;
    }

    _appendToBuffer(value: number) {
        if (this._isBufferFull()) {
            this._flush();
        }

        this._buffer[this._bytesWritten] = value;
        this._bytesWritten += 1;
    }

    _flush() {
        let buffer = this._buffer;
        if (this._bytesWritten < this._bufferSize) {
            buffer = buffer.slice(0, this._bytesWritten);
        }

        this.port.postMessage({
            eventType: 'data',
            audioBuffer: buffer
        });

        this._initBuffer();
    }

    _recordingStopped() {
        this.port.postMessage({
            eventType: 'stop'
        });
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        const isRecordingValues = parameters.isRecording;
        for (
            let dataIndex = 0;
            dataIndex < isRecordingValues.length;
            dataIndex++
        ) {
            const shouldRecord = isRecordingValues[dataIndex] === 1;
            if (!shouldRecord && !this._isBufferEmpty()) {
                this._flush();
                this._recordingStopped();
            }

            if (shouldRecord) {
                this._appendToBuffer(inputs[0][0][dataIndex]);
            }
        }

        return true;
    }

}