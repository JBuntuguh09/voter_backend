import { Test, TestingModule } from '@nestjs/testing';
import { VotedService } from './voted.service';

describe('VotedService', () => {
  let service: VotedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotedService],
    }).compile();

    service = module.get<VotedService>(VotedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
