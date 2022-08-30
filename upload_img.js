const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({   
    destination: (req, file, callBack) => {
      callBack(null, 'assets/uploads')
    },
    filename: (req, file, callBack) => {
      // callBack(null , file.originalname) 
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const imagesUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 3000000 // 3000000 Bytes = 3 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
    }
  // }).single('image'); // upload 1 fichier
  }).array('image'); // upload plusieurs fichiers

module.exports = imagesUpload;