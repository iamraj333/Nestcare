const multer=require('multer')

const multerStorage=multer.memoryStorage();

const upload=multer({
    storage:multerStorage,
    limits:{
        fileSize:5*1024*1024 //max limit is 5MB
    },
    fileFilter:(req,file,callBackFunction)=>{
        if(file.mimetype.startsWith('image/')){
            callBackFunction(null,true)
        }
        else{
            callBackFunction(new Error("Only image file is allowed"),false)
        }
    }
})

module.exports=upload