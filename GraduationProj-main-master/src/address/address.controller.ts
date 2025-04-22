import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddressDto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UpdateAddressDto } from './dto/updateAddressDto.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  create(@Req() req: Request, @Body() createAddressDto: CreateAddressDto) {
    const user = req['user'] as any;
    return this.addressService.create(createAddressDto, user.id);
  }

  @Get('get')
  getAll(@Req() req: Request) {
    const user = req['user'] as any;
    return this.addressService.getAll(user.id);
  }

  @Patch('update/:id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const user = req['user'] as any;
    return this.addressService.update(id, updateAddressDto, user.id);
  }

  @Delete('delete/:id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.addressService.remove(id, user.id);
  }
}
