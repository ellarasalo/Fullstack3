const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://adelemal:${password}@cluster0.thmo9j8.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const connectToDatabase = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

const listPhonebook = async () => {
  try {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
  } catch (error) {
    console.error('Error fetching phonebook:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

const addPerson = async (name, number) => {
  const person = new Person({ name, number })

  try {
    await person.save()
    console.log(`added ${name} number ${number} to phonebook`)
  } catch (error) {
    console.error('Error adding person:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

const main = async () => {
  await connectToDatabase()

  if (process.argv.length === 3) {
    await listPhonebook()
  } else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    await addPerson(name, number)
  } else {
    console.log('Invalid number of arguments')
    process.exit(1)
  }
}

main()
