const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const cors = require('cors');
const bodyParser = require('body-parser');

const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/substance/create', (req, res) => {
    const substancesSubstances = req.body;

    const substancesJson = fs.readFileSync(path.join(__dirname, 'substances.json'), 'utf-8');
    const substances = JSON.parse(substancesJson);

    for (const substanceItem of substances) {
        if (substanceItem.substance === substancesSubstances.substance) {
            res.json({ status: 'Такой элемент уже есть в списке' });
            return;
        }
    }

    substances.push(substancesSubstances);

    fs.writeFileSync(path.join(__dirname, 'substances.json'), JSON.stringify(substances), 'utf-8');

    res.json({ status: 'Элемент удачно добавлен' });
})

app.get('/substance/:name', (req, res) => {
    const paramName = req.params.name;
    const temperature = Number(req.query.temperature);

    const substancesJson = fs.readFileSync(path.join(__dirname, 'substances.json'), 'utf-8');
    const substances = JSON.parse(substancesJson);


    for (const substanceItem of substances) {
        if (substanceItem.substance !== paramName) {
            continue;
        }

        if (substanceItem.boilingTemperature <= temperature) {
            res.json({ 'state': 'gas' });
            return;
        }

        if (substanceItem.boilingTemperature >= temperature && substanceItem.freezingTemperature <= temperature) {
            res.json({ 'state': 'water' });
            return;
        }

        if (substanceItem.freezingTemperature >= temperature) {
            res.json({ 'state': 'solid state' });
            return;
        }
    }

    res.json({ status: 'Нет такого вещества' });
})

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
})