import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X, Upload } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';

interface InlineEditorProps {
  componentId: string;
  type: 'text' | 'image';
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  multiline?: boolean;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  componentId,
  type,
  value,
  onSave,
  onCancel,
  multiline = false
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onSave(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (type === 'image') {
    return (
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm border-2 border-primary rounded-lg p-2 z-50 animate-fade-in">
        <div className="space-y-2">
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter image URL..."
            onKeyDown={handleKeyDown}
            className="text-sm"
          />
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm border-2 border-primary rounded-lg p-2 z-50 animate-fade-in">
      <div className="space-y-2">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm resize-none"
            rows={3}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm"
          />
        )}
        
        <div className="flex gap-1 justify-end">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};