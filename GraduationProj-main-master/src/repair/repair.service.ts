import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'entities/Product';
import { Repair, RepairStatus } from 'entities/Repair';
import { Roles, User } from 'entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(Repair) private readonly Repair: Repository<Repair>,
    @InjectRepository(Product) private readonly Product: Repository<Product>,
    @InjectRepository(User) private readonly User: Repository<User>,
  ) {}

  async getAllRepairs(userId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (user.role === 'user') {
      const repairs = await this.Repair.find({
        relations: {
          user: true,
        },
      });

      return {
        status: 'success',
        message: 'all repair requests has been returned successfully',
        repairs,
      };
    }

    if (user.role === 'workshop') {
      const repairs = await this.Repair.find({
        relations: {
          workshop: true,
        },
      });

      return {
        status: 'success',
        message: 'all repair requests has been returned successfully',
        repairs,
      };
    }

    throw new HttpException(
      'there is no repair requests',
      HttpStatus.BAD_REQUEST,
    );
  }

  async makeRepairReq(products: string[], userId: string, workshopId: string) {
    if (!products || products.length < 1) {
      throw new HttpException(
        'please select your products first',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productsArray: Product[] = [];
    products.forEach(async (productId) => {
      const product = await this.Product.findOne({ where: { id: productId } });

      if (!product) {
        throw new HttpException(
          'the products is not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      productsArray.push(product);
    });

    const user = await this.User.findOne({
      where: {
        id: userId,
      },
    });

    const workshop = await this.User.findOne({
      where: {
        id: workshopId,
      },
    });

    if (!user || !workshop) {
      throw new HttpException(
        'the account is not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const repair = new Repair();
    repair.products = productsArray;
    repair.user = user;
    repair.workshop = workshop;
    await this.Repair.save(repair);

    return {
      status: 'success',
      message: 'repair request has been created successfully',
      data: repair,
    };
  }

  async updateRepairReq(userId:string, repairId: string, status: RepairStatus) {

    const user = await this.User.findOne({ where: { id: userId } });

    if (user.role !== 'workshop') {
      throw new HttpException(
        "you can't update that request",
        HttpStatus.BAD_REQUEST,
      );
    }

    const repair = await this.Repair.findOne({ where: { repairId } });

    if (!repair) {
      throw new HttpException(
        "the repair request is't found",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      ![
        RepairStatus.Accepted,
        RepairStatus.Rejected,
        RepairStatus.Fullfilled,
      ].includes(status)
    ) {
      throw new HttpException(
        'invalid repair status update',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.Repair.update(
      { repairId },
      {
        status,
        updatedAt: new Date().toLocaleString(),
      },
    );

    return {
      status: 'success',
      message: 'your repair request has been updated successfully',
    };
  }

  // Delete Repair Req in < Pending > case.
  async deleteRepair(userId: string, repairId: string) {

    const user = await this.User.findOne({ where: { id: userId } });

    if (![Roles.User, Roles.Admin].includes(user.role)) {
      throw new HttpException(
        "you can't cancelled that repair request",
        HttpStatus.BAD_REQUEST,
      );
    }

    const repair = await this.Repair.findOne({ where: { repairId } });

    if (!repair) {
      throw new HttpException(
        "the repair request is't found !",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (repair.status !== 'pending') {
      throw new HttpException(
        "you can't cancel this repair request",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.Repair.delete({ repairId, status: RepairStatus.Pending });

    return {
      status: 'success',
      message: 'repair request has been deleted successfully',
      deletedRepair: repair,
    };
  }
}
