export type ProjectEntry = {
  id: string;
  title: string;
  kind: string;
  description: string;
};

// TODO: Replace these placeholders with approved project descriptions and links.
export const projects: ProjectEntry[] = [
  {
    id: "pubg",
    title: "PUBG project",
    kind: "GAME PROJECT",
    description: "An individual target under the wider UME vision."
  },
  {
    id: "among-us",
    title: "Among Us project",
    kind: "GAME PROJECT",
    description: "A separate project within a cross-game modding ecosystem."
  },
  {
    id: "next-target",
    title: "Next target",
    kind: "OPEN SLOT",
    description: "A placeholder for a future game, engine, or application."
  }
];
