"use client";

import { useEffect, useRef } from "react";

type MemoryAwareNavigator = Navigator & { deviceMemory?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const vertexSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float time;

  float glow(vec2 uv, vec2 origin, float radius) {
    float distanceFromOrigin = length(uv - origin);
    return smoothstep(radius, 0.0, distanceFromOrigin);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float drift = time * 0.14;
    float a = glow(uv, vec2(-0.72 + sin(drift) * 0.10, 0.38 + cos(drift) * 0.07), 0.78);
    float b = glow(uv, vec2(0.66 + cos(drift * 0.8) * 0.12, -0.08), 0.68);
    float c = glow(uv, vec2(sin(drift * 0.55) * 0.28, -0.70), 0.56);
    vec3 color = vec3(0.08, 0.72, 0.66) * a;
    color += vec3(0.25, 0.38, 1.0) * b;
    color += vec3(0.66, 0.34, 0.96) * c;
    float alpha = min(0.22, (a + b + c) * 0.12);
    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** A decorative, low-power WebGL layer. It never reads or transmits user data. */
export function AmbientScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const idleWindow = window as IdleWindow;
    const memory = (navigator as MemoryAwareNavigator).deviceMemory;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 899px)");

    if (!canvas || reducedMotion.matches || compactViewport.matches || (memory !== undefined && memory < 4)) return;

    let animationFrame = 0;
    let idleHandle = 0;
    let timeoutHandle = 0;
    let resizeObserver: ResizeObserver | undefined;
    let cleanupScene: (() => void) | undefined;
    let disposed = false;

    const start = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
      });
      if (!gl) return;

      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      const buffer = gl.createBuffer();
      if (!vertexShader || !fragmentShader || !program || !buffer) {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (program) gl.deleteProgram(program);
        if (buffer) gl.deleteBuffer(buffer);
        return;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const resolution = gl.getUniformLocation(program, "resolution");
      const time = gl.getUniformLocation(program, "time");

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
        const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      };

      let lastFrame = 0;
      const render = (now: number) => {
        if (document.visibilityState === "visible" && now - lastFrame >= 40) {
          lastFrame = now;
          resize();
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform2f(resolution, canvas.width, canvas.height);
          gl.uniform1f(time, now / 1000);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        animationFrame = window.requestAnimationFrame(render);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      animationFrame = window.requestAnimationFrame(render);
      cleanupScene = () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    };

    if (idleWindow.requestIdleCallback) idleHandle = idleWindow.requestIdleCallback(start, { timeout: 1400 });
    else timeoutHandle = window.setTimeout(start, 650);

    return () => {
      disposed = true;
      if (idleHandle) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      cleanupScene?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-webgl" aria-hidden="true" />;
}
