const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require('knex');
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');
const { json } = require('body-parser');
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user:'postgres',
        port: 5432,
        password:'TEST',
        database: 'smart-brain'
    },
});
app.use(bodyparser.json());
app.use(cors());

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => res.json(user))
            .catch(err => res.status(400).json('Unable to get user'))
        }
        else {
            res.status(400).json("Incorrect email or password");
        }
    })
    .catch(err => res.status(400).json("Incorrect email or password"));
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => res.json(user))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    )
    .catch(err => {
        if(err.detail === `Key (email)=(${email}) already exists.`) {
            res.status(400).json("Email already in use");
        }
        else {
            res.json('Unable to register');
        }
    })  
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;//for taking input from the route
    db.select('*').from('users').where({id:id})
    .then(user => {
        if(user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not Found');
        }
    })
    .catch(err => res.status(400).json('error getting user'));
})

app.put('/image', (req, res) => {
    const {id} = req.body;//taking id from the body
    db('users').where({id: id})
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => {
        res.status(400).json('unable to get entries');
    })
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
});