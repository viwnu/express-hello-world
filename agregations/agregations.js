const express = require('express')

const {readBundle, writeBundle, deleteBundle} = require('../db/db.js')

const router = express.Router()


router.get('/', function (req, res) { res.send('hellow dura4ok') })

router.post('/send', function(req ,res){
    // console.log(`Заголовки запроса: ${Object.keys(req)}`);
    const data = req.body
    console.log(`Incoming to server Data = ${data}`);
    for (const key in data) {
        console.log('in data obj')
        
        console.log(data[key])
    }
    writeBundle('', JSON.stringify(data))
      .then((sendData) => {
        console.log('the response from fileIO: ', sendData)
        res.send({sendData})
    })
})  

router.get("/get", (req, res) => {
  console.log('in get: ', readBundle)
    readBundle('', 10)
      .then((data) => {
          console.log('the response from fileIO: ', data)
          const sendData = data.map(item => {
            return JSON.parse(item.dataStr)
          })
          res.send(sendData)
      })
  })

  router.get("/get/:agregationId", (req, res) => {
    readBundle('', 10)
    .then((data) => {
        console.log('the response from fileIO: ', data)
        const agregations = data.map(item => {
            return JSON.parse(item.dataStr)
        })
        const singleAgregation = agregations.find(agregation => (
            agregation.id === req.params.agregationId
        ))
        singleAgregation
            ?res.send(singleAgregation)
            :res.status(404).send('Not found')
    })
  })

  router.patch('/patch/:agregationId', async (req, res) => {
    console.log(req.params.agregationId)
    try {
      const deletedData = await deleteBundle('', req.params.agregationId)
      if (!deletedData) { return res.status(404).send('Not found') }

      const data = req.body
      const sendData = await writeBundle('', JSON.stringify(data))
      console.log('the response from fileIO: ', sendData)
      res.send({sendData})

    } catch (error) {
      res.status(500).send('Something goes wrong...')
    }

  })
  
  router.delete('/delete/:agregationId', async (req, res) => {
    console.log(req.params.agregationId)
    try {
      const deletedData = await deleteBundle('', req.params.agregationId)
      deletedData
        ? res.send({deletedData})
        : res.status(404).send('Not found')

    } catch (error) {
      res.status(500).send('Something goes wrong...')
    }
  })
  
  module.exports = router