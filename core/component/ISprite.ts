import { CanvasKeyBoardEvent } from "../event/CanvasKeyBoardEvent";
import { CanvasMouseEvent } from "../event/CanvasMouseEvent";
import { vec2 } from "../math2d";
import { mat2d } from "./mat2d";

export enum ERenderType {
    CUSTOM,
    STROKE,
    FILL,
    STROKE_FILL,
    CLIP
}

export enum EOrder {
    PREORDER,
    POSTORDER
}

// TYPE definition 
export type UpdateEventHandler = ( ( spr : ISprite , mesc : number, diffSec : number , travelOrder : EOrder ) => void ) ;
export type MouseEventHandler = ( ( spr : ISprite , evt : CanvasMouseEvent  ) => void ) ;
export type KeyboardEventHandler = ( ( spr : ISprite , evt : CanvasKeyBoardEvent  ) => void ) ;
export type RenderEventHandler = ( spr : ISprite , context : CanvasRenderingContext2D , renderOreder : EOrder ) => void ;


// export type UpdateEventHandle = ((spr:ISprite, ))

export interface IRenderState {
    isVisible: boolean;
    showCoordSystem: boolean;
    lineWidth: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    renderType: ERenderType;

}

export interface ITransformable {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    getWorldMatrix(): mat2d;
    getLocalMatrix(): mat2d;
}

export interface IDrawable {
    beginDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void;
    draw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void;
    endDraw(transformable: ITransformable, state: IRenderState, context: CanvasRenderingContext2D): void;
}
export interface IHittable {
    // worldpt = transform.getWorldMatrix * localPt
    hitTest(localPt: vec2, transform: ITransformable): boolean;
}

export interface IShape extends IHittable, IDrawable {
    readonly type: string;
    data: any
}

export interface ISpriteContainer {
    name: string;
    addSprite(sprite: ISprite): ISpriteContainer;
    removeSprite(sprite: ISprite): boolean;
    removeAll(includeThine: boolean): void;
    getSpriteIndex(sprite: ISprite): number;
    getSprite(idx: number): ISprite;
    getSpriteCount(): number;
    readonly sprite : ISprite | undefined ;
}

export interface ISprite extends ITransformable, IRenderState {
    name: string;
    shape: IShape;
    owner: ISpriteContainer;
    data: any;
    hitTest(localPt: vec2): boolean;
    update(mesc: number, diff: number, order: EOrder): void
    draw(context: CanvasRenderingContext2D): void;

    mouseEvent:MouseEvent

}