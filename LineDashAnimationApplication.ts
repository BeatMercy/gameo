import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { CanvasKeyBoardEvent } from "./core/event/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "./core/event/CanvasMouseEvent";
import { vec2, Rectangle, Math2D } from "./core/math2d";

export class LineDashAnimationApplication extends Canvas2DApplication {
    private trans = false
    private _lineDashOffset: number = 0
    private _mouseX: number = 0
    private _mouseY: number = 0
    private _pattern: CanvasPattern | null = null
    private _img !: HTMLImageElement;

    // 目的地坐标
    _targetCanvas: HTMLCanvasElement
    private _targetContext: CanvasRenderingContext2D
    private destVec: vec2
    private curVec: vec2

    // 移动状态
    private moveStatus = { up: false, down: false, left: false, right: false }

    public constructor(canvas: HTMLCanvasElement, target: HTMLCanvasElement) {
        super(canvas)
        if (target instanceof HTMLCanvasElement) {
            this._targetCanvas = target
            this._targetContext = <CanvasRenderingContext2D>target.getContext('2d')
        }

        this.isSupportMouseMove = true
        this.destVec = new vec2(this.canvas.width * 0.5, this.canvas.height * 0.5)
        this.curVec = new vec2(this.canvas.width * 0.5, this.canvas.height * 0.5)
    }

    public dispatchKeyDown(keydown: CanvasKeyBoardEvent) {
        switch (keydown.key) {
            case 'ArrowUp':
                this.moveStatus.up = true
                break;
            case 'ArrowDown':
                this.moveStatus.down = true
                break;
            case 'ArrowLeft':
                this.moveStatus.left = true
                break;
            case 'ArrowRight':
                this.moveStatus.right = true
                break;
        }
    }

    public dispatchKeyUp(keyup: CanvasKeyBoardEvent) {
        switch (keyup.key) {
            case 'ArrowUp':
                this.moveStatus.up = false
                break;
            case 'ArrowDown':
                this.moveStatus.down = false
                break;
            case 'ArrowLeft':
                this.moveStatus.left = false
                break;
            case 'ArrowRight':
                this.moveStatus.right = false
                break;
        }
    }

    public dispatchMouseMove(evt: CanvasMouseEvent): void {
        this._mouseX = evt.canvasPosition.x
        this._mouseY = evt.canvasPosition.y
    }

    public dispatchMouseDown(evt: CanvasMouseEvent): void {
        if (this.isRunning()) {
            if (evt.button == 2) {
                this.destVec = evt.canvasPosition
            }
        }
    }

    private deg: number = 0

    public render(): void {
        if (this.context2D === null) { return }

        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // this._updateLineDash()
        // this.strokeCoord(110, 110, this.canvas.width - 20, -100)
        // this.fillPatternRect(10, 10, this.canvas.width - 20, this.canvas.height - 20, 'no-repeat')
        this.strokeGrid()
        this.drawCanvasCoordCenter()
        // this.drawCoordInfo(`[${this._mouseX},${this._mouseY}]`, this._mouseX, this._mouseY)
        // this.deg = this.deg > 360 ? 0 : (this.deg + 1)
        // this.doTransform(this.deg)
        this.doMouseTrack()
    }

    public doTransform(degree: number, rotateFirst: boolean = true): void {
        if (!this.context2D) return
        let radians: number = Math2D.toRadian(degree)
        const origin: vec2 = new vec2(this.canvas.width * 0.5, this.canvas.height * 0.5)
        this.context2D.save()
        if (rotateFirst) {
            this.context2D.rotate(radians)
            this.context2D.translate(origin.x, origin.y)
        } else {
            this.context2D.translate(origin.x, origin.y)
            this.context2D.rotate(radians)
        }
        this.fillRectWithTitle(0, 0, 100, 60, '+' + degree + '度旋转')
        this.context2D.restore()

        this.context2D.save()
        if (rotateFirst) {
            this.context2D.rotate(-radians)
            this.context2D.translate(origin.x, origin.y)
        } else {
            this.context2D.translate(origin.x, origin.y)
            this.context2D.rotate(-radians)
        }
        this.fillRectWithTitle(0, 0, 100, 60, '-' + degree + '度旋转')
        this.context2D.restore()
        let radius: number = this.distance(0, 0, origin.x, origin.y)
        this.strokeCircle(0, 0, radius, 'black')
    }

    private isCurMovePressing(): boolean {
        return this.moveStatus.up || this.moveStatus.down || this.moveStatus.left || this.moveStatus.right
    }
    public doMouseTrack(): void {
        if (this.context2D === null) return
        let width: number = 100
        let height: number = 140

        this.context2D.save()
        // キーボード移動
        if (this.isCurMovePressing()) {
            if (this.moveStatus.up) {
                this.curVec.y -= 4
            }
            if (this.moveStatus.down) {
                this.curVec.y += 2
            }
            if (this.moveStatus.right) {
                this.curVec.x += 2
            }
            if (this.moveStatus.left) {
                this.curVec.x -= 2
            }
            this.destVec = this.curVec
        }
        // 鼠标移动 マウス移動
        else {
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

        }

        this.context2D.translate(this.curVec.x - (width * 0.5), this.curVec.y - (height * 0.5))
        this.context2D.drawImage(this._targetCanvas, 0, 0, width, height)
        this.fillText('BeatMercy', (width * 0.5) - 15, (height * 0.5) - 45, 'Black')

        this.context2D.restore()
    }

    public loadImage(): void {
        if (this._img !== undefined) {
            return
        }

        let img: HTMLImageElement = document.createElement('img') as HTMLImageElement;
        img.src = './assets/logo.png'
        img.onload = (ev: Event): void => {
            this._img = img
        }
    }

    public testChangePartCanvasImageData(rRow: number = 2, rColum: number = 0, cRow: number = 1, cColum: number = 0, size: number = 32): void {
        let colorCanvas: HTMLCanvasElement = this.getColorCanvas(size);
        let context: CanvasRenderingContext2D | null = colorCanvas.getContext("2d");

        if (context === null) {
            alert("Canvas获取渲染上下文失败！");
            throw new Error("Canvas获取渲染上下文失败！");
        }
        this.setShadowState();
        this.drawImage(colorCanvas,
            Rectangle.create(300, 100, colorCanvas.width, colorCanvas.height));

        let imgData: ImageData = context.createImageData(size, size);

        let data: Uint8ClampedArray = imgData.data;
        let rbgaCount: number = data.length / 4;

        for (let i = 0; i < rbgaCount; i++) {
            data[i * 4 + 0] = 255;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
            data[i * 4 + 3] = 255;
        }

        context.putImageData(imgData, size * rColum, size * rRow, 0, 0, size, size);
        imgData = context.getImageData(size * cColum, size * cRow, size, size);
        data = imgData.data;
        let component: number = 0;
        for (let i: number = 0; i < imgData.width; i++) {
            for (let j: number = 0; j < imgData.height; j++) {
                for (let k: number = 0; k < 4; k++) {
                    let idx: number = (i * imgData.height + j) * 4 + k;
                    component = data[idx];
                    if (idx % 4 !== 3) {
                        data[idx] = 255 - component;
                    }
                }
            }
        }
        context.putImageData(imgData, size * cColum, size * cRow, 0, 0, size, size);
        this.drawImage(colorCanvas,
            Rectangle.create(300, 100, colorCanvas.width, colorCanvas.height));
    }


    public isImgLoaded(): boolean {
        return this._img !== undefined
    }

}