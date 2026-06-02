const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  const isExtNameValid = allowedTypes.test(
    file.originalname.toLowerCase()
  );

  if (isMimeTypeValid && isExtNameValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Supported formats: jpeg, jpg, png, gif, webp, pdf"
      )
    );
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eduanchor_uploads",
    allowed_formats: ["jpeg", "jpg", "png", "gif", "webp", "pdf"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("image");

const uploadPdf = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("file");

const seventhUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).fields([
  { name: "tenthMarksheet", maxCount: 1 },
  { name: "tenthCertificate", maxCount: 1 },
  { name: "twelveMarksheet", maxCount: 1 },
  { name: "twelveCertificate", maxCount: 1 },
  { name: "passport", maxCount: 1 },
  { name: "essay", maxCount: 1 },
  { name: "instructionLetter", maxCount: 1 },
  { name: "bachelorCertificate", maxCount: 1 },
  { name: "bachelorTranscript", maxCount: 1 },
]);

const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("files", 10);

module.exports = {
  uploadSingle,
  uploadMultiple,
  seventhUpload,
  uploadPdf,
};
