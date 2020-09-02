import { Canvas2D } from './core/Canvas2D'
import { Canvas2DApplication } from './core/Canvas2DApplication'
import ResourceUtil from './core/util/ResourceUtil'
import { RotateAndRevolutionTest } from './RotateAndRevolutionTest'

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
if (canvas === null) {
    alert('无法获取HTMLCanvasElement !!!')
    throw new Error('无法获取HTMLCanvasElement !!!')
}
let canvas2d: Canvas2D = new Canvas2D(canvas)
canvas2d.drawText('Mercys Word')

function timerCallback(id: number, data: string): void {
    console.log('当前调用的timer id: ' + id + ' data : ' + data)
}
ResourceUtil.loadImageAsCanvas('/assets/logo.jpg')
    .then(target => {
        let app: Canvas2DApplication = new RotateAndRevolutionTest(canvas, target)
        let timer0: number = app.addTimer(timerCallback, 3, true, ' data is timerCallback 的数据 ')
        let timer1: number = app.addTimer(timerCallback, 5, false, ' data is only once timerCallback 的数据 ')
        app.render()

        let startButton: HTMLButtonElement | null = document.getElementById('start') as HTMLButtonElement
        let stopButton: HTMLButtonElement | null = document.getElementById('stop') as HTMLButtonElement
        let triggerButton: HTMLButtonElement | null = document.getElementById('trigger') as HTMLButtonElement

        startButton.onclick = (evt: MouseEvent) => app.start()
        stopButton.onclick = (evt: MouseEvent) => app.stop()
        triggerButton.onclick = (evt: MouseEvent) => {
            app.removeTimer(timer1)
            console.warn(app.timers.length)
            let id: number = app.addTimer(timerCallback, 10, true, ' data is only once timerCallback 的数据 ')
            console.warn('Is the 1 timer be reused?', id === 1)
        }

    })

