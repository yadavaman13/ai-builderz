import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  unique: boolean;
}

export interface DatabaseTable {
  name: string;
  columns: TableColumn[];
  row_count?: number;
}

export interface ComponentBinding {
  componentId: string;
  action: 'insert' | 'select' | 'update' | 'delete' | 'auth_login' | 'auth_logout';
  table?: string;
  fields?: Record<string, string>; // component field -> table column mapping
  query?: string;
  conditions?: Record<string, any>;
}

interface DatabaseState {
  tables: DatabaseTable[];
  bindings: ComponentBinding[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTables: () => Promise<void>;
  createTable: (name: string, columns: TableColumn[]) => Promise<boolean>;
  addBinding: (binding: ComponentBinding) => void;
  updateBinding: (componentId: string, binding: Partial<ComponentBinding>) => void;
  removeBinding: (componentId: string) => void;
  getBinding: (componentId: string) => ComponentBinding | null;
  testAction: (componentId: string, testData?: Record<string, any>) => Promise<boolean>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  tables: [],
  bindings: [],
  loading: false,
  error: null,

  fetchTables: async () => {
    set({ loading: true, error: null });
    try {
      // Use edge function to get schema information
      const { data, error } = await supabase.functions.invoke('get-schema');
      
      if (error) {
        console.error('Schema fetch error:', error);
        throw error;
      }

      const tables = data?.tables || [];
      set({ tables, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch tables:', error);
      set({ error: error.message, loading: false, tables: [] });
    }
  },

  createTable: async (name: string, columns: TableColumn[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-table', {
        body: { tableName: name, columns }
      });

      if (error) {
        console.error('Create table error:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to create table');
      }

      // Refresh tables after creation
      await get().fetchTables();
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  addBinding: (binding) => {
    set((state) => ({
      bindings: [...state.bindings.filter(b => b.componentId !== binding.componentId), binding],
    }));
  },

  updateBinding: (componentId, updates) => {
    set((state) => ({
      bindings: state.bindings.map(binding =>
        binding.componentId === componentId ? { ...binding, ...updates } : binding
      ),
    }));
  },

  removeBinding: (componentId) => {
    set((state) => ({
      bindings: state.bindings.filter(b => b.componentId !== componentId),
    }));
  },

  getBinding: (componentId) => {
    return get().bindings.find(b => b.componentId === componentId) || null;
  },

  testAction: async (componentId, testData = {}) => {
    const binding = get().getBinding(componentId);
    if (!binding) return false;

    try {
      switch (binding.action) {
        case 'insert':
          if (!binding.table || !['profiles', 'projects'].includes(binding.table)) return false;
          // For testing, we'll just check if we can access the table
          const { error: insertError } = await supabase
            .from(binding.table as 'profiles' | 'projects')
            .select('*')
            .limit(1);
          return !insertError;

        case 'select':
          if (!binding.table || !['profiles', 'projects'].includes(binding.table)) return false;
          const { error: selectError } = await supabase
            .from(binding.table as 'profiles' | 'projects')
            .select('*')
            .limit(1);
          return !selectError;

        case 'auth_login':
          // Test auth is working
          const { data: { session } } = await supabase.auth.getSession();
          return !!session;

        case 'auth_logout':
          return true; // Logout always works

        default:
          return false;
      }
    } catch (error) {
      console.error('Test action failed:', error);
      return false;
    }
  },
}));