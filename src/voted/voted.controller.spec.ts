import { Test, TestingModule } from '@nestjs/testing';
import { VotedController } from './voted.controller';
import { VotedService } from './voted.service';

describe('VotedController', () => {
  let controller: VotedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotedController],
      providers: [VotedService],
    }).compile();

    controller = module.get<VotedController>(VotedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
