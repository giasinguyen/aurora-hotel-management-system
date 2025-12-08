import { useContext } from "react";
import { EditorContext } from "@tiptap/react";

// --- UI Primitives ---
import { Button } from "@/components/titap/tiptap-ui-primitive/button";

// --- Icons ---
import { Eye } from "lucide-react";

export interface PreviewButtonProps {
  className?: string;
  onPreview?: (html: string, json: object) => void;
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({ 
  className,
  onPreview 
}) => {
  const { editor } = useContext(EditorContext);

  const handlePreview = () => {
    if (!editor) return;

    const html = editor.getHTML();
    const json = editor.getJSON();

    // Log to console for debugging
    console.log("Editor HTML:", html);
    console.log("Editor JSON:", json);

    // Call callback if provided
    if (onPreview) {
      onPreview(html, json);
    }

    // You can also open in new window/modal
    // Example: Open HTML preview in new window
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview</title>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
                line-height: 1.6;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              pre {
                background: #f5f5f5;
                padding: 1rem;
                border-radius: 4px;
                overflow-x: auto;
              }
              code {
                background: #f5f5f5;
                padding: 0.2rem 0.4rem;
                border-radius: 3px;
                font-size: 0.9em;
              }
              blockquote {
                border-left: 4px solid #ddd;
                padding-left: 1rem;
                margin-left: 0;
                color: #666;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
            </style>
          </head>
          <body>
            <div style="margin-bottom: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px;">
              <h3 style="margin-top: 0;">Content Preview</h3>
              <details>
                <summary style="cursor: pointer; margin-bottom: 1rem;">View JSON</summary>
                <pre><code>${JSON.stringify(json, null, 2)}</code></pre>
              </details>
            </div>
            <hr style="margin: 2rem 0;">
            ${html}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  if (!editor) return null;

  return (
    <Button
      type="button"
      data-style="ghost"
      onClick={handlePreview}
      className={className}
      aria-label="Preview content"
    >
      <Eye className="tiptap-button-icon" />
    </Button>
  );
};

export default PreviewButton;
