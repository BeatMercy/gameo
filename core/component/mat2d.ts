export class mat2d {
    public values: Float32Array;
    public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1,
        x: number = 0, y: number = 0) {
        this.values = new Float32Array([a, b, c, d, x, y])
    }

    public static create(a: number = 1, b: number = 0, c: number = 0, d: number = 1,
        x: number = 0, y: number = 0): mat2d {
        return new mat2d(a, b, c, d, x, y)
    }
}