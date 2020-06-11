import { vec2 } from "./math2d"
import { CanvasMouseEvent } from "./event/CanvasMouseEvent"
import { CanvasKeyBoardEvent } from "./event/CanvasKeyBoardEvent"

export class Application implements EventListenerObject {
    protected _start: boolean = false

    protected _requestId: number = -1

    // 用于基于时间的物理更新， 这些成员变量类型前面使用了!， 可以进行延迟赋值操作
    protected _lastTime!: number
    protected _startTime!: number
    protected _isMouseDown: boolean
    public isSupportMouseMove: boolean

    // 支持触发多个Timer
    public timers: Timer[] = []
    private _timerId: number = -1

    private _fps: number = 0

    private _elapseFunc = (elapsedMsec: number) => { this.step(elapsedMsec) }

    public canvas: HTMLCanvasElement;


    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        // this -> Application 实现了 EventListenerObject
        this.canvas.addEventListener("mousedown", this, false)
        this.canvas.addEventListener("mouseup", this, false)
        this.canvas.addEventListener("mousemove", this, false)

        this.canvas.addEventListener("keydown", this, false)
        this.canvas.addEventListener("keyup", this, false)
        this.canvas.addEventListener("keypress", this, false)

        this.isSupportMouseMove = false
        this._isMouseDown = false

