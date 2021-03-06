require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/mars/:rover&:today', async (req, res) => {
    try {
        let date = new Date(req.params.today)
        let stringDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        console.log(stringDate)
        let mars = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover}/photos?api_key=${process.env.API_KEY}&earth_date=${stringDate}&page=1`)
            .then(res => res.json()).catch(
                err => console.error(err)
            )

        res.send({ mars })
    } catch (err) {
        console.log('error:', err);
    }
})

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
        res.status(200)
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))