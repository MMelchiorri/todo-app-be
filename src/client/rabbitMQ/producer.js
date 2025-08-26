const rabbitmq = require('../../services/RabbitMQ')
const rabbitmqService = rabbitmq.getInstance()

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500))
  }
}

const publisher = async (message, exchange) => {
  await waitForChannel()

  rabbitmqService.channel.publish(
    exchange,
    'todo_job',
    Buffer.from(JSON.stringify(message)),
  )

  console.log("📤 Message published to 'todo':", message)
}

module.exports = publisher
