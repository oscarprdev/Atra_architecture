SELECT
    projects.project_id,
    projects.title,
    projects.description,
    projects.year,
    projects.is_top,
    projects.created_at,
    projects.updated_at,
    GROUP_CONCAT(
        CASE WHEN images.is_main = 0 THEN images.key END
    ) AS images,
    MAX(CASE WHEN images.is_main = 1 THEN images.key END) AS main_image
FROM
    projects
JOIN
    project_image ON projects.project_id = project_image.project_id
JOIN
    images ON project_image.image_id = images.image_id
GROUP BY
    projects.project_id, projects.title, projects.description, projects.year, projects.is_top, projects.created_at, projects.updated_at;

