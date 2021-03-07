import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { Tank } from "./core/champion/Tank";
import { CanvasKeyBoardEvent } from "./core/event/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./core/event/CanvasMouseEvent";
import { Math2D } from "./core/math2d";

export class TankApplication extends Canvas2DApplication {
    private _tank: Tank

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.isSupportMouseMove = true
        this._tank = new Tank()
        this._tank.targetX = this._tank.x = canvas.width * 0.5
        this._tank.targetY = this._tank.y = canvas.height * 0.5
        this._tank.scaleX = 2
        this._tank.scaleY = 2

        this._tank.showCoord = false
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
        this.drawTank()
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        this._tank.update(intervalSec)
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