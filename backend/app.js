const express = require("express");
const app = express();
const axios = require('axios');
const cors = require('cors');
app.use(cors()); 


const url = 'http://numbersapi.com/';

// process JSON body -> req.body
app.use(express.json());

//process traditional form data => req.body
app.use(express.urlencoded({ extended: true }));

app.get('/numbers', async function(req, res){
	let {number, type} = req.query;

	console.log({number}, {type})

	if (!number) number = 'random';
	if (!type) type = '';

	const result = await axios({
		url: `${url}${number}/${type}`
	})

	res.json(result.data)
})

module.exports = app;