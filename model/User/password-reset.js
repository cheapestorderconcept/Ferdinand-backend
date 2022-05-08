const mongoose = require('mongoose');

const schema = mongoose.Schema;

const resetSchema = new schema({
    code: {type:String, required:true},
    email: {type:String, required:true},
    createdAt:{type:Date}
})

resetSchema.statics.savePassCode = async function savePassCode(code) {
    const s = new passReset(code);
    const e = s.save();
    return e;

}

resetSchema.statics.getCode = async function getCode(code) {
    const c = await passReset.findOne({code});
    return c;
}

const passReset = mongoose.model('PassReset', resetSchema);

module.exports={
    passReset
}