CREATE TABLE project_image (
    project_id UUID REFERENCES projects(project_id),
    image_id UUID REFERENCES images(image_id),
    PRIMARY KEY (project_id, image_id)
);