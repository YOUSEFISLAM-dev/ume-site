import type { MouseEvent } from "react";
import { projects } from "../data/projects";

function tiltCard(event: MouseEvent<HTMLElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--tilt-x", `${x * 2.2}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${y * -2.2}deg`);
}

function resetTilt(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

export function Projects() {
  return (
    <section className="projects section-frame" id="projects" aria-labelledby="projects-title">
      <div className="section-heading">
        <p className="micro-label">[05] / PROJECTS</p>
        <h2 id="projects-title">INDIVIDUAL PROJECTS.<br /><span>ONE DIRECTION.</span></h2>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <article
            className="project-entry"
            key={project.id}
            onMouseMove={tiltCard}
            onMouseLeave={resetTilt}
            aria-labelledby={`project-${project.id}`}
          >
            <span className="project-entry__index">0{index + 1}</span>
            <div className="project-entry__body">
              <span className="micro-label">{project.kind}</span>
              <h3 id={`project-${project.id}`}>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <span className="project-entry__mark" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
      <p className="project-note">PROJECTS ARE TARGETS. UME IS THE DIRECTION.</p>
      <span className="section-number">[05]</span>
    </section>
  );
}
