const express = require('express');
const dateET = require('./src/dateTimeET');
const {vanasona} = require('./src/vanasona.js');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
//käivitan express.js funktsiooni ja annan nimeks "app"
const app = express();
const textRef = 'public/txt/vanasonad.txt'
const regTextRef = 'public/txt/regText.txt'

//Määrame veebilehtedele mallide renerdamise mootori
app.set('view engine', 'ejs');

//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));

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

app.get('/regvisit', (reg, res)=> {
    res.render('regvisit');
})

app.post('/regvisit', async (reg, res) =>{
    try {
        await fs.open(regTextRef, 'a');
        await fs.appendFile(regTextRef, reg.body.nameInput + ';')
        res.render('regvisit');
    }
    catch (err) {
        console.log(err);
        res.render('regvisit');
    }
});

app.listen(5114);