#version 300 es
// Shared vertex shader.

precision highp float;

layout (location = 0) in vec4 vertexPos;
out vec2 texCoord;

void main() {
    gl_Position = vertexPos;
    // vertexPos is from (-1.0, -1.0) to (1.0, 1.0)
    // but texCoord is from (0.0, 1.0)
    texCoord = (vertexPos.xy + vec2(1.0, 1.0)) / 2.0;
    texCoord.y = 1.0 - texCoord.y;
}
