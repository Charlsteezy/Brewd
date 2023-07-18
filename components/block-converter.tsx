import * as React from "react"

interface BlockConverterProps {
    block: any,
}

export function BlockConverter( { block } : BlockConverterProps ) {

        const convertToHtml = (block) => {
          switch (block.type) {
            case 'header':
              return <h1>{block.data.text}</h1>;
            case 'embded':
              return (
                <div>
                  <iframe
                    width="560"
                    height="315"
                    src={block.data.embed}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              );
            case 'paragraph':
              return <p>{block.data.text}</p>;
            case 'delimiter':
              return <hr />;
            case 'image':
              return (
                <div>
                  <img
                    className="img-fluid"
                    src={block.data.file.url}
                    title={block.data.caption}
                  />
                  <br />
                  <em>{block.data.caption}</em>
                </div>
              );
            case 'list':
              return (
                <ul>
                  {block.data.items.map((li, index) => (
                    <li key={index}>{li}</li>
                  ))}
                </ul>
              );
            default:
              console.log('Unknown block type', block.type);
              return null;
          }
        };
      
        return (
          <div>
            {block.map((block, index) => (
              <React.Fragment key={index}>{convertToHtml(block)}</React.Fragment>
            ))}
          </div>
        );  
}