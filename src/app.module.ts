import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { LanguagesModule } from './languages/languages.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ListingOrdersModule } from './listing-orders/listing-orders.module';
import { TagsModule } from './tags/tags.module';
import { ExtraItemsModule } from './extra-items/extra-items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mysqlpassword1',
      database: 'menubar',
      entities: [
        // 'dist/**/**/**/*.entity{.ts,.js}',
        // 'dist/**/**/*.entity{.ts,.js}',
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
      autoLoadEntities: true,
      migrations: ['dist/database/migration/*{.ts,.js}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveStaticOptions: {
        index: false,
        extensions: ['jpg', 'jpeg', 'png', 'gif'],
      },
      serveRoot: '/uploads',
    }),
    RestaurantsModule,
    LanguagesModule,
    CategoriesModule,
    ItemsModule,
    SubcategoriesModule,
    ListingOrdersModule,
    TagsModule,
    ExtraItemsModule,
    UsersModule,
    AuthModule,
    AdminsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
