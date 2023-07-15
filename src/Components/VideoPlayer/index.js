import React from 'react';

export default function VideoPlayer({source}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Video name="LA Airspace" source="Uber Elevate" src={source} />
      </div>
    </div>
  );
}

function Video({ name, source, src }) {
  return (
    <div style={{ font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif" }}>
      <iframe frameBorder="0" width="640" height="360" allowFullScreen={true} title={name} src={src} />
    </div>
  );
}

