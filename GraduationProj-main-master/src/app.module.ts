import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Otp } from 'entities/Otp';
import { APP_PIPE } from '@nestjs/core';
import { Address } from 'entities/Address';
import { Order } from 'entities/Order';
import { Product } from 'entities/Product';
import { AddressController } from './address/address.controller';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import { Review } from 'entities/review';
import { ProductModule } from './product/product.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from 'entities/Chat';
import { Message } from 'entities/Message';
import { FirebaseModule } from './firebase/firebase.module';
import { SearchHistory } from 'entities/SearchHistory';
import { SearchHistoryModule } from './search-history/search-history.module';
import { RepairModule } from './repair/repair.module';
import { Repair } from 'entities/Repair';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '9d' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [
        User,
        Otp,
        Address,
        Order,
        Product,
        Review,
        Message,
        Chat,
        SearchHistory,
        Review,
        Repair,
      ],
    }),
    UserModule,
    AuthModule,
    UserModule,
    AddressModule,
    OrderModule,
    ReviewModule,
    ProductModule,
    ChatModule,
    MessageModule,
    FirebaseModule,
    SearchHistoryModule,
    RepairModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    AppService,
  ],
})
export class AppModule {}
