import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RedisModule } from '@nestjs-modules/ioredis';
import { BuildingModule } from './building/building.module';
import { ItemObjectsModule } from './item-objects/item-objects.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { InfoModule } from './info/info.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    //env config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    //typeorm config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.DB_HOST!),
      port: Number(process.env.DB_PORT!),
      username: String(process.env.DB_USERNAME!),
      password: String(process.env.DB_PASSWORD!),
      database: String(process.env.DB_NAME),
      autoLoadEntities:true,
      synchronize:true
    }),
    
    BuildingModule,
    ItemObjectsModule,
    CategoryModule,
    SubCategoryModule,
    InfoModule,
    LocationModule,
    //redis config
//  RedisModule.forRoot({
//   type: 'single',
//   url: `redis://${process.env.REDIS_HOST!}:${process.env.REDIS_PORT!}`,
// }),
  ],
})
export class AppModule {}
