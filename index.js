const express = require('express');
const dateET = require('./src/dateTimeET');
const {vanasona} = require('./src/vanasona.js');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks
const mysql = require('mysql2/promise');
//moodul .env faili lugemiseks, keskkonnamuutujate parsimiseks
require('dotenv').config();
//käivitan express.js funktsiooni ja annan nimeks "app"
const app = express();
const textRef = 'public/txt/vanasonad.txt'
const regTextRef = 'public/txt/regText.txt'

//Määrame veebilehtedele mallide renerdamise mootori
app.set('view engine', 'ejs');

//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));

// loon andmebaasiühenduse

//marsruudid
app.get('/', async (req, res)=>{
    //res.send('Express.js läks käima ja serveerib meile veebi.')
    const dayNow = dateET.fullDay();
    const dateNow = dateET.fullDate();
    const timeNow = dateET.fullTime();
    const tanane_vanasona = await vanasona();
    res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow, tanane_vanasona:tanane_vanasona});
});

app.get('/vanasona', async (req, res)=> {
    try {
        const data = await fs.readFile(textRef, "utf8");
        let folkWisdom = data.split(";");
        res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]})
    }
    catch (err) {
        res.render('vanasona', {wisdom: 'Ei leidnud ühtegi vanasõna!'})
    }
})

app.get('/regvisit', (req, res)=> {
    res.render('regvisit');
})

app.post('/regvisit', async (req, res) =>{
    try {
        const visitDate = dateET.fullDate();
        const visitTime = dateET.fullTime();
        await fs.appendFile(regTextRef, req.body.nameInput + ',' + visitDate + ',' + visitTime + ';');
        res.render('regvisit');
    }
    catch (err) {
        console.log(err);
        res.render('regvisit');
    }
});

app.get('/lastvisit', async (req, res)=> {
    try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';');
        const lastVisit = visits[visits.length - 2];
        const visitParts = lastVisit.split(',');
        const info = 'Viimati registreeris külastuse ' + visitParts[1] + ', kell ' + visitParts[2] + ' Järgmine isik: ' + visitParts[0];
        res.render('lastvisit', {info: info});
    }
    catch (err) {
        res.render('lastvisit', {info: 'Ühtegi külastust pole veel registreeritud!'});
    }
});

app.get('/eestifilm', (req, res)=> {
    res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async (req, res)=> {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        const sqlReq = 'SELECT * FROM person ORDER by last_name';
        const [sqlRes] = await conn.execute(sqlReq);
        res.render('eestifilminimesed', {personList: sqlRes});
    }
    catch (err) {
        console.log('Viga andmebaasist lugemisel: ' + err);
        res.render('eestifilminimesed', {personList: []});
    }
    finally {
        if(conn) {
            await conn.end();
        }
    }
    
});

app.get('/eestifilm/inimesed_add', async (req, res)=> {
    try {
        res.render('eestiinimesed_add')
    }
    catch (err) {
        console.log('Viga andmebaasist lugemisel: ' + err);
    }
})

app.post('/eestifilm/inimesed_add', async (req, res) => {
    console.log(req.body);

    if (
        !req.body.firstNameInput ||
        !req.body.lastNameInput ||
        !req.body.bornInput ||
        req.body.bornInput >= new Date()
    ) {
        console.log('Andmed pole korrektsed');
        return res.render('eestiinimesed_add');
    }
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
        let deceasedDate = null;

        if (req.body.deceasedInput != '') {
            deceasedDate = req.body.deceasedInput;
        }
        await conn.execute(sqlReq, [
            req.body.firstNameInput,
            req.body.lastNameInput,
            req.body.bornInput,
            deceasedDate
        ]);

        res.render('eestiinimesed_add');

    } catch (err) {
        console.log('Viga andmebaasist lugemisel: ' + err);
        res.render('eestiinimesed_add');

    } finally {
        if (conn) {
            await conn.end();
        }
    }
});


app.listen(5114);