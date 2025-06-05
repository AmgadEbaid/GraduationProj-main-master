import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { RepairService } from './repair.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RepairStatus } from 'entities/Repair';

@UseGuards(JwtAuthGuard)
@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Get()
  async getAllRepairs(@Req() req: Request) {
    const userId = req['user'].id;
    const repairs = await this.repairService.getAllRepairs(userId);
    return repairs;
  }

  @Post(':id')
  async makeRepairReq(
    @Body('products') products: string[],
    @Body('cost') cost: string,
    @Param('id') workshopId: string,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    const repair = await this.repairService.makeRepairReq(
      products,
      cost,
      userId,
      workshopId,
    );
    return repair;
  }

  @Patch(':id')
  async updateRepiarReq(
    @Param('id') repairId,
    @Body('status') status: RepairStatus,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    const updateRepiar = await this.repairService.updateRepairReq(
      userId,
      repairId,
      status,
    );
    return updateRepiar;
  }

  @Delete(':id')
  async deleteRepairReq(@Param('id') repairId: string, @Req() req: Request) {
    const userId = req['user'].id;
    const deleteRepair = await this.repairService.deleteRepair(
      userId,
      repairId,
    );
    return deleteRepair;
  }
}
