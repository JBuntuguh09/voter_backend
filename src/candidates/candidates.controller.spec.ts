import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidates.controller';
import { CandidateService } from './candidates.service';

describe('CandidatesController', () => {
  let controller: CandidateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
      providers: [CandidateService],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
