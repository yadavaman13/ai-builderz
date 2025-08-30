import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDrag } from 'react-dnd';
import { 
  Type, 
  Square, 
  Import, 
  FileText, 
  CreditCard, 
  Menu, 
  Table, 
  Image, 
  BarChart3, 
  Grid3X3 
} from "lucide-react";

export interface ComponentTemplate {
  type: string;
  name: string;
  icon: React.ComponentType<any>;
  defaultProps: {
    width: number;
    height: number;
    props: Record<string, any>;
  };
}

const componentTemplates: ComponentTemplate[] = [
  {
    type: 'button',
    name: 'Button',
    icon: Square,
    defaultProps: {
      width: 120,
      height: 40,
      props: {
        text: 'Button',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: 6,
        padding: 12,
      },
    },
  },
  {
    type: 'text',
    name: 'Text',
    icon: Type,
    defaultProps: {
      width: 200,
      height: 40,
      props: {
        text: 'Sample Text',
        color: '#1f2937',
        fontSize: 16,
      },
    },
  },
  {
    type: 'input',
    name: 'Input',
    icon: Import,
    defaultProps: {
      width: 200,
      height: 40,
      props: {
        placeholder: 'Enter text...',
        borderColor: '#d1d5db',
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
    defaultProps: {
      width: 300,
      height: 200,
      props: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      },
    },
  },
  {
    type: 'card',
    name: 'Card',
    icon: CreditCard,
    defaultProps: {
      width: 250,
      height: 150,
      props: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      },
    },
  },
  {
    type: 'navbar',
    name: 'Navbar',
    icon: Menu,
    defaultProps: {
      width: 400,
      height: 60,
      props: {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: 16,
      },
    },
  },
  {
    type: 'table',
    name: 'Table',
    icon: Table,
    defaultProps: {
      width: 400,
      height: 200,
      props: {
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: Image,
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
    type: 'chart',
    name: 'Chart',
    icon: BarChart3,
    defaultProps: {
      width: 300,
      height: 200,
      props: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
      },
    },
  },
  {
    type: 'grid',
    name: 'Grid Layout',
    icon: Grid3X3,
    defaultProps: {
      width: 400,
      height: 300,
      props: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        columns: 2,
        gap: 16,
        padding: 16,
      },
    },
  },
];

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
      className={`p-3 border border-border rounded-lg cursor-grab hover:bg-accent/50 transition-smooth ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <IconComponent className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-medium">{template.name}</span>
      </div>
    </div>
  );
};

export const ComponentLibrary: React.FC = () => {
  return (
    <Card className="w-64 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Components</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-2 gap-3">
            {componentTemplates.map((template) => (
              <DraggableComponent key={template.type} template={template} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};