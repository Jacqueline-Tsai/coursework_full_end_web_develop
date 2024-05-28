require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
const Phonebook = require('./models/phonebook');

app.use(express.static('dist'));

// Configure Morgan to log HTTP requests
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

app.use(cors());
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};
app.use(requestLogger);

app.get('/', (req, res) => {
  response.send('<h1>Hello World!</h1>');
});

// app.get('/info', (req, res) => {
//   const numPersons = persons.length;
//   const requestTime = new Date();

//   res.send(
//     `<p>Phonebook has info for ${numPersons} people</p>
//      <p>${requestTime}</p>`
//   );
// });

app.get('/api/persons', (req, res, next) => {
  Phonebook.find({})
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  Phonebook.findById(id)
    .then(phonebook => {
      if (phonebook) {
        res.json(phonebook)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  Phonebook.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or phone missing' 
    });
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return res.status(400).json({ 
  //     error: 'name must be unique' 
  //   });
  // }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number
  });

  phonebook.save().then(savedPhonebook => {
    res.json(savedPhonebook)
  })
  .catch(error => next(error))
});

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});