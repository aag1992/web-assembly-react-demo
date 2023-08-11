import React from 'react';

export default function VideoPlayer({ source }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {source ? (
          <Video name="VHS player" source="VHS Videos" src={source} />
        ) : (
          <div style={{ width: '640px', height: '360px', backgroundColor: '#000' }} />
        )}
      </div>
    </div>
  );
}

function Video({ name, source, src }) {
  return (
    <div style={{ font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
      <iframe
        frameBorder="0"
        width="640"
        height="360"
        allow="autoplay"
        allowFullScreen={true}
        title={name}
        src={src}
        style={{
          border: '1px solid #fff',
          borderRadius: '5px',
          padding: '10px',
        }}
      />
    </div>
  );
}
