import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDrag } from 'react-dnd';
import { useState } from 'react';
import { 
  // Layout icons
  Layout, 
  Columns, 
  Container,
  Grid3X3,
  Rows,
  
  // Content icons
  Type, 
  Image, 
  Video,
  FileText,
  Star,
  
  // Interactive icons
  Square, 
  Import,
  Search,
  MapPin,
  CheckSquare,
  
  // Advanced icons
  Code2,
  BarChart3,
  TrendingUp,
  Hash,
  ChevronDown
} from "lucide-react";

export interface ComponentTemplate {
  type: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  defaultProps: {
    width: number;
    height: number;
    props: Record<string, any>;
  };
}

const componentTemplates: ComponentTemplate[] = [
  // Layout Components
  {
    type: 'container',
    name: 'Container',
    icon: Container,
    category: 'layout',
    defaultProps: {
      width: 400,
      height: 300,
      props: {
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      },
    },
  },
  {
    type: 'columns',
    name: 'Columns',
    icon: Columns,
    category: 'layout',
    defaultProps: {
      width: 600,
      height: 200,
      props: {
        columns: 2,
        gap: 16,
        padding: 16,
        backgroundColor: 'hsl(var(--muted))',
      },
    },
  },
  {
    type: 'grid',
    name: 'Grid Layout',
    icon: Grid3X3,
    category: 'layout',
    defaultProps: {
      width: 400,
      height: 300,
      props: {
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderRadius: 8,
        columns: 2,
        gap: 16,
        padding: 16,
      },
    },
  },
  {
    type: 'section',
    name: 'Section',
    icon: Layout,
    category: 'layout',
    defaultProps: {
      width: 800,
      height: 400,
      props: {
        backgroundColor: 'hsl(var(--background))',
        padding: 24,
      },
    },
  },

  // Content Components
  {
    type: 'text',
    name: 'Text',
    icon: Type,
    category: 'content',
    defaultProps: {
      width: 200,
      height: 40,
      props: {
        text: 'Sample Text',
        color: 'hsl(var(--foreground))',
        fontSize: 16,
      },
    },
  },
  {
    type: 'heading',
    name: 'Heading',
    icon: Type,
    category: 'content',
    defaultProps: {
      width: 300,
      height: 60,
      props: {
        text: 'Heading Text',
        color: 'hsl(var(--foreground))',
        fontSize: 32,
        fontWeight: 'bold',
      },
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: Image,
    category: 'content',
    defaultProps: {
      width: 200,
      height: 150,
      props: {
        src: 'https://via.placeholder.com/200x150',
        alt: 'Placeholder image',
        borderRadius: 8,
      },
    },
  },
  {
    type: 'video',
    name: 'Video',
    icon: Video,
    category: 'content',
    defaultProps: {
      width: 320,
      height: 180,
      props: {
        src: '',
        controls: true,
        borderRadius: 8,
      },
    },
  },
  {
    type: 'icon',
    name: 'Icon',
    icon: Star,
    category: 'content',
    defaultProps: {
      width: 48,
      height: 48,
      props: {
        name: 'star',
        size: 24,
        color: 'hsl(var(--primary))',
      },
    },
  },

  // Interactive Components
  {
    type: 'button',
    name: 'Button',
    icon: Square,
    category: 'interactive',
    defaultProps: {
      width: 120,
      height: 40,
      props: {
        text: 'Button',
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: 6,
        padding: 12,
      },
    },
  },
  {
    type: 'input',
    name: 'Input',
    icon: Import,
    category: 'interactive',
    defaultProps: {
      width: 200,
      height: 40,
      props: {
        placeholder: 'Enter text...',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
      },
    },
  },
  {
    type: 'form',
    name: 'Form',
    icon: FileText,
    category: 'interactive',
    defaultProps: {
      width: 300,
      height: 200,
      props: {
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      },
    },
  },
  {
    type: 'search',
    name: 'Search',
    icon: Search,
    category: 'interactive',
    defaultProps: {
      width: 250,
      height: 40,
      props: {
        placeholder: 'Search...',
        borderColor: 'hsl(var(--border))',
        borderRadius: 20,
        padding: 12,
      },
    },
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: CheckSquare,
    category: 'interactive',
    defaultProps: {
      width: 150,
      height: 24,
      props: {
        label: 'Checkbox',
        checked: false,
      },
    },
  },
  {
    type: 'map',
    name: 'Map',
    icon: MapPin,
    category: 'interactive',
    defaultProps: {
      width: 300,
      height: 200,
      props: {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 10,
        borderRadius: 8,
      },
    },
  },

  // Advanced Components
  {
    type: 'embed',
    name: 'Embed Code',
    icon: Code2,
    category: 'advanced',
    defaultProps: {
      width: 400,
      height: 200,
      props: {
        code: '<iframe src="https://example.com"></iframe>',
        borderRadius: 8,
      },
    },
  },
  {
    type: 'chart',
    name: 'Chart',
    icon: BarChart3,
    category: 'advanced',
    defaultProps: {
      width: 300,
      height: 200,
      props: {
        type: 'bar',
        data: [],
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderRadius: 8,
      },
    },
  },
  {
    type: 'progress',
    name: 'Progress Bar',
    icon: TrendingUp,
    category: 'advanced',
    defaultProps: {
      width: 200,
      height: 20,
      props: {
        value: 50,
        max: 100,
        color: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--muted))',
        borderRadius: 10,
      },
    },
  },
  {
    type: 'counter',
    name: 'Counter',
    icon: Hash,
    category: 'advanced',
    defaultProps: {
      width: 120,
      height: 60,
      props: {
        value: 0,
        min: 0,
        max: 100,
        fontSize: 24,
        color: 'hsl(var(--foreground))',
      },
    },
  },
];

