/**
 * Mouse-trail displacement — a two-pass liquid distortion over an image.
 *
 * Pass 1 (`computeShader`) runs in a GPUComputationRenderer ping-pong buffer.
 * It accumulates mouse velocity into the RG channels of a tiny grid texture and
 * decays it every frame, so the trail fades on its own. GPUComputationRenderer
 * injects `resolution` and declares the `uGrid` sampler for us — neither is
 * written here.
 *
 * Pass 2 (`fragmentShader`) reads that grid as a displacement map: it offsets
 * the image UVs, then takes three further samples at increasing offsets and
 * compares their luminance against the base. Where an edge moved, the three
 * lumas disagree, and the difference is painted in `uTint`. The colour is an
 * edge detector on the displaced samples — not chromatic aberration.
 */

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const computeShader = /* glsl */ `
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uDecay;
uniform float uDistance;
uniform vec2 uGridAspect;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 color = texture2D(uGrid, uv);

  // Aspect-correct both points so the mouse falloff is a circle on screen
  // rather than an ellipse stretched by the element's aspect ratio.
  float dist = distance(uv * uGridAspect, uMouse * uGridAspect);
  float falloff = 1.0 - smoothstep(0.0, uDistance, dist);

  color.rg += uDeltaMouse * falloff;
  color.rg *= uDecay;

  gl_FragColor = color;
}
`

export const fragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform sampler2D uGrid;
uniform vec2 uContainerResolution;
uniform vec2 uImageResolution;
uniform vec3 uTint;
uniform float uTintStrength;
uniform float uStrength;
uniform float uDebugGrid;
uniform float uEncodeOutput;

varying vec2 vUv;

const vec3 LUMA = vec3(0.299, 0.587, 0.114);

/** object-fit: cover, in UV space. */
vec2 coverUvs(vec2 imageRes, vec2 containerRes) {
  float imageAspectX = imageRes.x / imageRes.y;
  float imageAspectY = imageRes.y / imageRes.x;
  float containerAspectX = containerRes.x / containerRes.y;
  float containerAspectY = containerRes.y / containerRes.x;

  vec2 ratio = vec2(
    min(containerAspectX / imageAspectX, 1.0),
    min(containerAspectY / imageAspectY, 1.0)
  );

  return vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main() {
  vec4 displacement = texture2D(uGrid, vUv);
  vec2 baseUvs = coverUvs(uImageResolution, uContainerResolution);

  // Debug: render the raw displacement field instead of the image. Lets the
  // grid resolution and mouse radius be tuned by eye. Returns before the
  // colour-space conversion below — this is data, not a colour.
  if (uDebugGrid > 0.5) {
    gl_FragColor = displacement * 0.5 + 0.5;
    return;
  }

  // The trail covers a small part of the image at any moment; everywhere else
  // costs one sample instead of four.
  float strength = length(displacement.rg);

  if (strength < 0.001) {
    gl_FragColor = texture2D(uTexture, baseUvs);
  } else {
    vec2 finalUvs = baseUvs - displacement.rg * uStrength;
    vec4 base = texture2D(uTexture, finalUvs);

    vec2 shift = displacement.rg * uStrength * 0.1;
    float d = clamp(strength, 0.0, 2.0);

    vec3 c1 = texture2D(uTexture, finalUvs + shift * (1.0 + d * 0.25)).rgb;
    vec3 c2 = texture2D(uTexture, finalUvs + shift * (1.0 + d * 1.5)).rgb;
    vec3 c3 = texture2D(uTexture, finalUvs + shift * (1.0 + d * 2.0)).rgb;

    float lumaBase = dot(base.rgb, LUMA);
    float ghost =
        abs(dot(c1, LUMA) - lumaBase)
      + abs(dot(c2, LUMA) - lumaBase)
      + abs(dot(c3, LUMA) - lumaBase);

    ghost = clamp(ghost * 1.2, 0.0, 1.0) * uTintStrength;

    gl_FragColor = vec4(mix(base.rgb, uTint, ghost), base.a);
  }

  // An image texture is declared sRGB, so three decodes it to linear on sample
  // and every value above is linear. A raw ShaderMaterial gets none of the
  // output encoding that built-in materials do, so without this the linear
  // values reach the canvas as-is and the image renders dark. Must follow the
  // gl_FragColor write, and there must be exactly one to follow.
  //
  // A video texture is declared NoColorSpace and passes straight through
  // instead (uEncodeOutput 0). The canvas sits directly over the <video>
  // element it samples, so the only defensible output is the one the browser
  // already painted underneath — and a round trip that depends on how a given
  // browser decodes video into a GL texture is not that. Both branches are
  // computed and one is chosen; the cost is a few instructions.
  vec4 passthrough = gl_FragColor;
  #include <colorspace_fragment>
  gl_FragColor = mix(passthrough, gl_FragColor, uEncodeOutput);
}
`
