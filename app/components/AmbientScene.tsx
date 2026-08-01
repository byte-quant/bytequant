"use client";

import { useEffect, useRef } from "react";

type CapabilityNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};
type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** A progressive Three.js accent. It never reads or transmits user content. */
export function AmbientScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const idleWindow = window as IdleWindow;
    const capabilities = navigator as CapabilityNavigator;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 899px)");
    if (!canvas || reducedMotion.matches || compactViewport.matches || capabilities.connection?.saveData || (capabilities.deviceMemory !== undefined && capabilities.deviceMemory < 4) || navigator.hardwareConcurrency < 4) return;

    let animationFrame = 0;
    let idleHandle = 0;
    let timeoutHandle = 0;
    let resizeObserver: ResizeObserver | undefined;
    let intersectionObserver: IntersectionObserver | undefined;
    let cleanupScene: (() => void) | undefined;
    let disposed = false;
    let inViewport = true;

    const start = async () => {
      const THREE = await import("three");
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, depth: true, stencil: false, preserveDrawingBuffer: false, powerPreference: "low-power" });
      } catch {
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 8);
      const constellation = new THREE.Group();
      scene.add(constellation);

      const tealGeometry = new THREE.IcosahedronGeometry(1.38, 1);
      const tealMaterial = new THREE.MeshBasicMaterial({ color: 0x36c7bb, wireframe: true, transparent: true, opacity: 0.2 });
      const tealShape = new THREE.Mesh(tealGeometry, tealMaterial);
      tealShape.position.set(-2.9, 0.35, -0.7);
      constellation.add(tealShape);

      const blueGeometry = new THREE.TorusKnotGeometry(0.92, 0.12, 64, 8, 2, 3);
      const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x506dff, wireframe: true, transparent: true, opacity: 0.17 });
      const blueShape = new THREE.Mesh(blueGeometry, blueMaterial);
      blueShape.position.set(2.85, 0.12, -1.25);
      constellation.add(blueShape);

      const pointGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(150 * 3);
      for (let index = 0; index < 150; index += 1) {
        const angle = index * 2.399963;
        const radius = 1.5 + (index % 17) * 0.24;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = Math.sin(angle * 1.17) * radius * 0.38;
        positions[index * 3 + 2] = -2.8 - (index % 11) * 0.18;
      }
      pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pointMaterial = new THREE.PointsMaterial({ color: 0x8bded8, size: 0.035, transparent: true, opacity: 0.3, sizeAttenuation: true });
      const points = new THREE.Points(pointGeometry, pointMaterial);
      constellation.add(points);

      const resize = () => {
        const width = Math.max(1, Math.round(canvas.clientWidth));
        const height = Math.max(1, Math.round(canvas.clientHeight));
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      let lastFrame = 0;
      const render = (now: number) => {
        if (inViewport && document.visibilityState === "visible" && now - lastFrame >= 40) {
          const elapsed = now / 1000;
          lastFrame = now;
          tealShape.rotation.x = elapsed * 0.055;
          tealShape.rotation.y = elapsed * 0.085;
          blueShape.rotation.x = -elapsed * 0.035;
          blueShape.rotation.y = elapsed * 0.065;
          points.rotation.z = elapsed * 0.012;
          renderer.render(scene, camera);
        }
        animationFrame = window.requestAnimationFrame(render);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      intersectionObserver = new IntersectionObserver(([entry]) => { inViewport = entry?.isIntersecting ?? false; }, { rootMargin: "120px" });
      intersectionObserver.observe(canvas);
      resize();
      animationFrame = window.requestAnimationFrame(render);
      cleanupScene = () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        tealGeometry.dispose();
        tealMaterial.dispose();
        blueGeometry.dispose();
        blueMaterial.dispose();
        pointGeometry.dispose();
        pointMaterial.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      };
    };

    if (idleWindow.requestIdleCallback) idleHandle = idleWindow.requestIdleCallback(() => { void start(); }, { timeout: 1800 });
    else timeoutHandle = window.setTimeout(() => { void start(); }, 900);

    return () => {
      disposed = true;
      if (idleHandle) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
      cleanupScene?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-webgl" data-visual-engine="threejs-progressive" aria-hidden="true" />;
}
