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

interface ProjectVersion {
  id: string;
  timestamp: Date;
  components: BuilderComponent[];
  description: string;
}

interface BuilderState {
  components: BuilderComponent[];
  selectedComponentId: string | null;
  currentProjectId: string | null;
  versions: ProjectVersion[];
  currentVersionIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  
  // Actions
  addComponent: (component: Omit<BuilderComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<BuilderComponent>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  resizeComponent: (id: string, width: number, height: number) => void;
  duplicateComponent: (id: string) => void;
  clearCanvas: () => void;
  setProject: (projectId: string) => void;
  getSelectedComponent: () => BuilderComponent | null;
  setLoading: (loading: boolean) => void;
  
  // Version control with proper undo/redo
  saveVersion: (description: string) => void;
  restoreVersion: (versionId: string) => void;
  undo: () => void;
  redo: () => void;
  
  // Validation and grid system
  validateLayout: () => { errors: string[]; warnings: string[] };
  snapToGrid: (x: number, y: number) => { x: number; y: number };
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      components: [],
      selectedComponentId: null,
      currentProjectId: null,
      versions: [],
      currentVersionIndex: -1,
      canUndo: false,
      canRedo: false,
      isLoading: false,

      addComponent: (component) => {
        const newComponent: BuilderComponent = {
          ...component,
          id: uuidv4(),
        };
        set((state) => ({
          components: [...state.components, newComponent],
          selectedComponentId: newComponent.id,
        }));
        
        // Auto-save version on significant changes
        get().saveVersion(`Added ${component.type} component`);
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, ...updates } : comp
          ),
        }));
      },

      deleteComponent: (id) => {
        const componentToDelete = get().components.find(comp => comp.id === id);
        set((state) => ({
          components: state.components.filter((comp) => comp.id !== id),
          selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        }));
        
        if (componentToDelete) {
          get().saveVersion(`Deleted ${componentToDelete.type} component`);
        }
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
        get().saveVersion('Cleared canvas');
      },

      setProject: (projectId) => {
        set({ currentProjectId: projectId });
      },

      getSelectedComponent: () => {
        const state = get();
        return state.components.find(comp => comp.id === state.selectedComponentId) || null;
      },

      saveVersion: (description) => {
        const state = get();
        const newVersion: ProjectVersion = {
          id: uuidv4(),
          timestamp: new Date(),
          components: [...state.components],
          description,
        };
        
        // Remove any versions after current index (for proper redo behavior)
        const versionsUpToCurrent = state.versions.slice(0, state.currentVersionIndex + 1);
        const newVersions = [...versionsUpToCurrent, newVersion].slice(-20); // Keep last 20 versions
        
        set({
          versions: newVersions,
          currentVersionIndex: newVersions.length - 1,
          canUndo: newVersions.length > 1,
          canRedo: false,
        });
      },

      restoreVersion: (versionId) => {
        const state = get();
        const version = state.versions.find(v => v.id === versionId);
        if (version) {
          set({
            components: [...version.components],
            selectedComponentId: null,
          });
        }
      },

      duplicateComponent: (id) => {
        const state = get();
        const component = state.components.find(comp => comp.id === id);
        if (component) {
          const duplicated: BuilderComponent = {
            ...component,
            id: uuidv4(),
            x: component.x + 20,
            y: component.y + 20,
          };
          set((state) => ({
            components: [...state.components, duplicated],
            selectedComponentId: duplicated.id,
          }));
          get().saveVersion(`Duplicated ${component.type} component`);
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      undo: () => {
        const state = get();
        if (state.canUndo && state.currentVersionIndex > 0) {
          const previousVersion = state.versions[state.currentVersionIndex - 1];
          set({
            components: [...previousVersion.components],
            selectedComponentId: null,
            currentVersionIndex: state.currentVersionIndex - 1,
            canRedo: true,
            canUndo: state.currentVersionIndex > 1,
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.canRedo && state.currentVersionIndex < state.versions.length - 1) {
          const nextVersion = state.versions[state.currentVersionIndex + 1];
          set({
            components: [...nextVersion.components],
            selectedComponentId: null,
            currentVersionIndex: state.currentVersionIndex + 1,
            canUndo: true,
            canRedo: state.currentVersionIndex < state.versions.length - 2,
          });
        }
      },

      snapToGrid: (x, y) => {
        const gridSize = 20;
        return {
          x: Math.round(x / gridSize) * gridSize,
          y: Math.round(y / gridSize) * gridSize,
        };
      },

      validateLayout: () => {
        const state = get();
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check for overlapping components
        for (let i = 0; i < state.components.length; i++) {
          for (let j = i + 1; j < state.components.length; j++) {
            const comp1 = state.components[i];
            const comp2 = state.components[j];
            
            if (
              comp1.x < comp2.x + comp2.width &&
              comp1.x + comp1.width > comp2.x &&
              comp1.y < comp2.y + comp2.height &&
              comp1.y + comp1.height > comp2.y
            ) {
              warnings.push(`Components "${comp1.type}" and "${comp2.type}" are overlapping`);
            }
          }
        }

        // Check for components outside canvas bounds
        state.components.forEach(comp => {
          if (comp.x < 0 || comp.y < 0) {
            warnings.push(`Component "${comp.type}" is outside canvas bounds`);
          }
        });

        // Check for missing required properties
        state.components.forEach(comp => {
          if (comp.type === 'text' && !comp.props.text) {
            warnings.push(`Text component missing content`);
          }
          if (comp.type === 'image' && !comp.props.src) {
            warnings.push(`Image component missing source`);
          }
        });

        return { errors, warnings };
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