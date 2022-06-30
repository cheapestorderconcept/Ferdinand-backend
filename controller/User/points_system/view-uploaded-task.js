const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { pointSystem } = require("../../../model/points")


const german = process.env.SUPPORTED_LANGUAGE;

const viewAllTasks = async function viewAllTasks(req,res,next){
    const {language} = req.userData;
    try {
      const task = await  pointSystem.getTasks();
 
      if (task&&task.length>0) {
          httpResponse({status_code:200, response_message:'Tasks availbale', data:{task}, res});
      }else{
        return next(new HttpError(400, language==german?'Keine ausstehende Aufgabe wartet auf Genehmigung':'No pending task await approval'))
      }
    } catch (error) {
        return next(new HttpError(400,  language==german?'Ein Fehler im System':"System error"));
    }
}

module.exports={
    viewAllTasks
}