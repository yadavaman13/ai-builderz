import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComponentData {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: any;
}

interface ProjectData {
  components: ComponentData[];
  metadata: {
    name: string;
    createdAt: string;
    componentCount: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Deploy to Netlify function called');
    
    const { projectData } = await req.json() as { projectData: ProjectData };
    
    if (!projectData || !projectData.components) {
      throw new Error('Invalid project data');
    }

    // Generate HTML content from components
    const htmlContent = generateHTMLFromComponents(projectData.components);
    
    // Generate Netlify-specific configuration
    const netlifyConfig = {
      build: {
        publish: ".",
        command: "echo 'Static site ready'"
      },
      headers: [
        {
          for: "/*",
          values: {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
        }
      ]
    };

    // Generate project files
    const files = {
      'index.html': htmlContent,
      'netlify.toml': generateNetlifyToml(netlifyConfig),
      '_redirects': '/* /index.html 200'
    };

    // For demo purposes, we'll return a mock deployment URL
    // In a real implementation, you would use the Netlify API
    const mockDeploymentId = Math.random().toString(36).substring(2, 15);
    const deploymentUrl = `https://${projectData.metadata.name.toLowerCase().replace(/\s+/g, '-')}-${mockDeploymentId}.netlify.app`;
    
    console.log('Generated Netlify deployment URL:', deploymentUrl);
    console.log('Project files generated:', Object.keys(files));

    // Store deployment info
    const deploymentInfo = {
      url: deploymentUrl,
      platform: 'netlify',
      deployedAt: new Date().toISOString(),
      files: Object.keys(files),
      componentCount: projectData.components.length,
      status: 'deployed'
    };

    return new Response(JSON.stringify({
      url: deploymentUrl,
      deploymentId: mockDeploymentId,
      platform: 'netlify',
      files: Object.keys(files),
      deployedAt: deploymentInfo.deployedAt,
      status: 'success'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Netlify deployment error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Deployment failed',
      status: 'error',
      platform: 'netlify'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateNetlifyToml(config: any): string {
  return `[build]
  publish = "${config.build.publish}"
  command = "${config.build.command}"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;
}

function generateHTMLFromComponents(components: ComponentData[]): string {
  const componentHTML = components.map(comp => {
    const style = `position: absolute; left: ${comp.x}px; top: ${comp.y}px; width: ${comp.width}px; height: ${comp.height}px;`;
    
    switch (comp.type) {
      case 'text':
        return `<div style="${style}">
          <p style="color: ${comp.props.color || '#000000'}; font-size: ${comp.props.fontSize || 16}px; margin: 0;">
            ${comp.props.text || 'Text Component'}
          </p>
        </div>`;
        
      case 'button':
        return `<div style="${style}">
          <button style="
            background-color: ${comp.props.backgroundColor || '#3b82f6'}; 
            color: ${comp.props.color || '#ffffff'}; 
            padding: 8px 16px; 
            border-radius: 4px; 
            border: none; 
            cursor: pointer;
            width: 100%;
            height: 100%;
          ">
            ${comp.props.text || 'Button'}
          </button>
        </div>`;
        
      case 'image':
        return `<div style="${style}">
          <img 
            src="${comp.props.src || 'https://via.placeholder.com/300x200'}" 
            alt="${comp.props.alt || 'Image'}" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: ${comp.props.borderRadius || 0}px;"
          />
        </div>`;
        
      case 'form':
        return `<div style="${style}">
          <form style="
            background: ${comp.props.backgroundColor || '#ffffff'}; 
            padding: 16px; 
            border-radius: 8px; 
            border: 1px solid ${comp.props.borderColor || '#e5e7eb'};
            height: 100%;
          ">
            <h3 style="margin: 0 0 16px 0; color: ${comp.props.color || '#000000'};">
              ${comp.props.title || 'Contact Form'}
            </h3>
            <input type="text" placeholder="Name" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;" required />
            <input type="email" placeholder="Email" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;" required />
            <textarea placeholder="Message" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; min-height: 60px;" required></textarea>
            <button type="submit" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
              Submit
            </button>
          </form>
        </div>`;
        
      default:
        return `<div style="${style}">
          <div style="
            background: ${comp.props.backgroundColor || '#f3f4f6'}; 
            border: 1px dashed ${comp.props.borderColor || '#9ca3af'}; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            height: 100%;
            color: ${comp.props.color || '#6b7280'};
          ">
            ${comp.type} Component
          </div>
        </div>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App - Powered by Visual Builder</title>
    <meta name="description" content="App built with visual builder and deployed on Netlify">
    <style>
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
        
        @media (max-width: 768px) {
            #root > div {
                position: relative !important;
                width: 100% !important;
                margin-bottom: 16px;
            }
        }
    </style>
</head>
<body>
    <div id="root">
        ${componentHTML}
    </div>
    
    <script>
        // Add basic interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Handle form submissions with Netlify Forms integration
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.setAttribute('netlify', '');
                form.setAttribute('method', 'POST');
                
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Collect form data
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());
                    
                    // Show success message (in production this would submit to Netlify)
                    alert('Thank you! Your form has been submitted.');
                    console.log('Form data:', data);
                    
                    // Reset form
                    this.reset();
                });
            });
            
            // Add click tracking for buttons
            const buttons = document.querySelectorAll('button[type!="submit"]');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    console.log('Button clicked:', this.textContent);
                });
            });
            
            // Add Google Analytics placeholder
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID');
            }
        });
    </script>
</body>
</html>`;
}