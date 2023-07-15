import React from 'react';

export default function VideoPlayer() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Video name="LA Airspace" source="Uber Elevate" src="https://drive.google.com/file/d/17SEyxcV99SqwepeCmQxXh_g2jZF7fq7d/preview?t=12" />
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

