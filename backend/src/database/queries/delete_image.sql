DELETE FROM images
WHERE image_id IN (
    SELECT image_id
    FROM project_image
    WHERE project_id = ?
);