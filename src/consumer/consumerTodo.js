const rabbitmq = require("../services/RabbitMQ");
const rabbitmqService = rabbitmq.getInstance();

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500));
  }
};

const startTodoConsumer = async (model) => {
  await waitForChannel();

  rabbitmqService.channel.consume(
    model.modelName,
    async (msg) => {
      console.log(model.modelName, msg);
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("📥 Message consumed from 'todo_queue':", content);

          // TODO: logica di business
          // await processTodo(content);

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
