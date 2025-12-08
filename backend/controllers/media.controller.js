import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

export const uploadFile = async (req, res) => {
  try {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        data: {
          url: fileUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    upload.array('files', 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const files = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }));

      res.json({
        success: true,
        data: { files }
      });
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
};

export const getFile = async (req, res) => {
  try {
    const filename = req.params.id;
    const filePath = path.join('uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file'
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const filename = req.params.id;
    const filePath = path.join('uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
};

