const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken')
const secret = require('../../config').secret
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  password: {type: String, require: [true, "can't be blank"]},
  firstName: String,
  lastName: String,
  instrument: String,
  genre: Array,
  proficiency: String,
  preferences: Array,
  bio: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

UserSchema.methods = {


  validPassword: async (password) => {
    const isPasswordMatch = await bcrypt.compare(password, this.password, function(err, res){
      if (err){
        console.log(err)
      }
    })
    return isPasswordMatch
  },

  generateJWT: () => {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return jwt.sign({
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    }, secret)
  },

  toAuthJSON: function() {
    return {
      email: this.email,
      token: this.generateJWT()
    }
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User