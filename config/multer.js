const multer = require("multer");

// Use memory storage so files aren't written to disk (required for cloud hosting like Render)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
