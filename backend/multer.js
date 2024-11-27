const multer=require("multer");
const path=require("path");

//storage configuration
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads");//destination folder for storing uploaded file
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));

    },
});
//file filter to accept only images
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
        }
        else{
            cb(new Error("Only images are allowed"),false);
        }


    };
    //initialize multer instancce
    const upload=multer({storage,fileFilter});
    module.exports=upload;


