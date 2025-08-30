import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, Check } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { useToast } from '@/hooks/use-toast';

export function ExportDialog() {
  const [open, setOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const { components } = useBuilderStore();
  const { toast } = useToast();

  const generateHTML = () => {
    const componentHTML = components.map(comp => {
      const style = `position: absolute; left: ${comp.x}px; top: ${comp.y}px; width: ${comp.width}px; height: ${comp.height}px;`;
      
      switch (comp.type) {
        case 'text':
        case 'heading':
          return `<${comp.type === 'heading' ? 'h1' : 'p'} style="${style}color: ${comp.props.color || '#000000'}; font-size: ${comp.props.fontSize || 16}px; margin: 0; font-weight: ${comp.props.fontWeight || 'normal'};">
            ${comp.props.text || 'Text Component'}
          </${comp.type === 'heading' ? 'h1' : 'p'}>`;
          
        case 'button':
          return `<button style="${style}background-color: ${comp.props.backgroundColor || '#3b82f6'}; color: ${comp.props.color || '#ffffff'}; padding: 8px 16px; border-radius: ${comp.props.borderRadius || 4}px; border: none; cursor: pointer; width: 100%; height: 100%;">
            ${comp.props.text || 'Button'}
          </button>`;
          
        case 'image':
          return `<img src="${comp.props.src || 'https://via.placeholder.com/300x200'}" alt="${comp.props.alt || 'Image'}" style="${style}width: 100%; height: 100%; object-fit: cover; border-radius: ${comp.props.borderRadius || 0}px;" />`;
          
        case 'input':
          return `<input type="text" placeholder="${comp.props.placeholder || 'Enter text...'}" style="${style}width: 100%; height: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />`;
          
        case 'form':
          return `<form style="${style}background: ${comp.props.backgroundColor || '#ffffff'}; padding: 16px; border-radius: 8px; border: 1px solid ${comp.props.borderColor || '#e5e7eb'}; height: 100%;">
            <h3 style="margin: 0 0 16px 0;">${comp.props.title || 'Contact Form'}</h3>
            <input type="text" placeholder="Name" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;" required />
            <input type="email" placeholder="Email" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;" required />
            <textarea placeholder="Message" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; min-height: 60px;" required></textarea>
            <button type="submit" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
          </form>`;
          
        default:
          return `<div style="${style}background: ${comp.props.backgroundColor || '#f3f4f6'}; border: 1px dashed ${comp.props.borderColor || '#9ca3af'}; display: flex; align-items: center; justify-content: center; height: 100%; color: ${comp.props.color || '#6b7280'};">
            ${comp.type} Component
          </div>`;
      }
    }).join('\n    ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="root">
        ${componentHTML}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateCSS = () => {
    return `/* Generated CSS */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #ffffff;
    min-height: 100vh;
    position: relative;
}

#root {
    position: relative;
    width: 100%;
    min-height: 100vh;
}

button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

form input:focus,
form textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Component-specific styles */
${components.map(comp => {
  return `.component-${comp.id} {
    position: absolute;
    left: ${comp.x}px;
    top: ${comp.y}px;
    width: ${comp.width}px;
    height: ${comp.height}px;
}`;
}).join('\n')}

/* Responsive Design */
@media (max-width: 768px) {
    #root > * {
        position: relative !important;
        width: 100% !important;
        margin-bottom: 16px;
    }
}`;
  };

  const generateReact = () => {
    const componentJSX = components.map(comp => {
      const style = {
        position: 'absolute' as const,
        left: comp.x,
        top: comp.y,
        width: comp.width,
        height: comp.height,
      };
      
      const componentProps = JSON.stringify({
        style,
        ...comp.props
      }, null, 6).replace(/"/g, '');

      switch (comp.type) {
        case 'text':
          return `      <p ${componentProps}>
        {props.text || 'Text Component'}
      </p>`;
        case 'heading':
          return `      <h1 ${componentProps}>
        {props.text || 'Heading'}
      </h1>`;
        case 'button':
          return `      <button ${componentProps}>
        {props.text || 'Button'}
      </button>`;
        case 'image':
          return `      <img 
        src={props.src || 'https://via.placeholder.com/300x200'}
        alt={props.alt || 'Image'}
        ${componentProps}
      />`;
        case 'input':
          return `      <input 
        type="text"
        placeholder={props.placeholder || 'Enter text...'}
        ${componentProps}
      />`;
        default:
          return `      <div ${componentProps}>
        {props.type} Component
      </div>`;
      }
    }).join('\n');

    return `import React from 'react';

const GeneratedApp = () => {
  return (
    <div 
      id="root" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh' 
      }}
    >
${componentJSX}
    </div>
  );
};

export default GeneratedApp;`;
  };

  const handleCopy = async (content: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
      toast({
        title: 'Copied!',
        description: `${tab} code copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded!',
      description: `${filename} has been downloaded.`,
    });
  };

  const htmlContent = generateHTML();
  const cssContent = generateCSS();
  const reactContent = generateReact();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover-lift">
          <Download className="h-4 w-4 mr-2" />
          Export Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {components.length} component{components.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline">
              Production Ready
            </Badge>
          </div>
          
          <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">HTML Code</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(htmlContent, 'HTML')}
                  >
                    {copiedTab === 'HTML' ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(htmlContent, 'index.html', 'text/html')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                value={htmlContent}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="css" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CSS Styles</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(cssContent, 'CSS')}
                  >
                    {copiedTab === 'CSS' ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(cssContent, 'styles.css', 'text/css')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                value={cssContent}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="react" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">React Component</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(reactContent, 'React')}
                  >
                    {copiedTab === 'React' ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(reactContent, 'GeneratedApp.jsx', 'text/javascript')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                value={reactContent}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}