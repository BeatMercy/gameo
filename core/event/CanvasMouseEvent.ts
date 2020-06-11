import { CanvasInputEvent } from "./CanvasInputEvent";
import { vec2 } from "../math2d";
import { EInputEventType } from "./EInputEventType";

export class CanvasMouseEvent extends CanvasInputEvent {
    // [0:左键, 1:中键, 2:右键]
    public button: number

    public canvasPosition: vec2

    public localPosition: vec2

    public constructor(canvasPos: vec2, button: number,
        altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
        super(altKey, ctrlKey, shiftKey, EInputEventType.MOUSEEVENT)
        this.canvasPosition = canvasPos
        this.button = button

        this.localPosition = vec2.create()
    }
}