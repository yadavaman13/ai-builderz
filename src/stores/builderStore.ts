import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ComponentProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  [key: string]: any;
}

export interface BuilderComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: ComponentProps;
  children?: BuilderComponent[];
}

interface BuilderState {
  components: BuilderComponent[];
  selectedComponentId: string | null;
  currentProjectId: string | null;
  
  // Actions
  addComponent: (component: Omit<BuilderComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<BuilderComponent>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  resizeComponent: (id: string, width: number, height: number) => void;
  clearCanvas: () => void;
  setProject: (projectId: string) => void;
  getSelectedComponent: () => BuilderComponent | null;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      components: [],
      selectedComponentId: null,
      currentProjectId: null,

      addComponent: (component) => {
        const newComponent: BuilderComponent = {
          ...component,
          id: uuidv4(),
        };
        set((state) => ({
          components: [...state.components, newComponent],
          selectedComponentId: newComponent.id,
        }));
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, ...updates } : comp
          ),
        }));
      },

      deleteComponent: (id) => {
        set((state) => ({
          components: state.components.filter((comp) => comp.id !== id),
          selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        }));
      },

      selectComponent: (id) => {
        set({ selectedComponentId: id });
      },

      moveComponent: (id, x, y) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, x, y } : comp
          ),
        }));
      },

      resizeComponent: (id, width, height) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, width, height } : comp
          ),
        }));
      },

      clearCanvas: () => {
        set({ components: [], selectedComponentId: null });
      },

      setProject: (projectId) => {
        set({ currentProjectId: projectId });
      },

      getSelectedComponent: () => {
        const state = get();
        return state.components.find(comp => comp.id === state.selectedComponentId) || null;
      },
    }),
    {
      name: 'builder-storage',
      partialize: (state) => ({
        components: state.components,
        currentProjectId: state.currentProjectId,
      }),
    }
  )
);