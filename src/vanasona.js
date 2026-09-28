const textRef = './public/txt/vanasonad.txt';
const fs = require('fs').promises;
const path = require('path');


async function readTextFile() {
    try {
        const data = await fs.readFile(textRef, 'utf8');
        const folkWisdom = data.split(';');
        return folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))].trim();
    } catch (err) {
        console.log('Viga: ' + err);
        return 'Kahjuks teksti ei leitud';
    }
}

readTextFile(textRef);

module.exports = {vanasona: readTextFile}