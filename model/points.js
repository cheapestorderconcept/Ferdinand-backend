const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    points:{type:Number, default:0},
    task:{type:String, required:true},
    user: {type:String},
});



pointSchema.statics.createTask = async function createTask(params) {
    const task =new pointSystem(params);
    const savedTask = task.save();
    return savedTask;
}

pointSchema.statics.getTasks = async function getTasks(){
    const task = await pointSystem.find({});
    return task;
}



pointSchema.statics.taskDetails = async function taskDetails(taskId){
    const task = await pointSystem.findOne({_id:taskId});
    return task;
}
pointSchema.statics.rejectTask = async function rejectTask(taskId){
    const task = await pointSystem.findOneAndDelete({_id:taskId});
    return task;
}

const pointSystem = mongoose.model('point-system', pointSchema);

module.exports={
    pointSystem
}