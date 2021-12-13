import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/hooks/database/base.service';
import { Employee, EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeeService extends BaseService<EmployeeDocument> {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>
  ) {
    super(employeeModel);
  }
}
