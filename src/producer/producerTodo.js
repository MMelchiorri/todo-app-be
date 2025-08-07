const rabbitmq = require("../services/RabbitMQ");
const rabbitmqService = rabbitmq.getInstance();

const waitForChannel = async () => {
  while (!rabbitmqService.channel) {
    await new Promise((res) => setTimeout(res, 500));
  }
};

const publishTodo = async (model, message) => {
  await waitForChannel();

  rabbitmqService.channel.publish(
    model.modelName,
    "todo_job",
    Buffer.from(JSON.stringify(message)),
  );
  console.log(message);

  console.log("📤 Message published to 'todo':", message);
};

module.exports = publishTodo;
