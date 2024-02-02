UPDATE users
SET email = ?, 
    password_hash = ?, 
    name = ?, 
    phone = ?, 
    direction = ?, 
    key_image = ?
WHERE user_id = ?;
