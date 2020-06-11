import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { CanvasMouseEvent } from "./core/event/CanvasMouseEvent";
import { vec2 } from "./core/math2d";

export class LineDashAnimationApplication extends Canvas2DApplication {
    private trans = false
    private _lineDashOffset: number = 0
    private _mouseX: number = 0
    private _mouseY: number = 0
    private _pattern: CanvasPattern | null = null

    // 目的地坐标
    private destVec: vec2
    private curVec: vec2

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.isSupportMouseMove = true
        this.destVec = new vec2(this.canvas.width * 0.5, this.canvas.height * 0.5)
        this.curVec = new vec2(this.canvas.width * 0.5, this.canvas.height * 0.5)
    }

    public dispatchMouseMove(evt: CanvasMouseEvent): void {
        this._mouseX = evt.canvasPosition.x
        this._mouseY = evt.canvasPosition.y
    }

    public dispatchMouseDown(evt: CanvasMouseEvent): void {
        if (evt.button == 2) {
            console.log('move here')
            this.destVec = evt.canvasPosition
        }
    }

    public render(): void {
        if (this.context2D === null) { return }

        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // this._updateLineDash()
        // this.strokeCoord(110, 110, this.canvas.width - 20, -100)
        this.strokeGrid()
        this.fillPatternRect(10, 10, this.canvas.width - 20, this.canvas.height - 20, 'no-repeat')
        this.drawCanvasCoordCenter()
        this.doTransform()
        this.drawCoordInfo(`[${this._mouseX},${this._mouseY}]`, this._mouseX, this._mouseY)
    }

    public doTransform(): void {
        if (this.context2D === null) return

        let width: number = 100
        let height: number = 60

        this.context2D.save()
        const curDistance: number = this.distanceVec(this.curVec, this.destVec)
        if (curDistance !== 0) {
            const sped: number = curDistance > 100 ? 4 : 1
            if (this.curVec.x !== this.destVec.x) {
                if (this.curVec.x > this.destVec.x) {
                    this.curVec.x -= sped
                } else {
                    this.curVec.x += sped
                }
            }

            if (this.curVec.y !== this.destVec.y) {
                if (this.curVec.y > this.destVec.y) {
                    this.curVec.y -= sped
                } else {
                    this.curVec.y += sped
                }
            }
        }
        this.context2D.translate(this.curVec.x - (width * 0.5), this.curVec.y - (height * 0.5))

        this.fillRect(0, 0, width, height, '#336655')
        this.fillText('奎因王', (width * 0.5)-15, (height * 0.5)-5, 'white')

        this.context2D.restore()
    }

    public fillPatternRect(x: number, y: number, w: number, h: number,
        repeat: Repeatition = 'repeat'): void {
        if (this.context2D == null) return

        if (!this._pattern) {
            let img: HTMLImageElement = document.createElement('img') as HTMLImageElement
            img.src = './assets/logo.jpg'
            img.onload = (ev: Event) => {
                if (this.context2D === null) return
                this._pattern = this.context2D.createPattern(img, repeat)
                this.context2D.save()
                if (this._pattern !== null) {
                    this.context2D.fillStyle = this._pattern
                    this.context2D.beginPath()
                    this.context2D.rect(x, y, w, h)
                    this.context2D.fill()
                }
                this.context2D.restore()
            }
        } else {
            this.context2D.save()
            if (this._pattern !== null) {
                this.context2D.fillStyle = this._pattern
                this.context2D.beginPath()
                this.context2D.rect(x, y, w, h)
                this.context2D.fill()
            }
            this.context2D.restore()
        }

    }
}

type Repeatition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
class RenderState {
    public lineWidth: number = 1;
    public strokeStyle: string = 'red';
    public fillStyle: string = 'green';

    public clone(): RenderState {
        let state: RenderState = new RenderState();
        state.lineWidth = this.lineWidth;
        state.strokeStyle = this.strokeStyle;
        state.fillStyle = this.fillStyle;
        return state;
    }

    public toString(): string {
        return JSON.stringify(this, null, ' ');
    }
}

class RenderStateStack {
    private _stack: RenderState[] = [new RenderState()];
    private get _currentState(): RenderState {
        return this._stack[this._stack.length - 1];
    }

    public save(): void {
        this._stack.push(this._currentState.clone());
    }

    public restore(): void {
        this._stack.pop();
    }

    public get lineWidth(): number {
        return this._currentState.lineWidth;
    }

    public set lineWidth(value: number) {
        this._currentState.lineWidth = value;
    }

    public get strokeStyle(): string {
        return this._currentState.strokeStyle;
    }

    public set strokeStyle(value: string) {
        this._currentState.strokeStyle = value;
    }

    public get fillStyle(): string {
        return this._currentState.strokeStyle;
    }

    public set fillStyle(value: string) {
        this._currentState.strokeStyle = value;
    }

    public printCurrentStateInfo(): void {
        console.log(this._currentState.toString());
    }
}

export enum EImageFillType {
    STRETCH,
    REPEAT,
    REPEAT_X,
    REPEAT_Y
}
