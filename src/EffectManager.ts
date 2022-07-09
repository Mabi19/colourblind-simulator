import { Effect, effectMatrices } from "./Effect";
import vertexCode from "./assets/vertex.glsl?raw";
import fragmentCode from "./assets/fragment.glsl?raw";
import { TEXTURE_UNIT } from "./RenderingConstants";

export class EffectManager {
    private gl: WebGL2RenderingContext;
    private matrixLoc: WebGLUniformLocation;

    constructor(gl: WebGL2RenderingContext) {
        // save the GL context for later
        this.gl = gl;

        // create the vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) throw Error("Błąd WebGL (13)");
        // load it
        gl.shaderSource(vertexShader, vertexCode);
        gl.compileShader(vertexShader);
        // check for errors
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(vertexShader);
            if (log) {
                throw Error("Błąd WebGL (15): " + log);
            }
        }

        // and the fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) throw Error("Błąd WebGL (14)");
        // load it
        gl.shaderSource(fragmentShader, fragmentCode);
        gl.compileShader(fragmentShader);
        // check for errors
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(fragmentShader);
            if (log) {
                throw Error("Błąd WebGL (16): " + log);
            }
        }

        // link them together
        const program = gl.createProgram();
        if (!program) throw Error("Błąd WebGL (10)");
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        // we can delete it now
        gl.deleteShader(fragmentShader);
        // check for link errors
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const linkLog = gl.getProgramInfoLog(program);
            if (linkLog) {
                throw Error("Błąd WebGL (17): " + linkLog);
            }
        }

        // get the texture and matrix location
        const textureLoc = gl.getUniformLocation(program, "u_texture");
        if (!textureLoc) throw Error("Błąd WebGL (11)");
        const matrixLoc = gl.getUniformLocation(program, "u_conversion");
        if (!matrixLoc) throw Error("Błąd WebGL (12)");
        this.matrixLoc = matrixLoc;

        // set the texture unit to be correct
        gl.useProgram(program);
        gl.uniform1i(textureLoc, TEXTURE_UNIT);
        // and apply the identity effect
        this.setEffect(Effect.None);
    }

    setEffect(effect: Effect) {
        this.gl.uniformMatrix3fv(this.matrixLoc, false, effectMatrices[effect]);
    }
}