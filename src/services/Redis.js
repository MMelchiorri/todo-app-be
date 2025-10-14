const createClient = require('redis').createClient
require('dotenv').config()

class Redis {
  static instance
  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new Redis()
    }
    return Redis.instance
  }
  constructor() {
    this.connect()
  }

  connect() {
    this.client = createClient({
      url: process.env.REDIS_URI,
    })

    this.client.on('error', (err) => console.log('Redis Client Error', err))

    this.client.connect().then(async () => {
      console.log('Redis connection successful')
    })
  }
}

module.exports = Redis
