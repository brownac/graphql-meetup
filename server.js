import express from 'express'
import schema from './schema'
import graphqlHTTP from 'express-graphql'
const port = 4000

const app = express()

// let's configure our graphql endpoint here

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
