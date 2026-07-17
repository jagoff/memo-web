import { prefersReducedMotion } from "../lib/motion-preferences";

interface MotionContext {
  revert(): void;
}

const activeContexts: MotionContext[] = [];
let activeDocument: Document | undefined;
let initialization = 0;
let scrollTriggerRegistered = false;

function revertContexts(): void {
  for (const context of activeContexts.splice(0).reverse()) {
    context.revert();
  }
}

export function cleanupMotion(): void {
  initialization += 1;
  revertContexts();
  activeDocument
    ?.querySelectorAll("[data-motion-static]")
    .forEach((scene) => scene.removeAttribute("data-motion-static"));
  activeDocument?.documentElement.removeAttribute("data-motion-ready");
  activeDocument = undefined;
}

export async function initMotion(doc: Document = document): Promise<void> {
  cleanupMotion();

  const currentInitialization = initialization;
  activeDocument = doc;
  const view = doc.defaultView;

  if (!view || prefersReducedMotion(view.matchMedia.bind(view))) {
    return;
  }

  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    if (currentInitialization !== initialization || activeDocument !== doc) {
      return;
    }

    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    }

    doc.documentElement.setAttribute("data-motion-ready", "");

    const scenes = doc.querySelectorAll<HTMLElement>(
      '[data-scene="hero"], [data-scene="problem"]',
    );

    for (const scene of scenes) {
      try {
        const context = gsap.context(() => {
          if (scene.dataset.scene === "hero") {
            const graph = scene.querySelector<HTMLElement>("[data-graph]");

            if (!graph) {
              return;
            }

            const edges = graph.querySelectorAll<SVGElement>(".graph-edge");
            const nodes = graph.querySelectorAll<SVGElement>(".graph-node");
            const formation = gsap.timeline({
              defaults: { ease: "power2.out" },
            });

            formation
              .fromTo(
                edges,
                { opacity: 0.12 },
                { duration: 1.1, opacity: 0.78, stagger: 0.05 },
              )
              .fromTo(
                nodes,
                { opacity: 0.22, scale: 0.82 },
                {
                  duration: 0.8,
                  opacity: 1,
                  scale: 1,
                  stagger: 0.06,
                },
                "-=0.72",
              );

            gsap.to(nodes, {
              delay: 1.15,
              duration: 2.8,
              ease: "sine.inOut",
              repeat: -1,
              scale: 1.06,
              stagger: { each: 0.13, from: "random" },
              yoyo: true,
            });
          }

          if (scene.dataset.scene === "problem") {
            const connector = scene.querySelector<SVGPathElement>(
              "[data-problem-connector]",
            );

            if (!connector) {
              return;
            }

            gsap.fromTo(
              connector,
              { opacity: 0.18, strokeDashoffset: 1 },
              {
                duration: 1.2,
                ease: "power2.out",
                opacity: 1,
                scrollTrigger: {
                  once: true,
                  start: "top 75%",
                  trigger: scene,
                },
                strokeDashoffset: 0,
              },
            );
          }
        }, scene);

        activeContexts.push(context);
      } catch (error) {
        scene.setAttribute("data-motion-static", "");
        console.warn("memo motion scene stayed static", error);
      }
    }
  } catch (error) {
    if (currentInitialization === initialization && activeDocument === doc) {
      cleanupMotion();
    }

    console.warn("memo motion enhancement unavailable", error);
  }
}

function bootstrapMotion(): void {
  void initMotion();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapMotion, {
      once: true,
    });
  } else {
    bootstrapMotion();
  }
}
