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
    this.connection = null;
    this.channel = null;
    this.initialize();
  }

  initialize = async () => {
    const uri =
      process.env.RABBITMQ_URI || "amqp://admin:password@rabbitmq:5672/";

    while (true) {
      try {
        this.connection = await amqp.connect(uri);
        console.log("Connected to RabbitMQ");

        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange("todo", "direct", { durable: true });
        await this.channel.assertQueue("TodoModel", { durable: true });
        await this.channel.assertQueue("UserModel", { durable: true });
        await this.channel.bindQueue("TodoModel", "todo", "todo_job");
        await this.channel.bindQueue("UserModel", "todo", "todo_job");

        console.log("Exchange and queue created");
        break;
      } catch (err) {
        console.error(
          "RabbitMQ connection failed, retrying in 3 seconds...",
          err.message,
        );
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  };
}

module.exports = RabbitMQ;
