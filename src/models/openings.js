const mongoose = require('mongoose');
const {Schema} = mongoose;

const openingsSchema = new Schema ({
    project: String,
    title: String,
    client: String,
    technologies: String,
    desc: String,
    status: Boolean,
    addedby: String,
    applicants: String
});

module.exports = mongoose.model('openings', openingsSchema);