SELECT projects.*, images.*
FROM projects
LEFT JOIN project_image ON projects.project_id = project_image.project_id
LEFT JOIN images ON project_image.image_id = images.image_id;