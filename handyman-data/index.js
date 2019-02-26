const mongoose = require('mongoose')

const { Job, User, Comment } = require('./schemas')


module.exports = {
    mongoose,
    models:{

        Job: mongoose.model('Job', Job),
        User: mongoose.model('User', User),
        Comment: mongoose.model('Comment', Comment)

    }
}


// module.exports = {
//     Job: mongoose.model('Job', Job),
//     User: mongoose.model('User', User),
//     Comment: mongoose.model('Comment', Comment)
// }