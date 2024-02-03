CREATE TABLE images (
    image_id UUID PRIMARY KEY,
    key VARCHAR(256) NOT NULL,
    is_main BOOL DEFAULT FALSE
);