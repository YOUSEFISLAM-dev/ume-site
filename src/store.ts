import { create } from "zustand";

type EmpireState = {
  scrollProgress: number;
  pointerX: number;
  pointerY: number;
  activePillar: number | null;
  hoveredTerritory: string | null;
  focusedTerritory: string | null;
  setScrollProgress: (value: number) => void;
  setPointer: (x: number, y: number) => void;
  setActivePillar: (value: number | null) => void;
  setHoveredTerritory: (id: string | null) => void;
  setFocusedTerritory: (id: string | null) => void;
};

export const useEmpireStore = create<EmpireState>((set) => ({
  scrollProgress: 0,
  pointerX: 0,
  pointerY: 0,
  activePillar: null,
  hoveredTerritory: null,
  focusedTerritory: null,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setPointer: (pointerX, pointerY) => set({ pointerX, pointerY }),
  setActivePillar: (activePillar) => set({ activePillar }),
  setHoveredTerritory: (hoveredTerritory) => set({ hoveredTerritory }),
  setFocusedTerritory: (focusedTerritory) => set({ focusedTerritory })
}));
