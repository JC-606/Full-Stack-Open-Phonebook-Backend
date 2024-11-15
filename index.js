const express = require('express')
var morgan = require('morgan')

morgan.token('data', (req, res) => JSON.stringify(req.body))

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = 100;
    const id = Math.floor(Math.random() * maxId);
    return String(id)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'missing name' 
        })
    }
    if (!body.number) {
        return response.status(400).json({ 
            error: 'missing number' 
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const note = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(note)

    response.json(note)
})

app.get('/info', (request, response) => {
    const count = persons.length;
    const date = new Date();

    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
})
  
const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})