const categoryConfig = {
  layout: {
    name: 'Layout',
    icon: Layout,
    description: 'Containers, grids, sections'
  },
  content: {
    name: 'Content',
    icon: Type,
    description: 'Text, images, media'
  },
  interactive: {
    name: 'Interactive',
    icon: Square,
    description: 'Forms, buttons, inputs'
  },
  advanced: {
    name: 'Advanced',
    icon: Code2,
    description: 'Charts, embeds, widgets'
  }
};

interface DraggableComponentProps {
  template: ComponentTemplate;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ template }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { template },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const IconComponent = template.icon;

  return (
    <div
      ref={drag}
      className={`p-3 border border-sidebar-border rounded-lg cursor-grab hover:bg-sidebar-accent/50 transition-smooth group ${
        isDragging ? 'opacity-50 drag-preview' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <IconComponent className="h-5 w-5 text-sidebar-foreground/70 group-hover:text-sidebar-primary transition-colors" />
        <span className="text-xs font-medium text-sidebar-foreground text-center leading-tight">
          {template.name}
        </span>
      </div>
    </div>
  );
};

export const ComponentLibrary: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['layout', 'content', 'interactive']));

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  const getComponentsByCategory = (category: string) => {
    return componentTemplates.filter(template => template.category === category);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Components</h2>
        <p className="text-xs text-sidebar-foreground/70 mt-1">
          Drag components to the canvas
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.entries(categoryConfig).map(([categoryKey, category]) => {
            const components = getComponentsByCategory(categoryKey);
            const isOpen = openCategories.has(categoryKey);
            const CategoryIcon = category.icon;
            
            return (
              <Collapsible 
                key={categoryKey}
                open={isOpen}
                onOpenChange={() => toggleCategory(categoryKey)}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-sidebar-accent/50 transition-smooth group">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-sidebar-primary" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-sidebar-foreground">
                        {category.name}
                      </div>
                      <div className="text-xs text-sidebar-foreground/70">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-sidebar-foreground/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {components.map((template) => (
                      <DraggableComponent key={template.type} template={template} />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};