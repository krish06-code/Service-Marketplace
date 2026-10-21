const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadsBaseDir = path.join(__dirname, '..', 'uploads');
const avatarsDir = path.join(uploadsBaseDir, 'avatars');
const providersDir = path.join(uploadsBaseDir, 'providers');

const createDir = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
};
createDir(avatarsDir);
createDir(providersDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'avatar') {
      cb(null, avatarsDir);
    } else if (file.fieldname === 'image') {
      cb(null, providersDir);
    } else {
      cb(null, uploadsBaseDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadAvatar = upload.single('avatar');
const uploadProvider = upload.single('image');

module.exports = {
  uploadAvatar,
  uploadProvider
};
