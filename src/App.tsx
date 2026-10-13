import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Loader } from "./components/Loader";
import { Pillars } from "./components/Pillars";
import { Projects } from "./components/Projects";
import { Rules } from "./components/Rules";
import { Territories } from "./components/Territories";
import { Vision } from "./components/Vision";
import { useEmpireStore } from "./store";

const Scene = lazy(() => import("./scene/Scene"));

const fallbackFiles = [".pak", ".dll", ".assets", ".apk", ".exe", ".unity3d"] as const;

type BoundaryProps = {
  children: ReactNode;
  onFailure: () => void;
};

class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFailure();
  }

  render() {
    if (this.state.failed) return <StaticSceneFallback />;
    return this.props.children;
  }
}

function StaticSceneFallback() {
  return (
    <div className="static-scene" aria-hidden="true">
      <div className="static-scene__floor" />
      <div className="static-scene__slabs">
        {fallbackFiles.map((file, index) => (
          <span className={`static-scene__slab static-scene__slab--${index + 1}`} key={file}>
            <b>{file}</b>
            <i>{String(index + 1).padStart(2, "0")}</i>
          </span>
        ))}
      </div>
    </div>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    const loseContext = context?.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

function StudioCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const root = document.documentElement;

    const updatePointerMode = () => {
      root.classList.toggle("has-fine-pointer", finePointer.matches);
      if (!finePointer.matches) cursorRef.current?.classList.remove("is-visible", "is-action", "is-pressed");
    };

    const updateCursor = (event: PointerEvent) => {
      if (!finePointer.matches || !cursorRef.current) return;
      const cursor = cursorRef.current;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");
      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle("is-action", Boolean(target?.closest("a, button, input, textarea, select, [data-cursor-action]")));
    };

    const press = () => cursorRef.current?.classList.add("is-pressed");
    const release = () => cursorRef.current?.classList.remove("is-pressed");
    const hide = () => cursorRef.current?.classList.remove("is-visible");
    const show = () => cursorRef.current?.classList.add("is-visible");

    updatePointerMode();
    finePointer.addEventListener("change", updatePointerMode);
    window.addEventListener("pointermove", updateCursor, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.documentElement.addEventListener("pointerenter", show);

    return () => {
      root.classList.remove("has-fine-pointer");
      finePointer.removeEventListener("change", updatePointerMode);
      window.removeEventListener("pointermove", updateCursor);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.removeEventListener("pointerenter", show);
    };
  }, []);

  return (
    <div className="studio-cursor" ref={cursorRef} aria-hidden="true">
      <span className="studio-cursor__dot" />
      <span className="studio-cursor__ring" />
    </div>
  );
}

function App() {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const activePillar = useEmpireStore((state) => state.activePillar);
  const hoveredTerritory = useEmpireStore((state) => state.hoveredTerritory);
  const focusedTerritory = useEmpireStore((state) => state.focusedTerritory);

  const updatePillar = (value: number | null) => useEmpireStore.getState().setActivePillar(value);

  useEffect(() => {
    const supported = hasWebGL();
    setWebglAvailable(supported);
    setProgress(supported ? 28 : 100);
    if (!supported) setSceneReady(true);
  }, []);

  useEffect(() => {
    if (!webglAvailable) return;
    let current = true;
    import("./scene/Scene").then(() => {
      if (current) setProgress((value) => Math.max(value, 62));
    }).catch(() => {
      if (current) {
        setWebglAvailable(false);
        setSceneReady(true);
        setProgress(100);
      }
    });
    return () => { current = false; };
  }, [webglAvailable]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = () => setVisible(document.visibilityState === "visible");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    visibility();
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      useEmpireStore.getState().setPointer(x, y);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reducedMotion) {
      useEmpireStore.getState().setScrollProgress(0.08);
      return undefined;
    }

    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true, syncTouch: false });
    const syncScroll = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", syncScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const cameraPath = { progress: 0 };
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
    timeline.to(cameraPath, {
      progress: 1,
      duration: 1,
      ease: "none",
      onUpdate: () => useEmpireStore.getState().setScrollProgress(cameraPath.progress)
    });
    const trigger = timeline.scrollTrigger;
    ScrollTrigger.refresh();

    return () => {
      trigger?.kill();
      timeline.kill();
      lenis.off("scroll", syncScroll);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [reducedMotion]);

  const markCanvasReady = () => setProgress((value) => Math.max(value, 84));
  const markSceneReady = () => {
    setProgress(100);
    setSceneReady(true);
  };
  const markWebGLFailure = () => {
    setWebglAvailable(false);
    setSceneReady(true);
    setProgress(100);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <StudioCursor />
      <div className="scene-layer">
        {webglAvailable === false ? <StaticSceneFallback /> : null}
        {webglAvailable && <SceneBoundary onFailure={markWebGLFailure}>
          <Suspense fallback={null}>
            <Scene
              visible={visible}
              reducedMotion={reducedMotion}
              onCanvasReady={markCanvasReady}
              onReady={markSceneReady}
            />
          </Suspense>
        </SceneBoundary>}
        {webglAvailable === true && !sceneReady && <Loader progress={progress} />}
      </div>
      <main id="main-content">
        <Hero reducedMotion={reducedMotion} />
        <Vision />
        <Pillars activePillar={activePillar} onActivePillar={updatePillar} />
        <Territories
          hoveredTerritory={hoveredTerritory}
          focusedTerritory={focusedTerritory}
          onHover={(id) => useEmpireStore.getState().setHoveredTerritory(id)}
          onFocus={(id) => useEmpireStore.getState().setFocusedTerritory(id)}
        />
        <Projects />
        <Rules />
        <Footer />
      </main>
    </>
  );
}

export default App;
