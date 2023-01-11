const express = require('express')
const app = express()
require('dotenv').config()
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp');

app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(multer().array())

const APP_PORT = process.env.APP_PORT || 1337
const IMAGE_PATH = 'images'

app.get('/', (request, response) => {
    response.send({message : 'Hello World!'})
})

app.get('/image/:dimensions/:name', async (request, response) => {
    //Check if directory exists for required dimension or not
    if (!fs.existsSync(`${__dirname}/${IMAGE_PATH}/${request.params.dimensions}`)) {
        fs.mkdir(
            `${__dirname}/${IMAGE_PATH}/${request.params.dimensions}`, 
            { recursive : false },
            (err) => {}
        )
        await makeImage(request.params.dimensions, request.params.name)
    }
    //Check if image exists 
    else if(!fs.existsSync(`${__dirname}/${IMAGE_PATH}/${request.params.dimensions}/${request.params.name}`)) {
        await makeImage(request.params.dimensions, request.params.name)
    }

    response.sendFile(`${__dirname}/${IMAGE_PATH}/${request.params.dimensions}/${request.params.name}`)
})

async function makeImage(dimensions, imageName) {
    const [width, height] = dimensions.split('x')
    await sharp(`${__dirname}/${IMAGE_PATH}/${imageName}`)
    .resize(parseInt(width), parseInt(height))
    .toFile(`${__dirname}/${IMAGE_PATH}/${dimensions}/${imageName}`)
}

app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`)
})
