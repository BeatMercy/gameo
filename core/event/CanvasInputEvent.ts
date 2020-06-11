import { EInputEventType } from "./EInputEventType"

export class CanvasInputEvent {
    public altKey: boolean
    public ctrlKey: boolean
    public shifitKey: boolean

    public type: EInputEventType

    public constructor(altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false,
        type: EInputEventType = EInputEventType.MOUSEEVENT) {
        this.altKey = altKey
        this.ctrlKey = ctrlKey
        this.shifitKey = shiftKey
        this.type = type
    }
}