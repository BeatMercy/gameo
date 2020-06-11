export class Canvas2D {
    public context: CanvasRenderingContext2D

    public constructor(canvas: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d")
    }

    public drawText(text: string): void {
        this.context.save()
        this.context.textBaseline = 'middle'
        this.context.textAlign = 'center'

        let centerX: number = this.context.canvas.width * 0.5
        let centerY: number = this.context.canvas.height * 0.5

        this.context.fillStyle = 'red'
        this.context.fillText(text, centerX, centerY)

        this.context.strokeStyle = 'green'
        this.context.strokeText(text, centerX, centerY)
        // 将 上述的 textAlign textBaseLine 等 属性 重置到初始化状态
        this.context.restore()
    }
}