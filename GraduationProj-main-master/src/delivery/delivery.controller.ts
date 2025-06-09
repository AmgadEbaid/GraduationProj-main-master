import { Controller, UseGuards, Post, Get, Delete, Patch, Req, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
    constructor(private readonly DeliveryService: DeliveryService) {}

    @Get()
    async getDeliveryReqs(@Req() req: Request) {
        const userId = req['user'].id;
        const deliveries = await this.DeliveryService.getDeliveryReqs(userId);
        return deliveries;
    }

    @Post(':id')
    async makeDeliveryReq(@Body() body: CreateDeliveryDto, @Param('id') deliveryId: string, @Req() req: Request) {
        const userId = req['user'].id;
        const delivery = await this.DeliveryService.makeDeliveryReq(body, deliveryId, userId);
        return delivery;
    }

    @Delete(':id')
    async cancelDeliveryReq(@Param('id') delivryId: string, @Req() req: Request) {
        const userId = req['user'].id;
        const cancelledDelivery = await this.DeliveryService.cancelDeliveryReq(delivryId, userId);
        return cancelledDelivery;
    }

    @Patch(':id')
    async updateDeliveryReq(@Body() body: UpdateDeliveryDto, @Param('id') deliveryId: string, @Req() req: Request) {
        const userId = req['user'].id;
        const updatedDelivery = await this.DeliveryService.updateDeliveryReq(body, deliveryId, userId);
        return updatedDelivery;
    }

}
