import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { Tank } from "./core/champion/Tank";
import { CanvasKeyBoardEvent } from "./core/event/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./core/event/CanvasMouseEvent";
import { vec2 } from "./core/math2d";
import { Visualizer } from "./core/sound/Sound";
import AstarAlgorithm from "./core/util/AstartAlgorithm";
import ImageUtil from "./core/util/ImageUtil";

export class TankApplication extends Canvas2DApplication {
    private _tank: Tank
    private _visual: Visualizer
    private _fileInput: HTMLInputElement
    private _mapImg: HTMLCanvasElement
    private astarAlgorithm: AstarAlgorithm = new AstarAlgorithm([])
    private path: Array<vec2>
    private pathIdx = 0;

    public constructor(canvas: HTMLCanvasElement, mapImg?: HTMLCanvasElement) {
        super(canvas)
        this.isSupportMouseMove = true
        this._tank = new Tank()
        this._tank.targetX = this._tank.x = canvas.width * 0.5
        this._tank.targetY = this._tank.y = canvas.height * 0.5
        this._tank.scaleX = 1
        this._tank.scaleY = 1

        this._tank.showCoord = false
        this._tank.x = canvas.width / 2 - 10
        this._visual = new Visualizer()
        this._fileInput = document.getElementById('imagefile') as HTMLInputElement
        this._fileInput.onchange = (e: Event): any => {
            if (!this._fileInput.files || this._fileInput.files.length == 0) return
            this._visual.file = this._fileInput.files[0]
            this._visual.start()
        }
        if (mapImg) {
            this._mapImg = mapImg
            this.generateMapByImg()
        }
    }


    public stop(): void {
        super.stop()
        this._tank.initYAxis = true
    }

    public generateMapByImg(): void {
        const mapYMax = this._mapImg.height
        const mapXMax = this._mapImg.width
        const uints = new Uint8Array(ImageUtil.canvasToArrayBuffer(this._mapImg) || [])
        if (uints.length == 0) return
        const greyUints: Uint8Array =
            ImageUtil.uintsRGBA2Grey(uints, mapXMax, mapYMax)
        const mapGreyUints = Array.from(greyUints.filter((v, i) => i % 4 === 0))

        const mapDatas: Array<Array<number>> = []
        // 一维数组，根据 宽高划分成二位地图数据
        Array.from({ length: mapYMax }).forEach((v, y) =>
            mapDatas.push(
                mapGreyUints.slice(y * mapXMax, (y + 1) * mapXMax)
                    //colorValue 0 代表黑色 即墙体1
                    .map(colorValue => colorValue == 0 ? 1 : 0)))

        const nextImgDatas = new ImageData(new Uint8ClampedArray(greyUints), mapXMax, mapYMax)
        this.context2D?.putImageData(nextImgDatas, 0, 0)
        this.astarAlgorithm.sourceMap = mapDatas
    }

    public caculatePath(start: vec2, end: vec2): Array<vec2> {
        this.astarAlgorithm.startPos = start
        this.astarAlgorithm.endPos = end
        this.astarAlgorithm.startPos.x = parseInt(this.astarAlgorithm.startPos.x.toFixed(0))
        this.astarAlgorithm.startPos.y = parseInt(this.astarAlgorithm.startPos.y.toFixed(0))
        this.astarAlgorithm.endPos.x = parseInt(this.astarAlgorithm.endPos.x.toFixed(0))
        this.astarAlgorithm.endPos.y = parseInt(this.astarAlgorithm.endPos.y.toFixed(0))
        return this.astarAlgorithm.caculateVecChain()
    }

    public drawTank(): void {
        this._tank.draw(this)
        if (this._tank.initYAxis) this._tank.initYAxis = false
    }

    public render(): void {
        if (this.context2D == null) return
        const ctx = this._mapImg.getContext('2d')
        if (ctx) {
            this.context2D.putImageData(ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), 0, 0)
        } else {
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
        }

        if (this.path && this.path.length > 0) {
            this.path.forEach((dot) => {
                this.fillCircle(dot.x, dot.y, 2, 'red')
            })
            if (this.pathIdx < this.path.length) {
                this._tank.targetX = this._tank.x = this.path[this.pathIdx].x
                this._tank.targetY = this._tank.y = this.path[this.pathIdx].y
                this.pathIdx++
            }
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
            // this._tank.onMouseMove(evt)
            const vecs = this.caculatePath(new vec2(this._tank.x, this._tank.y),
                new vec2(evt.canvasPosition.x, evt.canvasPosition.y))
            // console.log(vecs);
            this.path = vecs
            this.pathIdx = 0
        }
    }

    public dispatchMouseMove(evt: CanvasMouseEvent) {
        // this._tank.onMouseMove(evt)
    }
}