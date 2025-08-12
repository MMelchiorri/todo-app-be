const rabbitmq = require("../services/RabbitMQ");
const rabbitmqService = rabbitmq.getInstance();
const database = require("../services/Database").getInstance();
const usersModel = require("../schemas/Users");

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500));
  }
};

const startTodoConsumer = async (model) => {
  await waitForChannel();
  await rabbitmqService.channel.assertQueue(model.modelName, { durable: true });
  rabbitmqService.channel.consume(
    model.modelName,
    async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("📥 Message consumed from 'todo_queue':", content);
          await database.updateById(usersModel, content);

          rabbitmqService.channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing message:", err.message);
          rabbitmqService.channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false },
  );

  console.log("👂 Consumer started on 'todo_queue'");
};

module.exports = startTodoConsumer;
