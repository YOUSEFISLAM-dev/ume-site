export type TerritoryStatus = "ACTIVE" | "RESEARCH" | "PLANNED";

export type Territory = {
  id: string;
  label: string;
  family: string;
  status: TerritoryStatus;
  description: string;
  position: [number, number, number];
};

export const territories: Territory[] = [
  {
    id: "unity",
    label: "Unity",
    family: "ENGINE",
    status: "ACTIVE",
    description: "A target among many. UME's scope is not tied to one engine.",
    position: [-4.1, 1.5, -0.7]
  },
  {
    id: "unreal",
    label: "Unreal",
    family: "ENGINE",
    status: "RESEARCH",
    description: "Research formats and internals to build compatible tooling.",
    position: [3.8, 2.5, -1.2]
  },
  {
    id: "il2cpp",
    label: "Il2Cpp",
    family: "RUNTIME",
    status: "RESEARCH",
    description: "Understand runtime structures within clear authorization boundaries.",
    position: [-3.2, -1.3, 0.2]
  },
  {
    id: "android",
    label: "Android",
    family: "PLATFORM",
    status: "PLANNED",
    description: "One platform in a wider set of possible targets.",
    position: [3.3, -1.6, 0.4]
  },
  {
    id: "custom-engines",
    label: "Custom engines",
    family: "ENGINE",
    status: "PLANNED",
    description: "Tools and workflows that can reach beyond established engines.",
    position: [0.3, 4.1, -2]
  },
  {
    id: "pubg",
    label: "PUBG",
    family: "GAME",
    status: "ACTIVE",
    description: "An individual project in a broader modding direction.",
    position: [-5.2, -0.3, -1.5]
  },
  {
    id: "among-us",
    label: "Among Us",
    family: "GAME",
    status: "ACTIVE",
    description: "An individual project, not the boundary of the empire.",
    position: [5.1, 0.1, -1.6]
  }
];
