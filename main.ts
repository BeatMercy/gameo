import { Canvas2D } from './core/Canvas2D'
import { Canvas2DApplication } from './core/Canvas2DApplication'
import ResourceUtil from './core/util/ResourceUtil'
import { LineDashAnimationApplication } from './LineDashAnimationApplication'
import { TankApplication } from './TankApplication'
import { Visualizer } from './core/sound/Sound'

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
if (canvas === null) {
    alert('无法获取HTMLCanvasElement !!!')
    throw new Error('无法获取HTMLCanvasElement !!!')
}
canvas.tabIndex = 1 // 启动监听，不然键盘输入时间无法触发
let canvas2d: Canvas2D = new Canvas2D(canvas)
canvas2d.drawText('Mercys Word')

function timerCallback(id: number, data: string): void {
    console.log('当前调用的timer id: ' + id + ' data : ' + data)
}


ResourceUtil.loadImageAsCanvas('/assets/map.png')
    .then(target => {
        let app: Canvas2DApplication = new TankApplication(canvas, target)

        let app2: Canvas2DApplication = new LineDashAnimationApplication(canvas, target)
        app.render()

        let startButton: HTMLButtonElement | null = document.getElementById('start') as HTMLButtonElement
        let stopButton: HTMLButtonElement | null = document.getElementById('stop') as HTMLButtonElement
        let triggerButton: HTMLButtonElement | null = document.getElementById('trigger') as HTMLButtonElement

        startButton.onclick = (evt: MouseEvent) => app.start(), canvas.focus()
        stopButton.onclick = (evt: MouseEvent) => app.stop()
        triggerButton.onclick = (evt: MouseEvent) => {

        }

    })

