#!/usr/bin/env node

const express = require('express');
const twig = require('twig');
const app = express();
const yaml = require('js-yaml');
const fs   = require('fs');
const pageres = require('pageres');
const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");

const httpPort = 3000

const boxenSuccess = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};

const boxenError = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "red",
    backgroundColor: "#000000"
};

const options = yargs
    .usage("Usage: -n <name>")
    .option("s", { alias: "server", describe: "Run server mode", type: "boolean", demandOption: false })
    .argv;


app.set('views', 'templates');
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));
app.use('/js', express.static('public/js'));

console.log(boxen( `POC tools`, boxenSuccess));

/**
 * Load Frequencies from file
 *
 * @param filename
 * @return radioPresets
 */
function loadFrequencies(filename)
{
    try {
        const doc = yaml.load(fs.readFileSync(filename, 'utf8'));
        if(doc.radioPresets === undefined) {
            throw `radioPresets undefined in file ${filename}`;
        }
        return doc.radioPresets;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Handle routes
 */

app.get('/', (req, res) => {
    res.render('index.html.twig')
})

app.get('/kneeboard', (req, res) => {
    res.render('kneeboard.html.twig')
})

app.get('/kneeboard/:page', (req, res) => {

    let frequencies=loadFrequencies('config/radioSettings.yml');

    res.render(`kneeboard/${req.params.page}.html.twig`, {frequencies: frequencies})
    console.log(`render page ${req.params.page}`);
})

app.get('/kneeboard/:page/save', (req, res) => {

    (async () => {
        await new pageres({delay: 2, filename: req.params.page})
            .src(`http://localhost:${httpPort}/kneeboard/${req.params.page}`, ['600x900'])
            .dest('./var')
            .run();

        console.log('Finished generating screenshots!');
    })();

    res.send(`done, <a href="/kneeboard">return to kneeboard</a>`);
    console.log(`render page ${req.params.page}`);
})

if(options.server) {

    app.listen(httpPort, () => {
        console.log(`running http server on port ${httpPort}`)
    })

}
else {
    console.log(boxen( `Only --server option is supported`, boxenError));
}
