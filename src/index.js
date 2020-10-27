#!/usr/bin/env node
const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')

async function asyncMain() {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    let collection

    try {
        const client = await MongoClient.connect(process.env.MONGO_URL)
        const db = client.db('dev-ops-workshop')
        try {
            collection = await db.createCollection('test')
        } catch(error) {
            collection = await db.collection('test')
        }
    } catch(error) {
        console.log(error)
        console.warn('Database not ready')
    }

    app.get('/show', async (req, res) => {
        const results = await collection.find({}).toArray()
        return res.json(results)
    })

    app.get('/add', async (req, res) => {
        const result = await collection.insertOne({
            name: req.query.name,
            message: req.query.message
        })
        return res.json(result)
    })

    app.all('/*', (req, res) => {
        return res.json({message: 'Hello World'})
    })

    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000
    const address = process.env.ADDRESS || 'localhost'

    app.listen(port, address)
}

asyncMain().catch(err => {
    console.warn('Error during startup', err)
    setTimeout(() => {
        process.exit(0)
    }, 5000)
})
