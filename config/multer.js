// const multer = require('multer');
// const path = require('path');

// // Configuración de Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../www/uploads/'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + file.originalname;
//     cb(null, uniqueSuffix);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
