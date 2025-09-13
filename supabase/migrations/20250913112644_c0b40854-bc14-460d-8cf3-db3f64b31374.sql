-- Remove duplicate media items, keeping only the most recent one for each unique combination
WITH duplicates AS (
  SELECT id, 
    ROW_NUMBER() OVER (
      PARTITION BY creator_id, title, media_type 
      ORDER BY created_at DESC
    ) as row_num
  FROM media_items
)
DELETE FROM media_items 
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Verify the cleanup worked - this should return no rows if successful
-- (This is just a comment for verification, not executed)
-- SELECT creator_id, title, media_type, COUNT(*) FROM media_items GROUP BY creator_id, title, media_type HAVING COUNT(*) > 1;