import { Test, TestingModule } from '@nestjs/testing';
import { ChatGatwayGateway } from './chat-gateway.gateway';

describe('ChatGatwayGateway', () => {
  let gateway: ChatGatwayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGatwayGateway],
    }).compile();

    gateway = module.get<ChatGatwayGateway>(ChatGatwayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
