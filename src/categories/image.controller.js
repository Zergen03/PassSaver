const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, '../../www/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `upload-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes o archivos PDF'));
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'name', maxCount: 1 }
]);

async function uploadFile(req, res) {
    console.log("solicitud recibida: ", req.body);
    console.log("archivo recibido: ", req.files);


    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || !req.files['image']) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        const uploadedFile = req.files['image'][0];
        const newFileName = req.body.name ? req.body.name.replace(/\s+/g, '_') + path.extname(uploadedFile.originalname) : uploadedFile.filename;
        const newPath = path.join(uploadedFile.destination, newFileName);

        fs.rename(uploadedFile.path, newPath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al renombrar el archivo' });
            }

            res.status(200).json({
                message: 'Archivo subido con éxito',
                file: newFileName
            });
        });
    });
}

async function getFileByName(req, res) {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../../www/uploads/', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        res.status(200).json(filePath);
    });
}

function init(app) {
    app.post('/upload', uploadFile);
    app.get('/uploads/:fileName', getFileByName);
}

module.exports = {
    init
};
