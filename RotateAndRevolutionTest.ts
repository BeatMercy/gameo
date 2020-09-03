import { Canvas2D } from "./core/Canvas2D"
import { Canvas2DApplication } from "./core/Canvas2DApplication"
import { Math2D } from "./core/math2d"

export class RotateAndRevolutionTest extends Canvas2DApplication {
    private _rotationSunSpeed: number = 60
    private _rotationMoonSpeed: number = 500
    private _revolutionSpeed: number = 60

    private _rotationSun: number = 0
    private _rotationMoon: number = 0
    private _revolution: number = 0

    private _targetCanvas: HTMLCanvasElement
    private _targetContext: CanvasRenderingContext2D

    public constructor(canvas: HTMLCanvasElement, target: HTMLCanvasElement) {
        super(canvas)
        // 加载图片
        this._targetCanvas = target
        this._targetContext = <CanvasRenderingContext2D>target.getContext('2d')
    }

    public render(): void {
        if (this.context2D === null) { return }
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.rotationAndRevolutionSimulation()
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        const el: any = document.getElementById('rotateSpeed')

        this._revolutionSpeed = parseInt(el?.value || '1')
        this._rotationMoon += this._rotationMoonSpeed * intervalSec
        this._rotationSun += this._rotationSunSpeed * intervalSec
        this._revolution += this._revolutionSpeed * intervalSec
    }

    public rotationAndRevolutionSimulation(radius: number = 250): void {
        if (this.context2D == null) return

        let rotationMoon: number = Math2D.toRadian(this._rotationMoon)
        let rotationSun: number = Math2D.toRadian(this._rotationSun)
        let revolution: number = Math2D.toRadian(this._revolution)

        // 设置坐标系原点
        this.context2D.save()
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)

        // this.context2D.rotate(revolution)
        const s = new Date().getTime()
        const afterRendered = this.changeImag(this._revolution)
        const gapTime = (new Date().getTime() - s) / 1000
        console.log(gapTime)

        const targetWidth = this._targetCanvas.width
        const targetHeight = this._targetCanvas.height
        this.context2D.drawImage(afterRendered, -(targetWidth / 2), -(targetHeight / 2), targetWidth, targetHeight)
        this.context2D.restore()

        // this.context2D.save()
        // this.context2D.translate(radius, 0)
        // this.context2D.rotate(rotationMoon)
        // this.context2D.drawImage(this._targetCanvas, 80, 80, 200, 200)
        // this.context2D.restore()

    }

    private changeImag(degree: number): HTMLCanvasElement {
        const imgData = this._targetContext.getImageData(0, 0, this._targetCanvas.width, this._targetCanvas.height)
        const radian = Math2D.toRadian(degree)
        const radius = 160
        const colorIndexs = new Set<number>()
        const centerLocationIndex = (imgData.data.length >>> 1) + (imgData.width * 2)
        for (let r = -radius; r < radius; r++) {
            const xPixel = parseInt((r * Math.cos(radian)).toString())
            const yPixel = parseInt((r * Math.sin(radian)).toString())
            const yIndex = yPixel * (imgData.width * 4)
            const locationIndex = centerLocationIndex + yIndex + (xPixel * 4)
            for (let o = -50; o < 50; o++) {
                colorIndexs.add(locationIndex + o)
            }
        }
        for (let index = 0; index < imgData.data.length; index += 4) {
            if (!colorIndexs.has(index)) {
                imgData.data[index]
                    = imgData.data[index + 1]
                    = imgData.data[index + 2] = 255
            }
        }
        const tempContext = <CanvasRenderingContext2D>document.createElement('canvas').getContext('2d')
        tempContext.canvas.width = imgData.width
        tempContext.canvas.height = imgData.height
        tempContext.putImageData(imgData, 0, 0)
        return tempContext.canvas
    }
}