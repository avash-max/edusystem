const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : (req, file, callback) =>{
        const uploadPath = path.join(__dirname, '..', 'uploads');
        callback(null, uploadPath)
    }, 
    filename : (req, file, callback)=>{
        const uniqueSuffix = Date.now()+ '-' + Math.round(Math.random()*1E9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, callback) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)){
        return callback(new Error("Only image files are allowed"), false);
    }
    callback(null, true);
};

const uploadImage = (req, res, next) =>{
    const upload = multer ({
        storage, 
        fileFilter,
        limits : { fileSize : 5 * 1024 * 1024}
    }).fields([
        { name: "thumbnail", maxCount: 1 },   // single image
        { name: "images", maxCount: 10 },      // multiple images
    ]);

    upload(req, res, (err) =>{
        if(err){
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};


module.exports = uploadImage;

