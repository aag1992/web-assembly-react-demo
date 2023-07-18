export const textPlaceholder = 'USER_SEARCH_TEXT';

export const queries = {
    searchTranscripts: `
      SELECT v.drive_id, v.id, t.start_time
      FROM transcripts t
      JOIN videos v ON t.video_id = v.id
      WHERE t."text" LIKE '%USER_SEARCH_TEXT%'
    `
  };
  