import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from "@bankuyotickets/common"
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 200,
    userId: "ABD"
  })

  await ticket.save()

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id:  new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "ACB",
    expiresAt: "2022",
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { msg, data, ticket, listener};
}

it('sets the userId of the ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})
