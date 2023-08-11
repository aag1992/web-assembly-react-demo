import React from 'react';

export default function VideoPlayer({ source }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {source ? (
          <Video name="LA Ai  rspace" source="Uber Elevate" src={source} />
        ) : (
          <div style={{ width: '640px', height: '360px', backgroundColor: '#000' }} />
        )}
      </div>
    </div>
  );
}

function Video({ name, source, src }) {
  return (
    <div style={{ font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif" }}>
      <iframe
        frameBorder="0"
        width="640"
        height="360"
        allowFullScreen={true}
        title={name}
        src={src}
      />
    </div>
  );
}
