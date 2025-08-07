const amqp = require("amqplib");

class RabbitMQ {
  static instance;
  static getInstance() {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }
    return RabbitMQ.instance;
  }
  constructor() {
    this.initialize();
  }

  initialize = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();
    await channel.assertExchange("todo", "direct", { durable: true });
    await channel.assertQueue("todo_queue", { durable: true });
    await channel.bindQueue("todo_queue", "todo", "todo_job");
    console.log("Exchange and queue created");
  };
}

module.exports = RabbitMQ;
