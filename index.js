require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

// Hakee kaikki henkilöt tietokannasta
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
      response.status(500).json({ error: 'Internal server error' });
    });
});

// Näyttää puhelinluettelossa olevien henkilöiden määrän ja nykyisen päivämäärän
app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const date = new Date();
      const info = `Phonebook has info for ${persons.length} people`;
      res.send(`<p>${info}</p><p>${date}</p>`);
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Hakee tietyn henkilön ID:n perusteella
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error fetching person:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Poistaa tietyn henkilön ID:n perusteella
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error deleting person:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Lisää uuden henkilön tietokantaan
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => {
      console.error('Error saving person:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
