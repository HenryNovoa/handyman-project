const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')


const Comment = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
   
    text: {
        type: String,
        required: true
    },
    
    created: {
        type: Date
    }
  
})


const Job = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },
    
    pictures: {
        type: [String],
        ref:'User'
    },

    photo:{
        type:String
    },
  
    budget: {
        type: String,
        required: true
    },
   
    contact: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },
  
    status: {
        type: String,
        default: 'TODO',
        enum: ['TODO','DOING',  'DONE'],
        required: true
    },
    
    rating: {
        type: Number,
        enum:[1,2,3,4,5]
    },

    ratingText:{
        type:String
    },

    requestedBy: [{
        type: ObjectId,
        ref: 'User',
    }],
   
    assignedTo: {
        type: ObjectId,
        ref: 'User'
  
    },
    location:{
        type: String,
        enum: ['barcelona','madrid','bilbao','sevilla','valencia']
    },

    comments: [Comment],

    tags:[{
        type: String
    }],

    created: {
        type:Number,
        default: Date.now()
    }


    
})





const User = new Schema({
    name: {
        type: String,
        required: true
    },
   
    surname: {
        type: String,
        required: true
    },
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    }
  
})

module.exports = {
    Job,
    User,
    Comment
}

