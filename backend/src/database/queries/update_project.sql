UPDATE projects
SET title = ?, 
    description = ?, 
    year = ?, 
    is_top = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE project_id = ?;
