import {Agent, InitConfig, ConsoleLogger, LogLevel, HttpOutboundTransport, BasicMessageEventTypes, BasicMessageStateChangedEvent} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'


const createAgent = async (name: string, port: number): Promise<Agent> => {

  const config: InitConfig = {
    label: name,
    logger: new ConsoleLogger(LogLevel.error),
    walletConfig: {
      id: name,
      key: name
    },
    endpoints: [`http://localhost:${port}`],
    autoAcceptConnections: true
  }

  const agent = new Agent(config, agentDependencies)
  agent.registerInboundTransport(new HttpInboundTransport({port: port}))
  agent.registerOutboundTransport(new HttpOutboundTransport())

  agent.events.on(BasicMessageEventTypes.BasicMessageStateChanged, (event: BasicMessageStateChangedEvent) => {
    if (event.payload.basicMessageRecord.role === 'receiver') {
      console.log(`${name} received a message: ${event.payload.message.content}`)
    }
  })


  await agent.initialize()

  return agent
}


const run = async () => {
  const alice = await createAgent('alice', 9000)
  const bob = await createAgent('bob', 9001)

  const {invitation, connectionRecord} = await alice.connections.createConnection()


  await bob.connections.receiveInvitation(invitation)

  await alice.basicMessages.sendMessage(connectionRecord.id, 'Hi Bob!')

}

run()