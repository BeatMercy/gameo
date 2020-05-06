"use strict";
let engine;
window.onload = () => {
    engine = new TSE.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var TSE;
(function (TSE) {
    /**
    * 游戏引擎类
    */
    class Engine {
        /**
        * 构造函数
        */
        constructor() {
            this._count = 0;
            console.log("Engine start construct . . . . .");
        }
        /**
        * Start up 函数
        */
        start() {
            this._canvas = TSE.GLUtilities.initialize();
            TSE.gl.clearColor(1, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            this.craeteBuffer();
            this.resize();
            this.loop();
        }
        /**
        * Resizes the canvas to fit the window.
        */
        resize() {
            if (this._canvas) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
            TSE.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        }
        loadShaders() {
            let vertexShaderSource = `
            attribute vec3 a_position;
            void main() {
                gl_Position = vec4(a_position, 1.0);
            }`;
            let fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }`;
            this._shader = new TSE.Shader("base", vertexShaderSource, fragmentShaderSource);
        }
        craeteBuffer() {
            this._buffer = TSE.gl.createBuffer();
            let vertices = [
                // x, y, z
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, this._buffer);
            TSE.gl.vertexAttribPointer(0, 3, TSE.gl.FLOAT, false, 0, 0);
            TSE.gl.enableVertexAttribArray(0);
            TSE.gl.bufferData(TSE.gl.ARRAY_BUFFER, new Float32Array(vertices), TSE.gl.STATIC_DRAW);
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, undefined);
            TSE.gl.disableVertexAttribArray(0);
        }
        /**
        * 游戏主循环
        */
        loop() {
            this._count++;
            // document.title = this._count.toString()
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT); // 使用颜色缓冲区中的颜色，每次刷新
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, this._buffer);
            TSE.gl.vertexAttribPointer(0, 3, TSE.gl.FLOAT, false, 0, 0);
            TSE.gl.enableVertexAttribArray(0);
            TSE.gl.drawArrays(TSE.gl.TRIANGLES, 0, 3);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**
     * In Charge of Configuring WebGL Rendering Context
     */
    class GLUtilities {
        /**
        * 初始化WebGL，如果已经定义画布了就是查找， 否则就创建。
        * @param elementId 要搜索的元素的ID。
        */
        static initialize(elementId) {
            let canvas;
            if (elementId) {
                canvas = document.getElementById(elementId);
                if (!canvas) {
                    throw new Error("Cannot find a canvas element named:" + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            // 可能浏览器不支持，要做一下检查
            TSE.gl = canvas.getContext("webgl");
            if (!TSE.gl) {
                TSE.gl = canvas.getContext("experimental-webgl");
                if (!TSE.gl) {
                    throw new Error("Unable to initialize WebGL!");
                }
            }
            return canvas;
        }
    }
    TSE.GLUtilities = GLUtilities;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**
     * Represents a WebGL shader.
     * */
    class Shader {
        constructor(name, vertexSource, fragmentSource) {
            this._name = name;
            let vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
        }
        /**
         * Creates a new shader.
         * @param name The name of this shader.
         */
        get name() {
            return this._name;
        }
        /**
         * Use this shader.
         * */
        use() {
            TSE.gl.useProgram(this._program);
        }
        loadShader(source, shaderType) {
            let shader = TSE.gl.createShader(shaderType);
            TSE.gl.shaderSource(shader, source);
            TSE.gl.compileShader(shader);
            let error = TSE.gl.getShaderInfoLog(shader).trim();
            if (error !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + error + "  " + shaderType + "   " + source);
            }
            return shader;
        }
        createProgram(vertexShader, fragmentShader) {
            this._program = TSE.gl.createProgram();
            TSE.gl.attachShader(this._program, vertexShader);
            TSE.gl.attachShader(this._program, fragmentShader);
            TSE.gl.linkProgram(this._program);
            let error = TSE.gl.getProgramInfoLog(this._program).trim();
            if (error !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + error);
            }
        }
    }
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
