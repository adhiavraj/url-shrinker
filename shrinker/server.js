require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

const connectDb =  () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log('DB Connected!!!')
    } catch (error) {
        console.log(`DB Connection Error: ${error}`)
    }
    
}

connectDb()

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {

    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.status(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)

})

app.listen(PORT, () => {
    console.log(`Server is listening at : ${PORT}`)
})
