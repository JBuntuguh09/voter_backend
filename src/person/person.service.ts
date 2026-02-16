import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto, InsertBulkDTO, UpdatePersonDto } from './dto/create-person.dto';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/auth/entities/user.entity';
  import * as XLSX from 'xlsx';


@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personRepository.create({
        ...createPersonDto,
        organization:{id: createPersonDto.organizationId},
    });
    return this.personRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return this.personRepository.find({
      relations: ['user', 'assembly', 'image', 'region'],
    });
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['user', 'assembly', 'image', 'region'],
    });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    Object.assign(person, updatePersonDto);
    return this.personRepository.save(person);
  }

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    await this.personRepository.remove(person);
  }


  async processExcel(
  file: Express.Multer.File,
  assemblyId: number,
  user: User
) {
  if (!file) {
    throw new BadRequestException('Excel file is required');
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawRows = XLSX.utils.sheet_to_json<any>(sheet, {
    defval: '',
  });

  if (!rawRows.length) {
    throw new BadRequestException('Excel file is empty');
  }


  const rows: InsertBulkDTO[] = rawRows.map((row, index) => ({
    FIRSTNAME: row["FIRSTNAME"],
    RANK: row["RANK"],
    GENDER: row["GENDER"],
        LASTNAME:row["LASTNAME"],
        CONTACT: row["CONTACT"],
        CONTACT_2: row["CONTACT_2"],

    
  }));

  
  // 🔍 Basic validation
  const invalid = rows.find(
    r => !r.FIRSTNAME || !r.LASTNAME,
  );

  // console.log('Invalid Row:', invalid);
  // if (invalid) {
  //   throw new BadRequestException(
  //     `Invalid row detected. Business Name & Type are required.`,
  //   );
  // }

  return this.bulkUpload(rows, assemblyId, user);
}

  async bulkUpload(
  rows: InsertBulkDTO[],
  assemblyId: number,
  user: User
) {
  const currentYear = new Date().getFullYear();
  const prefix = "PH";

  const organization = await this.orgRepo.findOneBy({id:assemblyId})

  if(!organization){
    throw new NotFoundException("This organzation does not exist")
  }

  return this.personRepository.manager.transaction(async (manager) => {
// -------- UNIQUE EXTRACTION --------
    
    // Get last number safely (numeric, not string sort)
    const result = await manager.query(
      `
      SELECT COALESCE(
        MAX(CAST(SPLIT_PART("PersonCode", '-', 3) AS INTEGER)),
        0
      ) as last
      FROM person
      WHERE "PersonCode" LIKE $1
      `,
      [`${prefix}-${currentYear}-%`]
    );

    let lastNumber = parseInt(result[0].last, 10) || 0;

    const permits: Partial<Person>[] = [];

    for (const row of rows) {
      lastNumber++;
      const padded = String(lastNumber).padStart(4, "0");
      const code = `${prefix}-${currentYear}-${padded}`;

      permits.push({
        code,
        firstName: row.FIRSTNAME,
        lastName:row.LASTNAME,
        phoneNumber: row.CONTACT,
        phoneNumber2: row.CONTACT_2,
        gender: row.GENDER,
        title: row.RANK,
        organization: organization,
        status: "Active",
        createdBy: user?.username ?? "Admin",
      });
    }

    return manager
      .createQueryBuilder()
      .insert()
      .into(Person)
      .values(permits)
      .orIgnore()   // 🔥 skips duplicates
      .execute();
  });
}
}
