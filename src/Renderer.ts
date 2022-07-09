import { Effect } from "./Effect";
import { EffectManager } from "./EffectManager";
import { TEXTURE_UNIT } from "./RenderingConstants";

const verts = new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0,
]);

const SHADER_VERTEX_IN = 0;

export class Renderer {
    private gl: WebGL2RenderingContext;
    private canvas: HTMLCanvasElement;

    // size of the canvas
    private canvasWidth: number;
    private canvasHeight: number;

    // this manages our shaders
    private effectManager: EffectManager;

    // various GL resources
    private vertexBuffer: WebGLBuffer;
    private vertexArray: WebGLVertexArrayObject;
    private texture: WebGLTexture;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            throw Error("Błąd: Twoje urządzenie nie wspiera WebGL 2");
        }
        this.gl = gl;

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        // effect manager
        this.effectManager = new EffectManager(gl);
        this.effectManager.setEffect(Effect.None);

        // vertex buffer
        const vbo = gl.createBuffer();
        if (!vbo) throw Error("Błąd WebGL (1)");
        this.vertexBuffer = vbo;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        // vertex array
        const vao = gl.createVertexArray();
        if (!vao) throw Error("Błąd WebGL (2)");
        this.vertexArray = vao;
        gl.bindVertexArray(this.vertexArray);
        gl.enableVertexAttribArray(SHADER_VERTEX_IN);
        // the buffer is already bound
        gl.vertexAttribPointer(SHADER_VERTEX_IN, 2, gl.FLOAT, false, 0, 0);

        // and the texture
        gl.activeTexture(gl.TEXTURE0 + TEXTURE_UNIT);
        const tex = gl.createTexture();
        if (!tex) throw Error("Błąd WebGL (3)");
        this.texture = tex;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // placeholder data
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        // turn off mipmaps and set clamping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    setCanvasSize(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
    }

    setEffect(effect: Effect) {
        this.effectManager.setEffect(effect);
    }

    updateFrame(video: HTMLVideoElement) {
        this.gl.activeTexture(this.gl.TEXTURE0 + TEXTURE_UNIT);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, video);
    }

    draw() {
        this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}