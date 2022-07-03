
const mongoose = require('mongoose');
const schema = mongoose.Schema
var randomstring = require("randomstring");
const userSchema = new schema({
    first_name: {type:String, required:true},
    last_name: {type:String, required:true},
    phone_number: {type:String}, 
    image: {type:String},
    made_first_purchase:{type: Boolean, default:false},
    referral_id: {type: String, default: randomstring.generate(7)},
    referred_by:{type:String},
    points: {type:Number, default:0},
    accumulated_points: {type:Number, default: 0},
    email: {type:String, required:true, unique:true},
    role: {type:String, default:'client'},
    password: {type:String, required:true}
},{
    timestamps: true,
});



userSchema.statics.createNewUser = async function createNewUser(details, data) {
    const {first_name, last_name, email, phone_number,referred_by} = details;
    const user = new User({
        first_name,
        last_name,
        phone_number,
        email,
        password: data.password
    });
    const u  = user.save();
    return u;
}

userSchema.statics.updateUser = async function updateUser(id, data) {
    const updatedUser = await User.findOneAndUpdate({_id:id},data);
    return updatedUser;
}

userSchema.statics.findUserByEmail = async function findUserByEmail(email) {
    const user = await User.findOne({email});
    return user;
}

userSchema.statics.updateUserByEmail = async function updateUserByEmail(email, data){
    const user = await User.findOneAndUpdate({email}, data);
    return user;
}

userSchema.statics.deleteUser = async function deleteUser(id) {
    const user = await User.findOneAndDelete({_id:id});
    return user;
}


userSchema.statics.findUserById = async function findUserById(id) {
    const user = await User.findOne({_id:id});
    return user;
}

const User = mongoose.model('User', userSchema);

module.exports={
    User
}