CREATE TABLE project_image (
    project_id UUID,
    image_id UUID,
    PRIMARY KEY (project_id, image_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (image_id) REFERENCES images(image_id)
);
