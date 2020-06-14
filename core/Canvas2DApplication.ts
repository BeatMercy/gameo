import { Application } from "./Application"
import { vec2, Size, ELayout, EImageFillType, Rectangle } from "./math2d";

type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'

type TextBaseline = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'

type FontType = "10px sans-serif" | "15px sans-serif" | "20px sans-serif" | "25px sans-serif";

type FontStype = 'normal' | 'italic' | 'oblique'

type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
type FontVariant = 'normal' | 'small-caps'
type FontSize = '10px' | '12px' | '16px' | '18px' | '24px' | '50%' | '75%' | '100%' | '125%' | '150%'
    | 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large'

type FontFamily = 'sans-self' | 'serif' | 'courier' | 'fantasy' | 'monospace'

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

    public calcTextSize(text: string, char: string = 'W', scale: number = 0.5): Size {
        if (!this.context2D) {
            alert('context2d 渲染上下文为 null')
            throw new Error('context2d 渲染上下文为 null')
        }

        let size: Size = new Size()
        const measureText: TextMetrics = this.context2D.measureText(text)
        size.width = measureText.width
        let w: number = this.context2D.measureText(char).width
        size.height = w + (w * scale) // 宽度加上 scale 比例
        return size
    }

    public calcaLocalTextRectangle(layout: ELayout, text: string,
        parentWidth: number, parentHeight: number): Rectangle {
        let s: Size = this.calcTextSize(text)
        let o: vec2 = vec2.create()

        let left: number = 0
        let top: number = 0
        let right: number = parentWidth - s.width
        let bottom: number = parentHeight - s.height

        let center: number = right * 0.5
        let middle: number = bottom * 0.5

        switch (layout) {
            case ELayout.LEFT_TOP:
                o.x = left
                o.y = top
                break
            case ELayout.RIGHT_TOP:
                o.x = right
                o.y = top
                break
            case ELayout.RIGHT_BOTTOM:
                o.x = right
                o.y = bottom
                break
            case ELayout.LEFT_BOTTOM:
                o.x = left
                o.y = bottom
                break
            case ELayout.CENTER_MIDDLE:
                o.x = center
                o.y = middle
                break
            case ELayout.CENTER_TOP:
                o.x = center
                o.y = top
                break
            case ELayout.RIGHT_MIDDLE:
                o.x = right
                o.y = middle
                break
            case ELayout.LEFT_MIDDLE:
                o.x = left
                o.y = middle
                break
        }
        return new Rectangle(o, s)
    }

    public fillRectWithTitle(x: number, y: number, width: number, height: number, title: string = '',
        layout: ELayout = ELayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = false): void {
        if (!this.context2D) return

        this.context2D.save()
        this.context2D.fillStyle = color
        this.context2D.beginPath()
        this.context2D.rect(x, y, width, height)
        this.context2D.fill()
        if (title.length !== 0) {
            let rect: Rectangle = this.calcaLocalTextRectangle(layout, title, width, height)
            this.fillText(title, x + rect.origin.x, y + rect.origin.y,
                'white', 'left', 'top', '10px sans-serif')
            this.strokeRect(x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height,
                'rgba(0, 0, 0, 0.5)')
            // 绘制文本框的左上角点，作为标识
            this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
        }
        if (showCoord) {
            this.strokeCoord(x, y, width + 20, height + 20)
            this.fillCircle(x, y, 3)
        }
        this.context2D.restore()
    }

    public fillRectangleWithColor(rect: Rectangle, color: string): void {
        if (rect.isEmpty()) {
            return;
        }
        if (this.context2D !== null) {
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
            this.context2D.restore();
        }
    }

    public makeFontString(size: FontSize = '10px', weight: FontWeight = 'normal',
        style: FontStype = 'normal', variant: FontVariant = 'normal',
        family: FontFamily = 'sans-self'): string {
        let strs: string[] = []
        strs.push(style)
        strs.push(variant)
        strs.push(weight)
        strs.push(size)
        strs.push(family)
        return strs.join(' ')
    }

    public loadAndDrawImage(url: string): void {
        let img: HTMLImageElement = document.createElement('img') as HTMLImageElement;
        img.src = url;
        img.onload = (ev: Event): void => {
            if (this.context2D !== null) {

                // 在console控制台输出载入图像的尺寸
                console.log(url + " 尺寸为 [ " + img.width + " , " + img.height + " ] ");
                // 将srcImage保持原样的方式绘制到Canvas画布[ 10 , 10 ]的位置
                this.context2D.drawImage(img, 10, 10);
                // 将srcImage以拉伸缩放的方式绘制到Canvas画布指定的矩形中去
                this.context2D.drawImage(img, img.width + 30, 10, 200, img.height);
                // 将srcImage的部分区域[ 44 , 6 , 162 , 175 , 200 ]以拉伸缩放的方式绘制到Canvas画布指定的矩形[ 200 , img . height + 30 , 200 , 130 ]中去
                this.context2D.drawImage(img, 44, 6, 162, 175, 200, img.height + 30, 200, 130);

                //this . drawImage ( img , Rectangle .create ( 20, 20 , 540 , 300 ) , Rectangle . create ( 44 , 6 , 162 , 175 ) , EImageFillType . STRETCH ) ;
                // this . drawImage ( img , Rectangle .create ( 20, 20 , 100 , 50 ) , Rectangle . create ( 44 , 6 , 162 , 175 ) , EImageFillType . REPEAT ) ;
            }
        }
    }

    public drawImage(img: HTMLImageElement | HTMLCanvasElement, destRect: Rectangle, srcRect: Rectangle = Rectangle.create(0, 0, img.width, img.height), fillType: EImageFillType = EImageFillType.STRETCH): boolean {
        if (this.context2D === null) {
            return false;
        }

        if (srcRect.isEmpty()) {
            return false;
        }

        if (destRect.isEmpty()) {
            return false;
        }

        if (fillType === EImageFillType.STRETCH) {
            this.context2D.drawImage(img,
                srcRect.origin.x,
                srcRect.origin.y,
                srcRect.size.width,
                srcRect.size.height,
                destRect.origin.x,
                destRect.origin.y,
                destRect.size.width,
                destRect.size.height
            );
        } else {
            this.fillRectangleWithColor(destRect, 'grey');
            let rows: number = Math.ceil(destRect.size.width / srcRect.size.width);
            let colums: number = Math.ceil(destRect.size.height / srcRect.size.height);
            let left: number = 0;
            let top: number = 0;
            let right: number = 0;
            let bottom: number = 0;
            let width: number = 0;
            let height: number = 0;
            let destRight: number = destRect.origin.x + destRect.size.width;
            let destBottom: number = destRect.origin.y + destRect.size.height;
            if (fillType === EImageFillType.REPEAT_X) {
                colums = 1;
            } else if (fillType === EImageFillType.REPEAT_Y) {
                rows = 1;
            }

            for (let i: number = 0; i < rows; i++) {
                for (let j: number = 0; j < colums; j++) {
                    left = destRect.origin.x + i * srcRect.size.width;
                    top = destRect.origin.y + j * srcRect.size.height;

                    width = srcRect.size.width;
                    height = srcRect.size.height;
                    right = left + width;
                    bottom = top + height;
                    if (right > destRight) {
                        width = srcRect.size.width - (right - destRight);
                    }
                    if (bottom > destBottom) {
                        height = srcRect.size.height - (bottom - destBottom);
                    }
                    this.context2D.drawImage(img,
                        srcRect.origin.x,
                        srcRect.origin.y,
                        width,
                        height,
                        left, top, width, height
                    );
                }
            }
        }
        return true;
    }

    public Colors: string[] = [
        'aqua',    //浅绿色
        'black',   //黑色
        'blue',    //蓝色 
        'fuchsia', //紫红色
        'gray',     //灰色
        'green',   //绿色
        'lime',    //绿黄色
        'maroon',  //褐红色
        'navy',    //海军蓝
        'olive',   //橄榄色
        'orange',  //橙色
        'purple',  //紫色
        'red',      //红色
        'silver',  //银灰色
        'teal',    //蓝绿色
        'yellow',   //黄色
        'white'   //白色
    ];
    public getColorCanvas(amount: number = 32): HTMLCanvasElement {

        let step: number = 4;
        let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = amount * step;
        canvas.height = amount * step;
        let context: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (context === null) {
            alert("离屏Canvas获取渲染上下文失败！");
            throw new Error("离屏Canvas获取渲染上下文失败！");
        }

        for (let i: number = 0; i < step; i++) {
            for (let j: number = 0; j < step; j++) {
                let idx: number = step * i + j;
                context.save();
                context.fillStyle = this.Colors[idx];
                context.fillRect(i * amount, j * amount, amount, amount);
                context.restore();
            }
        }

        return canvas;
    }

    public drawColorCanvas(): void {
        let colorCanvas: HTMLCanvasElement = this.getColorCanvas();
        this.drawImage(colorCanvas,
            Rectangle.create(100, 100, colorCanvas.width, colorCanvas.height));
    }

    public printPixelsColor(x: number, y: number, w: number, h: number): void {
        if (this.context2D !== null) {
            let imgData: ImageData = this.context2D.getImageData(x, y, w, h);
            console.log(imgData.data);
        }
    }

    public setShadowState(shadowBlur: number = 5, shadowColor: string = "rgba( 127 , 127 , 127 , 0.5 )",
        shadowOffsetX: number = 10, shadowOffsetY: number = 10): void {
        if (this.context2D !== null) {
            this.context2D.shadowBlur = shadowBlur;
            this.context2D.shadowColor = shadowColor;
            this.context2D.shadowOffsetX = shadowOffsetX;
            this.context2D.shadowOffsetY = shadowOffsetY;
        }
    }

}