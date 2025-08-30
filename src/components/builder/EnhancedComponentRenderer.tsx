import React, { memo } from 'react';
import { BuilderComponent } from '@/stores/builderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Star, 
  Heart, 
  ThumbsUp, 
  Play, 
  Pause, 
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface ComponentRendererProps {
  component: BuilderComponent;
  isEditing?: boolean;
}

export const EnhancedComponentRenderer: React.FC<ComponentRendererProps> = memo(({ 
  component, 
  isEditing = false 
}) => {
  const { type, props } = component;

  const baseStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor,
    color: props.color,
    fontSize: props.fontSize,
    padding: props.padding,
    margin: props.margin,
    borderRadius: props.borderRadius,
    borderWidth: props.borderWidth,
    borderColor: props.borderColor,
    borderStyle: props.borderWidth ? 'solid' : 'none',
    fontWeight: props.fontWeight,
  };

  const renderComponent = () => {
    switch (type) {
      case 'text':
        return (
          <div 
            style={baseStyle} 
            className={`${!isEditing ? 'pointer-events-none' : ''} select-text`}
          >
            {props.text || 'Sample Text'}
          </div>
        );

      case 'heading':
        return (
          <h1 
            style={baseStyle} 
            className={`${!isEditing ? 'pointer-events-none' : ''} font-bold text-2xl select-text`}
          >
            {props.text || 'Heading Text'}
          </h1>
        );

      case 'button':
        return (
          <Button
            style={baseStyle}
            className={!isEditing ? 'pointer-events-none' : ''}
            size="default"
          >
            {props.text || 'Button'}
          </Button>
        );

      case 'input':
        return (
          <Input
            placeholder={props.placeholder || 'Enter text...'}
            style={baseStyle}
            className={!isEditing ? 'pointer-events-none' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={props.placeholder || 'Enter text...'}
            style={baseStyle}
            className={!isEditing ? 'pointer-events-none' : ''}
            rows={props.rows || 4}
          />
        );

      case 'checkbox':
        return (
          <div className={`flex items-center space-x-2 ${!isEditing ? 'pointer-events-none' : ''}`} style={baseStyle}>
            <Checkbox checked={props.checked || false} />
            <label className="text-sm font-medium">
              {props.label || 'Checkbox'}
            </label>
          </div>
        );

      case 'form':
        return (
          <Card style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">{props.title || 'Contact Form'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Name" />
              <Input placeholder="Email" type="email" />
              <Textarea placeholder="Message" rows={3} />
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>
        );

      case 'card':
        return (
          <Card style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <CardHeader>
              <CardTitle>{props.title || 'Card Title'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {props.content || 'Card content goes here. You can add any information you want to display.'}
              </p>
            </CardContent>
          </Card>
        );

      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/200x150?text=Click+to+Edit'}
            alt={props.alt || 'Placeholder'}
            style={{
              ...baseStyle,
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            className={`${!isEditing ? 'pointer-events-none' : ''} cursor-pointer hover:opacity-80 transition-opacity`}
          />
        );

      case 'video':
        return (
          <div 
            style={baseStyle} 
            className={`relative bg-muted rounded-lg overflow-hidden ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            {props.src ? (
              <video 
                src={props.src} 
                controls={props.controls !== false}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Video Placeholder</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'icon':
        const IconComponent = getIconComponent(props.name);
        return (
          <div style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <IconComponent 
              size={props.size || 24} 
              color={props.color || 'currentColor'}
            />
          </div>
        );

      case 'progress':
        return (
          <div style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{props.label || 'Progress'}</span>
                <span>{props.value || 50}%</span>
              </div>
              <Progress value={props.value || 50} className="w-full" />
            </div>
          </div>
        );

      case 'counter':
        return (
          <div 
            style={baseStyle} 
            className={`text-center ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="text-3xl font-bold">{props.value || 0}</div>
            <div className="text-sm text-muted-foreground">{props.label || 'Counter'}</div>
          </div>
        );

      case 'badge':
        return (
          <Badge 
            variant={props.variant || 'default'}
            style={baseStyle} 
            className={!isEditing ? 'pointer-events-none' : ''}
          >
            {props.text || 'Badge'}
          </Badge>
        );

      case 'navbar':
        return (
          <nav 
            style={baseStyle}
            className={`flex items-center justify-between p-4 border-b ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="font-bold text-lg">{props.brand || 'Brand'}</div>
            <div className="flex gap-6">
              <span className="hover:text-primary cursor-pointer">Home</span>
              <span className="hover:text-primary cursor-pointer">About</span>
              <span className="hover:text-primary cursor-pointer">Services</span>
              <span className="hover:text-primary cursor-pointer">Contact</span>
            </div>
          </nav>
        );

      case 'table':
        return (
          <div style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3">John Doe</td>
                  <td className="p-3">john@example.com</td>
                  <td className="p-3">Admin</td>
                  <td className="p-3"><Badge variant="default">Active</Badge></td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3">Jane Smith</td>
                  <td className="p-3">jane@example.com</td>
                  <td className="p-3">User</td>
                  <td className="p-3"><Badge variant="secondary">Pending</Badge></td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3">Bob Johnson</td>
                  <td className="p-3">bob@example.com</td>
                  <td className="p-3">Editor</td>
                  <td className="p-3"><Badge variant="default">Active</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        return (
          <Card style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Chart Visualization</p>
                <p className="text-sm text-muted-foreground">
                  {props.type || 'Bar'} Chart Placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'grid':
        return (
          <div
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
              gap: props.gap || 16,
            }}
            className={!isEditing ? 'pointer-events-none' : ''}
          >
            {Array.from({ length: (props.columns || 2) * (props.rows || 2) }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Item {i + 1}</h3>
                  <p className="text-xs text-muted-foreground">Grid content</p>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'container':
        return (
          <div
            style={{
              ...baseStyle,
              minHeight: '100px',
              border: `2px dashed ${props.borderColor || 'hsl(var(--border))'}`,
            }}
            className={`flex items-center justify-center ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="text-center text-muted-foreground">
              <div className="text-sm font-medium">Container</div>
              <div className="text-xs">Drop components here</div>
            </div>
          </div>
        );

      case 'section':
        return (
          <section
            style={baseStyle}
            className={`min-h-[200px] ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{props.title || 'Section Title'}</h2>
              <p className="text-muted-foreground">
                {props.content || 'This is a section component. You can add content here and customize the styling.'}
              </p>
            </div>
          </section>
        );

      case 'columns':
        return (
          <div
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
              gap: props.gap || 16,
            }}
            className={!isEditing ? 'pointer-events-none' : ''}
          >
            {Array.from({ length: props.columns || 2 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border border-dashed border-muted-foreground/30 rounded-lg min-h-[120px] flex items-center justify-center"
              >
                <div className="text-center text-muted-foreground">
                  <div className="text-sm">Column {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'map':
        return (
          <div 
            style={baseStyle}
            className={`bg-muted rounded-lg overflow-hidden ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  Lat: {props.latitude || '37.7749'}, Lng: {props.longitude || '-122.4194'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className={`relative ${!isEditing ? 'pointer-events-none' : ''}`} style={baseStyle}>
            <Input
              placeholder={props.placeholder || 'Search...'}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        );

      case 'embed':
        return (
          <div 
            style={baseStyle}
            className={`bg-muted rounded-lg overflow-hidden ${!isEditing ? 'pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Embedded Content</div>
                <div className="text-xs text-muted-foreground font-mono bg-background p-2 rounded max-w-xs truncate">
                  {props.code || '<iframe src="https://example.com"></iframe>'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div style={baseStyle} className={!isEditing ? 'pointer-events-none' : ''}>
            <div className="text-center text-muted-foreground">
              <div className="text-sm">Unknown Component</div>
              <div className="text-xs">{type}</div>
            </div>
          </div>
        );
    }
  };

  return <div className="w-full h-full">{renderComponent()}</div>;
});

const getIconComponent = (name: string = 'star') => {
  const icons: Record<string, React.ComponentType<any>> = {
    star: Star,
    heart: Heart,
    thumbsup: ThumbsUp,
    play: Play,
    pause: Pause,
    barchart: BarChart3,
    trending: TrendingUp,
    map: MapPin,
    calendar: Calendar,
    clock: Clock,
    user: User,
    mail: Mail,
    phone: Phone,
  };
  
  return icons[name.toLowerCase()] || Star;
};

EnhancedComponentRenderer.displayName = 'EnhancedComponentRenderer';