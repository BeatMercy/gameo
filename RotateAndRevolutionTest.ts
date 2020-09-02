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
        console.log(this._targetContext.getImageData(0, 0, target.width, canvas.height))
    }

    public render(): void {
        if (this.context2D === null) { return }
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.rotationAndRevolutionSimulation()
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        const el: any = document.getElementById('rotateSpeed')

        this._revolutionSpeed += parseInt(el?.value || '60')
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

        const targetWidth = 400//this._targetCanvas.width
        const targetHeight = 400//this._targetCanvas.height

        this.context2D.save()
        this.context2D.rotate(revolution)
        const s = new Date().getTime()
        const dd = this.changeImag(revolution)
        const e = (new Date().getTime() - s) / 1000
        console.log(e)

        this.context2D.drawImage(dd,
            -(targetHeight / 2), -(targetHeight / 2),
            targetWidth, targetHeight)
        this.context2D.restore()

        // this.context2D.save()
        // this.context2D.translate(radius, 0)
        // this.context2D.rotate(rotationMoon)
        // this.context2D.drawImage(this._targetCanvas, 80, 80, 200, 200)
        // this.context2D.restore()

        this.context2D.restore()
    }

    private changeImag(degree: number): HTMLCanvasElement {
        const imgData = this._targetContext.getImageData(0, 0, this._targetCanvas.width, this._targetCanvas.height)
        const radian = Math2D.toRadian(degree)
        const radius = 200
        const colorIndexs = new Array<number>()
        for (var r = 0; r < radius; r++) {
            const xPixel = parseInt((Math.cos(radian) * radius).toString())
            const yPixel = parseInt((Math.sin(radian) * radius).toString())
            const yIndex = yPixel * (imgData.width * 4)
            const locationIndex = yIndex + (xPixel * 4)
            colorIndexs.push(locationIndex)
            colorIndexs.push(locationIndex + 1)
            colorIndexs.push(locationIndex + 2)
            colorIndexs.push(locationIndex + 3)

        }
        // console.log('length in color',imgData.data.length)
        // console.log('length in pixel',imgData.data.length / 4)
        // console.log('square',imgData.height * imgData.width)
        for (let index = 0; index < imgData.data.length; index++) {
            if (colorIndexs.indexOf(index) === -1) {
                imgData.data[index] = 0
            }

        }

        this._targetContext.putImageData(imgData, 0, 0)
        return this._targetContext.canvas
    }
}