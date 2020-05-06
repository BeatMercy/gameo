namespace TSE {
    /**
     * The WebGL Rendering context
     */
    export let gl: CanvasRenderingContext2D 
    /**
     * In Charge of Configuring WebGL Rendering Context
     */
    export class GLUtilities {
        /**
        * 初始化WebGL，如果已经定义画布了就是查找， 否则就创建。
        * @param elementId 要搜索的元素的ID。
        */
        public static initialize(elementId?: string): HTMLCanvasElement {

            let canvas: HTMLCanvasElement;

            if (elementId) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement
                if (!canvas) {
                    throw new Error("Cannot find a canvas element named:" + elementId)
                }
            } else {
                canvas = document.createElement("canvas") as HTMLCanvasElement
                document.body.appendChild(canvas)
            }

            // 可能浏览器不支持，要做一下检查
            gl = canvas.getContext("webgl") 
            if (!gl) {
                gl = canvas.getContext("experimental-webgl") 
                if (!gl) {
                    throw new Error("Unable to initialize WebGL!")
                }
            }

            return canvas
        }
    }
}