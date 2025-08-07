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
  };
}

module.exports = RabbitMQ;
