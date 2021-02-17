import { Canvas2DApplication } from "../Canvas2DApplication"
import { CanvasKeyBoardEvent } from "../event/CanvasKeyBoardEvent"
import { CanvasMouseEvent } from "../event/CanvasMouseEvent"
import { Math2D } from "../math2d"

// 戦車　せんしゃ
export class Tank {
    public width: number = 80
    public height: number = 50

    // いち　position 
    public x: number = 100
    public y: number = 100
    // scale ratio
    public scaleX: number = 1.0
    public scaleY: number = 1.0

    public tankRotation: number = 0
    public turretRotation: number = 0

    public targetX: number = 0
    public targetY: number = 0

    // 表示 Tank初始化时候是否朝着Y轴正方向
    public initYAxis: boolean = true
    public showLine: boolean = false // 是否显示坦克原点与画布中心点和目标点之间的连线

    public showCoord: boolean = false // 是否显示坦克自身局部坐标系
    public gunLength: number = Math.max(this.width, this.height)

    public gunMuzzleRadius: number = 5 // 砲口半径　ほうこう　はんけい

    public linerSpeed: number = 100
    public turretRotateSpeed: number = Math2D.toRadian(4)

    public draw(app: Canvas2DApplication) {
        if (app.context2D == null) {
            return
        }
        app.context2D.save()
        // 坦克的移动旋转，变换顺序 遵循： 先旋转后移动
        app.context2D.translate(this.x, this.y)
        app.context2D.rotate(this.tankRotation)
        app.context2D.scale(this.scaleX, this.scaleY)

        // 描画（びょうが）坦克底座 
        app.context2D.save()
        app.context2D.fillStyle = 'grey'
        app.context2D.beginPath()
        if (this.initYAxis) {
            app.context2D.rect(-this.height * 0.5, -this.width * 0.5, this.height, this.width)
        } else {
            app.context2D.rect(-this.width * 0.5, -this.height * 0.5, this.width, this.height)
        }
        app.context2D.fill()
        app.context2D.restore()
        // 标记正方向
        app.context2D.save()
        if (this.initYAxis) {
            app.context2D.translate(0, -this.width * 0.5)
        } else {
            app.context2D.translate(this.width * 0.5, 0)
        }

        app.fillCircle(0, 0, 10, 'green')
        app.context2D.restore()
        // 绘制炮口
        app.context2D.save()
        app.context2D.rotate(this.turretRotation)
        app.context2D.fillStyle = 'red'
        app.context2D.beginPath()
        app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2) // 类椭圆绘制
        app.context2D.fill()

        app.context2D.strokeStyle = 'blue'
        app.context2D.lineWidth = 5
        app.context2D.lineCap = 'round'
        app.context2D.beginPath()
        app.context2D.moveTo(0, 0)
        app.context2D.lineTo(this.gunLength, 0) // ===========
        app.context2D.stroke()

        app.context2D.translate(this.gunLength, 0)
        app.context2D.translate(this.gunMuzzleRadius, 0)

        app.fillCircle(0, 0, 5, 'black')
        app.context2D.restore()

        if (this.showCoord) {
            app.context2D.save()
            app.context2D.lineWidth = 1
            app.context2D.lineCap = 'square'
            app.strokeCoord(0, 0, this.width * 1.2, this.height * 1.2)
            app.context2D.restore()
        }
        app.context2D.restore()
    }

    public update(intervalSec: number): void {
        this._moveTowardTo(intervalSec)
    }

    public onMouseMove(evt: CanvasMouseEvent): void {
        this.targetX = evt.canvasPosition.x
        this.targetY = evt.canvasPosition.y
        this._lootAt()
    }

    public onKeyPress(evt: CanvasKeyBoardEvent): void {
        if (evt.key === 'a') {
            this.turretRotation -= this.turretRotateSpeed
        } else if (evt.key === 'd') {
            this.turretRotation += this.turretRotateSpeed
        } else if (evt.key === 'r') {
            this.turretRotation = 0
        }
    }

    private _lootAt() {
        let diffX: number = this.targetX - this.x
        let diffY: number = this.targetY - this.y
        let radien = Math.atan2(diffY, diffX) // atan 返回 [ -2/Π, 2/Π] 不满足要求
        this.tankRotation = radien
    }

    private _moveTowardTo(intervalSec: number) {
        let diffX: number = this.targetX - this.x
        let diffY: number = this.targetY - this.y
        // move pixel per frame 
        let currSpeed: number = this.linerSpeed * intervalSec

        // 位置差构成的斜边 > x,y 速度构成的斜边  ===> 未到达目的地
        if ((diffX * diffX + diffY * diffY) > currSpeed * currSpeed) {
            this.x += Math.cos(this.tankRotation) * currSpeed
            this.y += Math.sin(this.tankRotation) * currSpeed
        }

    }

}