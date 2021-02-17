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
    private _targetVideo: HTMLVideoElement
    private _targetContext: CanvasRenderingContext2D

    public constructor(canvas: HTMLCanvasElement, target: HTMLCanvasElement | HTMLVideoElement) {
        super(canvas)
        // 加载图片
        if (target instanceof HTMLCanvasElement) {
            this._targetCanvas = target
            this._targetContext = <CanvasRenderingContext2D>target.getContext('2d')
        } else if (target instanceof HTMLVideoElement) {
            this._targetVideo = target
        }
    }

    public start() {
        super.start()
        if (this._targetVideo)
            this._targetVideo.play()
    }
    public stop() {
        super.stop()
        if (this._targetVideo)
            this._targetVideo.pause()
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

        const afterRendered: HTMLCanvasElement = this._targetVideo
            ? this.videoImage(this._revolution)
            : this.changeImag(this._revolution)
        const gapTime = (new Date().getTime() - s) / 1000
        console.log(gapTime)

        const targetWidth = afterRendered.width
        const targetHeight = afterRendered.height
        this.context2D.drawImage(afterRendered, -(targetWidth / 2), -(targetHeight / 2), targetWidth, targetHeight)
        this.context2D.restore()

        // this.context2D.save()
        // this.context2D.translate(radius, 0)
        // this.context2D.rotate(rotationMoon)
        // this.context2D.drawImage(this._targetCanvas, 80, 80, 200, 200)
        // this.context2D.restore()

    }

    private changeImag(degree: number, imageTargetContext?: CanvasRenderingContext2D): HTMLCanvasElement {
        if (!imageTargetContext) {
            imageTargetContext = this._targetContext
        }
        const imgData = imageTargetContext.getImageData(0, 0, imageTargetContext.canvas.width, imageTargetContext.canvas.height)
        const radian = Math2D.toRadian(degree)
        const radius = 200
        const colorIndexs = new Set<number>()
        const centerLocationIndex = (imgData.data.length >>> 1) + (imgData.width * 2)
        for (let r = -radius; r < radius; r++) {
            const xPixel = parseInt((r * Math.cos(radian)).toString())
            const yPixel = parseInt((r * Math.sin(radian)).toString())
            const yIndex = yPixel * (imgData.width * 4)
            const locationIndex = centerLocationIndex + yIndex + (xPixel * 4)
            for (let o = -100; o < 100; o++) {
                colorIndexs.add(locationIndex + o)
            }
        }
        for (let index = 0; index < imgData.data.length; index += 4) {
            if (!!colorIndexs.has(index)) {
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
    private videoImage(degree: number): HTMLCanvasElement {
        const tempContext = <CanvasRenderingContext2D>document.createElement('canvas').getContext('2d')
        tempContext.canvas.width = this._targetVideo.videoWidth
        tempContext.canvas.height = this._targetVideo.videoHeight
        tempContext.drawImage(this._targetVideo, 0, 0, this._targetVideo.videoWidth, this._targetVideo.videoHeight);
        return this.changeImag(degree, tempContext)
    }
}