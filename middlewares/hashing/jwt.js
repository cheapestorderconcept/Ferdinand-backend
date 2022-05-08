

const jwt = require("jsonwebtoken");

const { HttpError } = require("../errors/http-error");
const joiError = require("../errors/joi-error");







const signToken=({payload})=>{
   try {
       const token = jwt.sign(payload,process.env.JWT_SECRET)
       return token
   } catch (error) {
    throw new Error(error);  
   }
}



const verifyToken=(req,res,next)=>{
   try {
       if (!req.header('Authorization')) {
        const e = new HttpError(401,"Please provide authorization header" );
        return next(e); 
       }
    const token = req.header("Authorization").split(' ')[1];
    if(!token||token.length==4){
      const e = new HttpError(401,"Please login to continue");
      return next(e);
    }else{
  const decoded =   jwt.verify(token, process.env.JWT_SECRET);
  req.userData = decoded;
    next();
    }
  
   } catch (error) {
      return next(new HttpError(400, "Please login to continue"))
   }
}


module.exports={
    signToken,
    verifyToken
}