#version 300 es
// Generic fragment shader.

precision highp float;

in vec2 texCoord;
out vec4 colour;

uniform sampler2D u_texture;
uniform mat3 u_conversion;

void main() {
    // colour = vec4(texCoord.x, texCoord.y, 0.0, 1.0) + (vec4(texture(u_texture, texCoord).rgb * u_conversion, 1.0) * 0.01);
    colour = vec4(texture(u_texture, texCoord).rgb * u_conversion, 1.0);
}
