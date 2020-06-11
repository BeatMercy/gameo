import { Application } from "./Application"
import { vec2 } from "./math2d";

type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'

type TextBaseline = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'

type FontType = "10px sans-serif" | "15px sans-serif" | "20px sans-serif" | "25px sans-serif";

export class Canvas2DApplication extends Application {
    public context2D: CanvasRenderingContext2D | null

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.context2D = this.canvas.getContext("2d")

    }

    public drawCanvasCoordCenter(): void {
        if (this.context2D === null) return
        let halfWidth: number = this.canvas.width * 0.5
        let halfHeight: number = this.canvas.height * 0.5

        this.context2D.save()
        this.context2D.lineWidth = 2
        this.context2D.strokeStyle = 'rgba(255, 0, 0, 0.5)'
        this.strokeLine(0, halfHeight, this.canvas.width, halfHeight)
        this.context2D.strokeStyle = 'rgba(0, 0, 255, 0.5)'

        this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height)
        this.context2D.restore()

        this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0, 0, 0, 0.5)')

    }

    public drawCoordInfo(info: string, x: number, y: number): void {
        this.fillText(info, x, y, 'black', 'center', 'bottom')
    }

    public distanceVec(point0: vec2, point1: vec2): number {
        let diffX: number = point1.x - point0.x
        let diffY: number = point1.y - point0.y
        return Math.sqrt(diffX * diffX + diffY * diffY)
    }
    public distance(x0: number, y0: number, x1: number, y1: number): number {
        let diffX: number = x1 - x0
        let diffY: number = y1 - y0
        return Math.sqrt(diffX * diffX + diffY * diffY)
    }

    public fillCircle(x: number, y: number, radius: number, fillStyle: string | CanvasGradient | CanvasPattern = 'red'): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = fillStyle;
            this.context2D.beginPath();
            this.context2D.arc(x, y, radius, 0, Math.PI * 2);
            this.context2D.fill();
            this.context2D.restore();
        }
    }

    public strokeLine(x0: number, y0: number, x1: number, y1: number): void {
        if (this.context2D !== null) {
            this.context2D.beginPath();
            this.context2D.moveTo(x0, y0);
            this.context2D.lineTo(x1, y1);
            this.context2D.stroke();
        }
    }

    public strokeCoord(orginX: number, orginY: number, width: number, height: number, lineWidth: number = 3): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.lineWidth = lineWidth;
            this.context2D.strokeStyle = 'red';
            this.strokeLine(orginX, orginY, orginX + width, orginY);
            this.context2D.strokeStyle = 'blue';
            this.strokeLine(orginX, orginY, orginX, orginY + height);
            this.context2D.restore();
        }
    }

    public strokeLocalCoord(width: number, height: number, lineWidth: number = 1): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.lineWidth = lineWidth;
            this.context2D.strokeStyle = 'red';
            this.strokeLine(0, 0, width, 0);
            this.context2D.strokeStyle = 'blue';
            this.strokeLine(0, 0, 0, height);
            this.context2D.restore();
        }
    }

    public strokeCircle(x: number, y: number, radius: number, color: string = 'red', lineWidth: number = 1): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = lineWidth;
            this.context2D.beginPath();
            this.context2D.arc(x, y, radius, 0, Math.PI * 2);
            this.context2D.stroke();
            this.context2D.restore();
        }
    }

    public fillRect(x: number, y: number, w: number, h: number, color: string = 'black'): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.fill();
            this.context2D.restore();
        }
    }
    public strokeRect(x: number, y: number, w: number, h: number, color: string = 'black'): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.beginPath();
            this.context2D.moveTo(x, y);
            this.context2D.lineTo(x + w, y);
            this.context2D.lineTo(x + w, y + h);
            this.context2D.lineTo(x, y + h);
            this.context2D.closePath();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }

    public strokeGrid(color: string = 'grey', interval: number = 10): void {
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = 0.5;
            for (let i: number = interval + 0.5; i < this.canvas.width; i += interval) {
                this.strokeLine(i, 0, i, this.canvas.height);
            }
            for (let i: number = interval + 0.5; i < this.canvas.height; i += interval) {
                this.strokeLine(0, i, this.canvas.width, i);
            }
            this.context2D.restore();
            this.fillCircle(0, 0, 5, 'green');
            this.strokeCoord(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    public fillText(text: string, x: number, y: number, color: string = 'white',
        align: TextAlign = 'left', baseline: TextBaseline = 'top',
        font: FontType = '10px sans-serif'): void {
        if (this.context2D === null) { return }

        this.context2D.save()
        this.context2D.textAlign = align
        this.context2D.textBaseline = baseline
        this.context2D.font = font
        this.context2D.fillStyle = color
        this.context2D.fillText(text, x, y)
        this.context2D.restore()
    }
}