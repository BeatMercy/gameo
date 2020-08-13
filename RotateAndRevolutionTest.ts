import { Canvas2DApplication } from "./core/Canvas2DApplication"
import { Math2D } from "./core/math2d"

export class RotateAndRevolutionTest extends Canvas2DApplication {
    private _rotationSunSpeed: number = 60
    private _rotationMoonSpeed: number = 500
    private _revolutionSpeed: number = 60

    private _rotationSun: number = 0
    private _rotationMoon: number = 0
    private _revolution: number = 0

    public render(): void {
        if (this.context2D === null) { return }
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.rotationAndRevolutionSimulation()
    }

    public update(elapsedMsec: number, intervalSec: number): void {
        const el: any = document.getElementById('rotateSpeed')

        this._rotationSunSpeed += 2 //parseInt(el?.value || '60')
        console.log('cur speed' + this._rotationSunSpeed)
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

        this.context2D.save()
        this.context2D.rotate(rotationSun)
        this.fillLocalRectWithTitleUV(100, 100, '自转', 0.5, 0.5)
        this.context2D.restore()

        this.context2D.save()
        this.context2D.rotate(0)
        this.context2D.translate(1500, 0)
        this.context2D.rotate(rotationMoon)
        this.fillLocalRectWithTitleUV(80, 80, '自转+公转', 0.5, 0.5)
        this.context2D.restore()

        this.context2D.restore()
    }


}