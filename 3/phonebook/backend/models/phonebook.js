const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// const url = process.env.MONGODB_URI
const url = `mongodb+srv://Jacqueline:jaychou0118@phonebook.usxcmwv.mongodb.net/main?retryWrites=true&w=majority&appName=phonebook`;

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: String,
  number: String,
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)