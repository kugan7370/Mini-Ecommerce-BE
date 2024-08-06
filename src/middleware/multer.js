import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (!extName || !mimeType) {
      return cb(
        new Error("Only jpeg, jpg, png, and gif image files are allowed", 400)
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return cb(new Error("Image size should be less than 2MB", 400));
    }

    cb(null, true);
  },
});

export default upload;
