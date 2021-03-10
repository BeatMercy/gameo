import { Canvas2DApplication } from "../Canvas2DApplication"
import { vec2 } from "../math2d"
import Sound from "../sound/Sound"

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
    public destoryed: boolean = false

    public targetRotation: number // 飞行朝向
    public maxDistance: number = 400 // 最大飞行距离

    public exploded: boolean = false
    public explodeSpeed: number = 100
    public explodeSlice: number = 12
    public explodeMaxRadius: number = 50
    public curExplodeRadius: number = 0

    public explodeSound: Sound
    private soundStartTicker: boolean = true
    private soundEndTicker: boolean = true

    public onDestory: Function = () => { }

    public constructor(originVec: vec2, scale: number, targetRotation: number) {
        this.originX = originVec.x
        this.originY = originVec.y
        this.x = this.originX
        this.y = this.originY
        this.scale = scale
        this.explodeSound = Sound.getSound()
        this.explodeSound.oscillator.type = 'sawtooth'

        this.maxDistance = this.maxDistance * this.scale
        this.targetRotation = targetRotation
        this.maxY = this.originY + Math.sin(this.targetRotation) * this.maxDistance
        this.maxX = this.originX + Math.cos(this.targetRotation) * this.maxDistance
    }


    public draw(app: Canvas2DApplication) {
        if (app.context2D == null) return
        if (this.destoryed) return

        if (this.shouldDestory()) {
            this._drawExplodsion(app)
        } else {
            const ctx = app.context2D
            ctx.save()
            app.fillCircle(this.x, this.y, this.size * this.scale, '#000')
            ctx.restore()
        }
    }

    public update(intervalSec: number): void {
        if (this.destoryed) return
        if (this.shouldDestory()) {
            if (this.soundStartTicker) {
                this.explodeSound.play()
                this.soundStartTicker = false
            }
            if (this.exploded) {
                if (this.soundEndTicker) {
                    this.explodeSound.stop()
                    this.soundEndTicker = false
                }
                this.destoryed = true
                this.onDestory()
            }
            this._exploding(intervalSec)
        } else {
            this._moveTowardTo(intervalSec)
        }
    }

    private _drawExplodsion(app: Canvas2DApplication): void {
        if (!app.context2D) return
        const ctx = app.context2D
        ctx.save()
        const innerExplode = new Array()
        const outerExplode = new Array()
        Array.from({ length: this.explodeSlice })
            .forEach((s, idx) => {
                const curRadian = (idx + 1) * (2 * Math.PI / this.explodeSlice)
                const dy = this.y + Math.sin(curRadian) * this.curExplodeRadius * this.scale
                const dx = this.x + Math.cos(curRadian) * this.curExplodeRadius * this.scale
                innerExplode.push({ x: dx, y: dy })
                outerExplode.push({ x: dx, y: dy })
            })
        innerExplode.forEach((ex) => app.strokeCircle(ex.x, ex.y, 5, 'yellow'))
        outerExplode.forEach((ex) => app.strokeCircle(ex.x, ex.y, 15, 'orange'))
        ctx.restore()
    }

    private _exploding(intervalSec: number): void {
        if (this.curExplodeRadius >= this.explodeMaxRadius) {
            this.exploded = true
            return
        }
        const nextDx = intervalSec * this.explodeSpeed
        this.curExplodeRadius += nextDx
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