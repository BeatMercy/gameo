const EPSILON: number = 0.00001;
const PiBy180: number = 0.017453292519943295;

export class Math2D {
    public static toRadian ( degree : number ) : number {
        return degree * PiBy180 ;
    }

    public static toDegree ( radian : number ) : number {
        return radian / PiBy180 ;
    }

    public static random ( from : number , to : number ) : number {
        return Math .random ( ) * to  + from ;
    }

    public static angleSubtract ( from : number , to : number ) : number {
        let diff : number = to - from ;
        while ( diff > 180 ) {
            diff -= 360 ;
        }

        while ( diff < - 180 ) {
            diff += 360 ;
        }

        return diff ;
    }

    public static isEquals ( left : number , right : number , espilon : number = EPSILON ) : boolean {
        if ( Math . abs ( left - right ) >= EPSILON ) {
            return false ;
        }
        return true ;
    }

    public static getQuadraticBezierPosition ( start : number , ctrl : number , end: number , t : number ) : number {
        if ( t < 0.0 || t > 1.0 ) {
            alert ( " t的取值范围必须为[ 0 , 1 ] " ) ;
            throw new Error ( " t的取值范围必须为[ 0 , 1 ] " ) ;
        }
        let t1 : number = 1.0 - t ;
        let t2 : number = t1 * t1 ;
        return t2 * start + 2.0 * t * t1 * ctrl + t * t * end ;
    } 

    public static getQuadraticBezierVector ( start : vec2 , ctrl : vec2 , end : vec2 , t : number , result : vec2 | null = null ) : vec2 {
        if ( result === null ) result = vec2 . create ( ) ;
        result . x = Math2D . getQuadraticBezierPosition ( start . x , ctrl . x , end . x , t ) ;
        result . y = Math2D . getQuadraticBezierPosition ( start . y , ctrl . y , end . y , t ) ;
        return result ; 
    }

    public static getQuadraticBezierMat (  start : vec2 , ctrl : vec2 , end : vec2 , t : number , result : vec2 | null = null ) : vec2 {
        if ( result === null ) result = vec2 . create ( ) ;
         
        return result ;
    }

    public static getCubicBezierPosition ( start : number , ctrl0 : number , ctrl1 : number , end : number , t : number ) : number {
        if ( t < 0.0 || t > 1.0 ) {
            alert ( " t的取值范围必须为[ 0 , 1 ] " ) ;
            throw new Error ( " t的取值范围必须为[ 0 , 1 ] " ) ;
        }
        let t1 : number = ( 1.0 - t ) ;
        let t2 : number = t * t ;
        let t3 : number = t2 * t ;
        return ( t1 * t1 * t1 ) * start + 3 * t * ( t1 * t1 )  * ctrl0 +  ( 3 * t2 * t1 ) * ctrl1 + t3 * end ;
    }

    public static getCubicBezierVector ( start : vec2 , ctrl0 : vec2 , ctrl1 : vec2 , end : vec2 , t : number , result : vec2 | null = null ) : vec2 {
        if ( result === null ) result = vec2 . create ( ) ;
        result . x = Math2D . getCubicBezierPosition ( start . x , ctrl0 . x , ctrl1 . x , end . x , t ) ;
        result . y = Math2D . getCubicBezierPosition ( start . y , ctrl0 . y , ctrl1 . y , end . y , t ) ;
        return result ; 
    }

    public static isPointInRect ( ptX : number , ptY : number , x : number , y : number , w : number , h : number ) : boolean {
        if ( ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h ) {
            return true ;
        }
        return false ;
    }
    
    public static isPointInEllipse ( ptX : number , ptY : number , centerX : number , centerY : number , radiusX : number , radiusY : number ) : boolean {
        let diffX = ptX - centerX ;
        let diffY = ptY - centerY ;
        let n : number = ( diffX * diffX ) / ( radiusX * radiusX ) + ( diffY * diffY ) / ( radiusY * radiusY ) ;
        return n <= 1.0 ;
    }



}

export class vec2 {
    public values: Float32Array

    public constructor(x: number = 0, y: number = 0) {
        this.values = new Float32Array([x, y])
    }

    public toString(): string {
        return " [ " + this.values[0] + " , " + this.values[1] + " ] "
    }

    get x(): number { return this.values[0] }
    set x(x: number) { this.values[0] = x }

    get y(): number { return this.values[1] }
    set y(y: number) { this.values[1] = y }

    public reset(x: number = 0, y: number = 0): vec2 {
        this.values[0] = x
        this.values[1] = y
        return this
    }

    public static create(x: number = 0, y: number = 0): vec2 {
        return new vec2(x, y)
    }

    public static toRadian(degree: number): number {
        return degree * PiBy180
    }

    public static toDegree(radian: number): number {
        return radian / PiBy180
    }
}

export class Size {
    public values: Float32Array
    public constructor(w: number = 1, h: number = 1) {
        this.values = new Float32Array([w, h])
    }

    public set width(value: number) {
        this.values[0] = value
    }
    public get width() { return this.values[0] }
    public set height(value: number) {
        this.values[1] = value
    }
    public get height() { return this.values[1] }

    public static create(w: number = 1, h: number = 1): Size {
        return new Size(w, h)
    }

}

export class Rectangle {
    public origin: vec2
    public size: Size
    public constructor(origin: vec2 = new vec2(), size: Size = new Size(1, 1)) {
        this.origin = origin
        this.size = size
    }

    public isEmpty ( ) : boolean {
        let area : number = this . size . width * this . size . height ;
        if ( Math2D . isEquals ( area , 0 ) === true ) {
            return true ;
        } else {
            return false ;
        }
    }

    public static create(x: number = 0, y: number = 0, w: number = 1, h: number = 1) {
        let origin: vec2 = new vec2(x, y)
        let size: Size = new Size(w, h)
        return new Rectangle(origin, size)
    }
}

export const enum ELayout {
    LEFT_TOP,
    RIGHT_TOP,
    RIGHT_BOTTOM,
    LEFT_BOTTOM,
    CENTER_MIDDLE,
    CENTER_TOP,
    RIGHT_MIDDLE,
    CENTER_BOTTOM,
    LEFT_MIDDLE
}

export const enum EImageFillType {
    STRETCH,
    REPEAT,
    REPEAT_X,
    REPEAT_Y
}