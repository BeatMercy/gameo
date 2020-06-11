import { CanvasInputEvent } from "./CanvasInputEvent";
import { EInputEventType } from "./EInputEventType";

export class CanvasKeyBoardEvent extends CanvasInputEvent {
    public key: string
    public keyCode: number

    public repeat: boolean

    public constructor(key: string, keyCode: number, repeat: boolean,
        altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
        super(altKey, ctrlKey, shiftKey, EInputEventType.KEYBOARDEVENT)

        this.key = key
        this.keyCode = keyCode
        this.repeat = repeat
    }
}