var glsl = (x: any) => x[0];

export const OutlineGLSL = glsl`#version 300 es
precision mediump float;

uniform float u_time_ms;
uniform sampler2D u_graphic;

in vec2 v_uv;
in vec2 v_screenuv;
out vec4 fragColor;

vec3 hsv2rgb(vec3 c){
  vec4 K=vec4(1.,2./3.,1./3.,3.);
  return c.z*mix(K.xxx,clamp(abs(fract(c.x+K.xyz)*6.-K.w)-K.x, 0., 1.),c.y);
}

void main() {
  const float TAU = 6.28318530;
  const float steps = 4.0; // up/down/left/right pixels
  float radius = 4.0;
  float time_sec = u_time_ms / 1000.;

  vec3 outlineColorHSL = vec3(sin(time_sec/2.0) * 1., 1., 1.);
  vec2 aspect = 1.0 / vec2(textureSize(u_graphic, 0));

  for (float i = 0.0; i < TAU; i += TAU / steps) {
    // Sample image in a circular pattern
    vec2 offset = vec2(sin(i), cos(i)) * aspect * radius;
    vec4 col = texture(u_graphic, v_uv + offset);

    // Mix outline with background
    float alpha = smoothstep(0.5, 0.7, col.a);
    fragColor = mix(fragColor, vec4(hsv2rgb(outlineColorHSL), 1.0), alpha); // apply outline
  }

  // Overlay original texture
  vec4 mat = texture(u_graphic, v_uv);
  float factor = smoothstep(0.5, 0.7, mat.a);
  fragColor = mix(fragColor, mat, factor);
}
`;

export const SwirlGLSL = glsl`#version 300 es
precision mediump float;

// UV coord
in vec2 v_uv;

uniform sampler2D u_graphic;

uniform vec2 u_resolution;

uniform float u_time_ms;

uniform vec2 iMouse;

uniform vec2 u_size;

uniform vec4 u_color;

uniform float u_opacity;

out vec4 fragColor;

void main() {
  vec4 color = u_color;
  float time_sec = u_time_ms / 1000.;
  float effectRadius = .5;
  float effectAngle = mod(time_sec/2., 2.)  * 3.14159;

  vec2 size = u_size.xy;
  vec2 center = iMouse.xy / u_size.xy;
  vec2 uv = v_uv.xy - center;

  float len = length(uv * vec2(size.x / size.y, 1.));
  float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(effectRadius, 0., len);
  float radius = length(uv);
  vec2 newUv = vec2(radius * cos(angle), radius * sin(angle)) + center;
   color = texture(u_graphic, newUv);
   color.rgb = color.rgb * u_opacity;
   color.a = color.a * u_opacity;
  
   fragColor = color * u_color;
}
`;

export const RedGLSL = glsl`#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_graphic;
out vec4 color;
void main() {
    vec4 texColor = texture(u_graphic, v_uv);
    float intensity = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    color = vec4(intensity, 0.0, 0.0, texColor.a);
}
`;

export const ColorizeGLSL = glsl`#version 300 es
precision mediump float;
in vec2 v_uv;
uniform vec4 u_color;
uniform sampler2D u_graphic;
out vec4 fragColor;
void main() {
    vec4 texColor = texture(u_graphic, v_uv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor = vec4(u_color.rgb * gray, texColor.a);
}
`;

export const GlowGLSL = glsl`#version 300 es
precision mediump float;

uniform float u_time_ms;
uniform sampler2D u_graphic;

in vec2 v_uv;
in vec2 v_screenuv;
out vec4 fragColor;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    return c.z * mix(K.xxx, clamp(abs(fract(c.x + K.xyz) * 6.0 - K.w) - K.x, 0.0, 1.0), c.y);
}

void main() {
    const float TAU = 6.28318530;
    const int steps = 64;  // More steps for a smoother glow
    float radius = 8.0;    // Adjust the radius for a larger glow
    float time_sec = u_time_ms / 1000.0;
    
    vec3 glowColor = hsv2rgb(vec3(sin(time_sec * 0.5) * 0.5 + 0.5, 1.0, 1.0));
    vec2 aspect = 1.0 / vec2(textureSize(u_graphic, 0));

    vec4 sum = vec4(0.0);
    float weight = 0.0;

    for (int i = 0; i < steps; i++) {
        float angle = TAU * float(i) / float(steps);
        vec2 offset = vec2(cos(angle), sin(angle)) * aspect * radius;
        vec4 col = texture(u_graphic, v_uv + offset);
        float alpha = col.a * 0.2; // Adjust glow intensity
        sum += vec4(glowColor, 1.0) * alpha;
        weight += alpha;
    }

    // Normalize glow effect
    sum /= weight + 1e-5;

    // Fetch original texture
    vec4 texColor = texture(u_graphic, v_uv);

    // Blend glow with original texture
    fragColor = texColor + sum * 0.6; // Control glow strength
}
`;
