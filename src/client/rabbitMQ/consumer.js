const rabbitmq = require('../../services/RabbitMQ')
const rabbitmqService = rabbitmq.getInstance()
const database = require('../../services/Database').getInstance()
const usersModel = require('../../schemas/Users')
const todoModel = require('../../schemas/Todos')

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500))
  }
}

const consumer = async (model) => {
  await waitForChannel()
  await rabbitmqService.channel.assertQueue(model.modelName, { durable: true })
  rabbitmqService.channel.consume(
    model.modelName,
    async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString())
          console.log('consumer - Received message:', content)
          switch (model.modelName.trim()) {
            case 'TodoModel':
              await database.addTodoToUser(
                usersModel,
                content._doc.assignedTo,
                content._doc._id,
              )
              break

            case 'UserModel':
              if (content.action === 'DELETE') {
                await database.deleteUserFromTodo(todoModel, content._doc)
              } else {
                await database.updateUserFromTodo(todoModel, content._doc)
              }
              break

            default:
              console.warn('⚠️ Queue sconosciuta:', model.modelName)
          }

          rabbitmqService.channel.ack(msg)
        } catch (err) {
          console.error('❌ Error processing message:', err.message)
          rabbitmqService.channel.nack(msg, false, false)
        }
      }
    },
    { noAck: false },
  )
}

module.exports = consumer
