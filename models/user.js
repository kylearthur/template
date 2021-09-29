const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
   
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must be 7 or more "password"')
            }
        }
    },
    mobile_number: {
        type : Number,
        required: true,
        unique: true,
        minlength: 10
    },
    complete_address: {
        type: String,
        
    },
    
    bank_acc: {
        type: String,
       
    },
    fb: {
        type: String,
       
    },

    user_name: {
        type : String,
        required: true,
        unique: true,
        minlength: 2
    },
    
    dial_code: {
        type : String,
        required: true
    },
    country: {
        type : String,
        required: true
    },

    age:{
        type : Number,
        required: true,
        validate(value){
            if(value < 21) {
                throw new Error('You need to be 21 and above to play this game')
            }
        }
    },
    u_date_registered:{
        type: Number
       // default: new Date()
    },
    u_date_registered_string:{
        type: String
       // default: new Date()
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type : Buffer
    },
    u_date_login:{
        type: Number
       // default: new Date()
    }
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.profile

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (user_name, password) => {
    const user = await User.findOne({ user_name })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User