export const textPlaceholder = 'USER_SEARCH_TEXT';

export const queries = {
    searchTranscripts: `
      SELECT t.text, v.drive_id, v.id, t.start_time
      FROM transcripts t
      JOIN videos v ON t.video_id = v.id
      WHERE t."text" LIKE '%USER_SEARCH_TEXT%'
    `,
    searchOCR: `
    SELECT o.video_id,v.drive_id, o.formatted_datetime, oi.start_time
    FROM ocr o
    JOIN ocr_instances oi ON o.id = oi.ocr_id
    JOIN videos v ON o.video_id = v.id
    WHERE o.is_date_time = 1
      AND o.formatted_datetime BETWEEN :startEpoch AND :endEpoch
  `,
};
