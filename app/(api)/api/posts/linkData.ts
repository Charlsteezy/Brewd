import { NextApiRequest, NextApiResponse } from "next"

interface EditorJSLinkData {
    text: string;
    url: string;
    title?: string;
  }
  
  interface EditorJSLinkTool {
    apiEndpoint: string;
    sanitize?: (url: string) => string;
    defaultProtocol?: string;
    target?: string;
  }
  
  class EditorJSLink {
    private readonly linkTool: EditorJSLinkTool;
  
    constructor(linkTool: EditorJSLinkTool) {
      this.linkTool = linkTool;
    }
  
    async fetchLinkData(url: string): Promise<EditorJSLinkData> {
      const { apiEndpoint, sanitize, defaultProtocol, target } = this.linkTool;
  
      // Add default protocol if necessary
      if (defaultProtocol && !url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
        url = `${defaultProtocol}//${url}`;
      }
  
      // Sanitize URL if necessary
      if (sanitize) {
        url = sanitize(url);
      }
  
      // Send request to API endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
  
      // Parse response JSON
      const { title } = await response.json();
  
      return {
        text: title,
        url,
        title,
      };
    }
  }
  