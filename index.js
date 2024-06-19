const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  { id: 1, name: 'Artoooo Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date();  
    const info = `Phonebook has info for ${persons.length} people`;
    res.send(`<p>${info}</p><p>${date}</p>`);
  });

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id); 
    const person = persons.find(p => p.id === id);
  
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id); 
    const initialLength = persons.length;
    persons = persons.filter(person => person.id !== id); 
  
    if (persons.length < initialLength) {
      res.status(204).end(); 
    } else {
      res.status(404).end(); 
    }
  });
  
  app.post('/api/persons', (req, res) => {
    const body = req.body;
  
 
    if (!body.name || !body.number) {
      return res.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.find(p => p.name === body.name)) {
      return res.status(400).json({ error: 'name must be unique' });
    }
  
    const id = Math.floor(Math.random() * 1000000);
  
    const person = {
      id: id,
      name: body.name,
      number: body.number
    };
  
    persons.push(person);
  
    res.json(person);
  });
  
  
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
