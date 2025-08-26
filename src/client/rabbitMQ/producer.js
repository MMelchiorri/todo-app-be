const rabbitmq = require('../../services/RabbitMQ')
const rabbitmqService = rabbitmq.getInstance()

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500))
  }
}

const publisher = async (message, exchange) => {
  await waitForChannel()

  switch (exchange) {
    case 'todo':
      await rabbitmqService.channel.assertExchange('todo', 'direct', {
        durable: true,
      })
      rabbitmqService.channel.publish(
        'todo',
        'todo_job',
        Buffer.from(JSON.stringify(message)),
      )
      break

    case 'user':
      await rabbitmqService.channel.assertExchange('user', 'direct', {
        durable: true,
      })
      rabbitmqService.channel.publish(
        'user',
        'user_job',
        Buffer.from(JSON.stringify(message)),
      )
      break

    default:
      throw new Error('❌ Invalid exchange name: ' + exchange)
  }
}

module.exports = publisher
