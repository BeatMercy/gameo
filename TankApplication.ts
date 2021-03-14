import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { Tank } from "./core/champion/Tank";
import { CanvasKeyBoardEvent } from "./core/event/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./core/event/CanvasMouseEvent";
import { Math2D } from "./core/math2d";
import { Visualizer } from "./core/sound/Sound";

export class TankApplication extends Canvas2DApplication {
    private _tank: Tank
    private _visual: Visualizer
    private _fileInput: HTMLInputElement

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.isSupportMouseMove = true
        this._tank = new Tank()
        this._tank.targetX = this._tank.x = canvas.width * 0.5
        this._tank.targetY = this._tank.y = canvas.height * 0.5
        this._tank.scaleX = 1
        this._tank.scaleY = 1

        this._tank.showCoord = false

        this._visual = new Visualizer()
        this._fileInput = document.getElementById('imagefile') as HTMLInputElement
        this._fileInput.onchange = (e: Event): any => {
            if (!this._fileInput.files || this._fileInput.files.length == 0) return
            this._visual.file = this._fileInput.files[0]
            this._visual.start()
        }

    }

    public stop(): void {
        super.stop()
        this._tank.initYAxis = true
    }

    public drawTank(): void {
        this._tank.draw(this)
        if (this._tank.initYAxis) this._tank.initYAxis = false
    }

    public render(): void {
        if (this.context2D == null) return
        let centX: number
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.strokeGrid()
        this.drawCanvasCoordCenter()
        if (this._visual.playing) {
            this.context2D.save()
            const gradient = this.context2D.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(1, '#0f0');
            gradient.addColorStop(0.5, '#ff0');
            gradient.addColorStop(0, '#fc2');
            this.context2D.fillStyle = gradient
            this._visual.doAnalyser(100, (meterValue: number, meterIndex: number) => {
                if (!this.context2D) return
                this.context2D.fillRect(meterIndex * 12, this.context2D.canvas.height - meterValue + 2 - 50,
                    10, this.context2D.canvas.height);
            })
            this.context2D.restore()
        }
        this.drawTank()
    }

    public update(elapsedMsec: number, intervalSec: number, pressingKeys: Array<CanvasKeyBoardEvent>): void {
        this._tank.update(intervalSec, pressingKeys)
    }

    public dispatchKeyPress(evt: CanvasKeyBoardEvent, pressingKeys: Array<CanvasKeyBoardEvent>): void {
        this._tank.onKeyPress(evt, pressingKeys)
    }
    public dispatchMouseDown(evt: CanvasMouseEvent): void {
        if (evt.button == 2) {
            this._tank.onMouseMove(evt)
        }
    }

    public dispatchMouseMove(evt: CanvasMouseEvent) {
        // this._tank.onMouseMove(evt)
    }
}