        canvas.oncontextmenu = canvas.oncontextmenu = function (ev) {
            // 停止右键事件
            ev.preventDefault();
        }

    }

    public get fps() {
        return this._fps
    }

    // @override
    public handleEvent(evt: Event): void {
        switch (evt.type) {
            case 'mousedown':
                this._isMouseDown = true
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt))
                break
            case 'mouseup':
                this._isMouseDown = false
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt))
                break
            case 'mousemove':
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt))
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt))
                }
                break
            case 'keypress':
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt))
                break
            case 'keydown':
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt))
                break
            case 'keyup':
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt))
                break
        }

    }


    public start(): void {
        if (!this._start) {
            this._start = true
            this._requestId = -1

            this._lastTime = -1
            this._startTime = -1

            // elapsedMsec :流逝的时间，application从初始到当前已消耗的时间
            this._requestId = window.requestAnimationFrame(this._elapseFunc.bind(this))

        }
    }

    public stop(): void {
        if (this._start) {
            cancelAnimationFrame(this._requestId)

            this._requestId = -1

            this._lastTime = -1
            this._startTime = -1
            this._start = false
        }
    }

    public isRunning(): boolean {
        return this._start
    }

    protected step(timeStamp: number) {
        if (this._startTime === -1) this._startTime = timeStamp
        if (this._lastTime === -1) this._lastTime = timeStamp

        // 计算当前时间点与第一次调用step时间点的差，以毫秒为单位
        let elapsedMsec: number = timeStamp - this._startTime
        // 计算当前时间点与上一次调用step时间点的差/ms
        let intervalSec: number = (timeStamp - this._lastTime)

        if (intervalSec !== 0) {
            this._fps = 1000.0 / intervalSec
        }

        intervalSec /= 1000.0

        this._lastTime = timeStamp

        this._handleTimers(intervalSec)

        // console.log(" elapsedTime = " + elapsedMsec + " intervalSec = " + intervalSec)
        this.update(elapsedMsec, intervalSec)
        this.render()
        this._requestId = window.requestAnimationFrame(this._elapseFunc.bind(this))
    }

    // 抽象方法，可覆写 override
    public update(elapsedMsec: number, intervalSec: number): void {

    }

    // 抽象方法，可覆写 override
    public render(): void { }

    public removeTimer(id: number): boolean {
        let found: boolean = false
        for (let i = 0; i < this.timers.length; i++) {
            if (this.timers[i].id === id) {
                this.timers[i].enabled = false
                found = true
                break
            }
        }
        return found
    }

    public addTimer(callback: TimerCallback, timeout: number = 1.0,
        onlyOnce: boolean = false, callbackData: any = undefined): number {
        let timer: Timer
        let found: boolean = false
        // check if there is a timer can be reused
        for (let i = 0; i < this.timers.length; i++) {
            if (this.timers[i].enabled === false) {
                timer = this.timers[i]
                timer.callback = callback
                timer.callbackData = callbackData
                timer.timeout = timeout
                timer.countdown = timeout
                timer.enabled = onlyOnce
                timer.enabled = true
                return timer.id
            }
        }
        // no exist unused timer
        timer = new Timer(callback)
        timer.callbackData = callbackData
        timer.callbackData = callbackData
        timer.timeout = timeout
        timer.countdown = timeout
        timer.enabled = onlyOnce
        timer.enabled = true
        timer.id = ++this._timerId
        this.timers.push(timer)
        return timer.id
    }

    protected dispatchMouseDown(evt: CanvasMouseEvent): void {
        return
    }

    protected dispatchMouseUp(evt: CanvasMouseEvent): void {
        return
    }

    protected dispatchMouseMove(evt: CanvasMouseEvent): void {
        return
    }

    protected dispatchMouseDrag(evt: CanvasMouseEvent): void {
        return
    }

    protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {
        return
    }

    protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {
        return
    }

    protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {
        return
    }


    // 转换鼠标坐标为canvas 相对坐标
    private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
        if (!this.canvas) {
            alert("canvas is null")
            throw new Error("canvas is null")
        }
        if (!evt.target) {
            alert("evt.target is null")
            throw new Error("evt.target is null")
        }


        let rect: ClientRect = this.canvas.getBoundingClientRect()
        if (evt.type === 'mousedown') {
            console.log('boundingClientRect: ' + JSON.stringify(rect))
            console.log('ClientX: ' + evt.clientX + ' ClientY: ' + evt.clientY)
        }

        let borderLeftWidth: number = 0
        let borderTopWidth: number = 0
        let paddingLeft: number = 0
        let paddingTop: number = 0

        let decl: CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement)

        if (decl.borderLeftWidth !== null)
            borderLeftWidth = parseInt(decl.borderLeftWidth, 10)
        if (decl.borderTopWidth !== null)
            borderTopWidth = parseInt(decl.borderTopWidth, 10)
        if (decl.paddingLeft !== null)
            paddingLeft = parseInt(decl.paddingLeft, 10)
        if (decl.paddingTop !== null)
            paddingTop = parseInt(decl.paddingTop, 10)

        let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft
        let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop
        let pos: vec2 = vec2.create(x, y)

        if (evt.type === 'mousedown') {
            console.log('borderLeftWidth: : ' + borderLeftWidth + ' borderTopWidth: ' + borderTopWidth)
            console.log('paddingLeft: : ' + paddingLeft + ' paddingTop: ' + paddingTop)
            console.log('变换后的canvasPosition: ' + pos.toString())
        }
        return pos
    }

    private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
        let event: MouseEvent = evt as MouseEvent
        let mousePosition: vec2 = this._viewportToCanvasCoordinate(event)
        let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey)
        return canvasMouseEvent
    }

    private _toCanvasKeyBoardEvent(evt: Event): CanvasKeyBoardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent
        let canvasKeyBoardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(event.key, event.keyCode, event.repeat,
            event.altKey, event.ctrlKey, event.shiftKey)
        return canvasKeyBoardEvent
    }

    private _handleTimers(intervalSec: number): void {
        for (let i = 0; i < this.timers.length; i++) {
            let timer = this.timers[i]
            if (timer.enabled === false) continue

            // countdown在Timer 初始化时赋值为 timeout
            // 每次调用本函数会减少上下帧的时间间隔（intervalSec,update函数的第二参数）
            timer.countdown -= intervalSec
            // 如果countdown 小于等于0，说明到达触发时间
            if (timer.countdown <= 0.0) {
                timer.callback(timer.id, timer.callbackData)
                if (timer.onlyOnce === false) {
                    // 重读触发，设置countdown = timeout
                    timer.countdown = timer.timeout
                } else {
                    this.removeTimer(timer.id)
                }
            }
        }
    }
}

export type TimerCallback = (id: number, data: any) => void
class Timer {
    public id: number = -1
    public enabled: boolean = false
    public callback: TimerCallback
    public callbackData: any
    public countdown: number = 0
    public timeout: number = 0
    public onlyOnce: boolean = false

    constructor(callback: TimerCallback) {
        this.callback = callback
    }

}