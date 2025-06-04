import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from 'entities/Product';
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

  // get repair requests based on user role
  async getAllRepairs(userId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    const getRepairs = async () => {
      const repairs = await this.Repair.find({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
          workshop: true,
          products: true,
        },
      });

      if (repairs.length < 1) {
        throw new HttpException(
          'you don\'t have any repair rquests yet',
          HttpStatus.BAD_REQUEST
        )
      }

      return {
        status: 'success',
        message: 'all repair requests has been returned successfully',
        repairs,
      };
    }

    if (['user', 'workshop'].includes(user.role)) {
      return getRepairs();
    }

    throw new HttpException(
      'there isn\'t repair repair requests',
      HttpStatus.BAD_REQUEST,
    );
  }

  // create repair request based on user and workshop on products
  async makeRepairReq(
    products: string[],
    cost: string,
    userId: string,
    workshopId: string,
  ) {
    if (!products || products.length < 1) {
      throw new HttpException(
        'please select your all products first',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!cost) {
      throw new HttpException(
        "the repair cost isn't define",
        HttpStatus.BAD_REQUEST,
      );
    }

    const productsArray: Product[] = [];
    for (const productId of products) {
      const product = await this.Product.findOne({ where: { id: productId } });

      if (!product) {
        throw new HttpException(
          "one/all of these products aren't exist",
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      if (
        product.status === ProductStatus.ON_HOLD ||
        product.status !== ProductStatus.AVAILABLE
      ) {
        throw new HttpException(
          `the ${product.name} product is ${product.status} so, you can\'t handle it`,
          HttpStatus.NOT_IMPLEMENTED,
        );
      }

      product.status = ProductStatus.ON_HOLD;
      await this.Product.save(product);

      productsArray.push(product);
    }

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
        'failed to make a repair request!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const repair = new Repair();
    repair.user = user;
    repair.workshop = workshop;
    repair.products = productsArray;
    repair.cost = cost;

    await this.Repair.save(repair);

    return {
      status: 'success',
      message: 'repair request has been created successfully',
      data: repair,
    };
  }

  // workshop updating process
  async updateRepairReq(
    userId: string,
    repairId: string,
    status: RepairStatus,
  ) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (user.role !== 'workshop') {
      throw new HttpException(
        "you don\'t have the access on products repairing",
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

    if (status === RepairStatus.Rejected) {
      await this.Repair.update(
        { repairId },
        {
          status,
          updatedAt: new Date().toLocaleString(),
        },
      );

      const repair = await this.Repair.findOne({
        where: { repairId },
        relations: { products: true },
      });

      for (const product of repair.products) {
        product.status = ProductStatus.AVAILABLE;
        await this.Product.save(product);
      }

      return {
        status: 'success',
        message: 'your repair request has been rejected',
      };
    }

    if (status === RepairStatus.Fullfilled) {
      await this.Repair.update(
        { repairId },
        {
          status,
          updatedAt: new Date().toLocaleString(),
        },
      );

      const repair = await this.Repair.findOne({
        where: { repairId },
        relations: { products: true },
      });

      for (const product of repair.products) {
        product.status = ProductStatus.Repaired;
        await this.Product.save(product);
      }

      return {
        status: 'success',
        message: "you've finished your repairing request successfully",
      };
    }

    // repair request accepting
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

  // cancel & Delete Repair Req in < Pending > case.
  async deleteRepair(userId: string, repairId: string) {
    const user = await this.User.findOne({ where: { id: userId } });

    if (![Roles.User, Roles.Admin].includes(user.role)) {
      throw new HttpException(
        "you can't cancel this repair request",
        HttpStatus.BAD_REQUEST,
      );
    }

    const repair = await this.Repair.findOne({
      where: { repairId },
      relations: {
        products: true,
      },
    });

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

    await this.Product.update({ repair }, { repair: null });
    await this.Repair.delete({ repairId, status: RepairStatus.Pending });

    return {
      status: 'success',
      message: 'repair request has been cancelled & deleted successfully',
      deletedRepair: repair,
    };
  }
}
