const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const secret = crypto.randomBytes(16);
const salt = bcrypt.genSaltSync(16, secret);


const hashingData = async function hashingAlgorithm({ dataToHash }) {
    if (!dataToHash) {

        throw new Error("Please supply dataToHash");
    }
    try {

        const hash = bcrypt.hashSync(dataToHash, salt);
        return hash;
    } catch (error) {
        throw new Error(error.message);
    }
}


const compareHash = async function compareHash({ dataToCompare, hashedData }) {
    try {
        if (!dataToCompare || !hashedData) {

            throw new Error("Please supply dataToHash");
        }
        const isHashValid = bcrypt.compareSync(dataToCompare, hashedData);
        return isHashValid;

    } catch (error) {

        throw new Error(error.message);
    }
}

module.exports = {
    hashingData,
    compareHash
}