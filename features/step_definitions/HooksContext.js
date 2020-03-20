const {
  Before,
  After,
  BeforeAll,
  AfterAll
} = require('cucumber')
const mongoose = require('mongoose')
const app = require('../../app')
const Band = require('../../lib/models/Band');
const User = require('../../lib/models/User')
const MembershipRequest = require('../../lib/models/MembershipRequest')

// BeforeAll( async function() {
// })

Before(async function () {
  await User.collection.remove()
  await Band.collection.remove()
  await MembershipRequest.collection.remove()
  this.app = app
})

// After(function() {
// })

AfterAll(function() {
  mongoose.connection.close()
})