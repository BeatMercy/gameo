import { Canvas2DApplication } from "../Canvas2DApplication"
import { vec2 } from "../math2d"

export default class CannonBall {
    // いち　position 
    public id: number
    public originX: number
    public originY: number

    public x: number
    public y: number
    private maxX: number
    private maxY: number

    public scale: number = 10 // 放大
    public size: number = 10 // 口径
    public speed: number = 500 // 炮弹速度

    public targetRotation: number // 飞行朝向
    public maxDistance: number = 900 // 最大飞行距离

    public onDestory: Function = () => { }

    public constructor(originVec: vec2, scale: number, targetRotation: number) {
        this.originX = originVec.x
        this.originY = originVec.y
        this.x = this.originX
        this.y = this.originY
        this.scale = scale

        this.targetRotation = targetRotation
        this.maxY = this.originY + Math.sin(this.targetRotation) * this.maxDistance
        this.maxX = this.originX + Math.cos(this.targetRotation) * this.maxDistance
    }


    public draw(app: Canvas2DApplication) {
        if (app.context2D == null) return
        if (this.shouldDestory()) return
        const ctx = app.context2D
        ctx.save()
        app.fillCircle(this.x, this.y, this.size * this.scale, '#000')
        ctx.restore()
    }

    public update(intervalSec: number): void {
        this._moveTowardTo(intervalSec)
        if (this.shouldDestory()) {
            this.onDestory()
        }
    }

    private _moveTowardTo(intervalSec: number): void {
        // move pixel per frame 
        let currSpeed: number = this.speed * intervalSec
        const diffX = Math.cos(this.targetRotation) * currSpeed
        const diffY = Math.sin(this.targetRotation) * currSpeed
        this.x += diffX
        this.y += diffY

    }

    private _atMaxDistance(): boolean {
        const distanceY = (y: number) => (y - this.originY) * (y - this.originY)
        const distanceX = (x: number) => (x - this.originX) * (x - this.originX)

        return (distanceX(this.x) + distanceY(this.y)) > (distanceX(this.maxX) + distanceY(this.maxY))
    }

    public shouldDestory(): boolean {
        return this._atMaxDistance()
    }


}