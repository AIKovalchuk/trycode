import express from 'express'

const app = express()
const PORT = 8080

app.listen(PORT, () => `Server has been started on port ${PORT}`)
