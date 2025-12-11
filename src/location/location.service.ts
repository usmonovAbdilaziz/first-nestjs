import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { BuildingService } from 'src/building/building.service';
import { handleError, succesMessage } from 'src/utils/response';
import { CategoryStatus } from 'src/Roles/roles';
import { InfoService } from 'src/info/info.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private readonly buildingService: BuildingService,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => InfoService)) private infoservice: InfoService,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      const { category_id, building_id, floor, room, showcase, polka } =
        createLocationDto;

      // Validate that category exists
      const exists = await this.categoryService.findOne(category_id);
      if (!exists) throw new NotFoundException('Category not found');

      // Validate that building exists
      const buildingExists = await this.buildingService.findOne(building_id);
      if (!buildingExists) {
        throw new NotFoundException('Building not found');
      }
      const existsBuild: any = await this.locationRepository.findOne({
        where: { building_id, floor, room, showcase, polka },
      });
      if (existsBuild) {
        throw new ConflictException('Location already exists');
      }

      const data = buildingExists.data as any;

      const limits = [
        { field: 'floor', value: floor, max: data.floors },
        { field: 'room', value: room, max: data.rooms },
        { field: 'showcase', value: showcase, max: data.showcases },
        { field: 'polka', value: polka, max: data.polkas },
      ];

      const error = limits.find((item) => item.value > item.max);

      if (error) {
        throw new ConflictException(
          `${error.field} value (${error.value}) exceeds limit (${error.max})`,
        );
      }

      // Fix: Transform DTO to match entity structure
      const newLocation = this.locationRepository.create({
        floor,
        room,
        showcase,
        polka,
        category: { id: category_id },
        building: { id: building_id },
      });

      await this.locationRepository.save(newLocation);
      return succesMessage(newLocation, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const locations = await this.locationRepository.find({
        relations: ['category', 'building'],
      });
      return succesMessage(locations);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const location = await this.locationRepository.findOne({
        where: { id },
        relations: ['category', 'building'],
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      return succesMessage(location);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    try {
      const {
        category_id,
        building_id,
        floor,
        room,
        showcase,
        polka,
        infoName,
        description,
        reasonForTransfer,
      } = updateLocationDto;
      if (!infoName || !description || !reasonForTransfer) {
        throw new ConflictException(
          'infoName, description va reasonForTransfer hammasi bulishi shart',
        );
      }
      if (category_id) {
        const exists = await this.categoryService.findOne(category_id);
        if (!exists) throw new NotFoundException('Category not found');
      }
      if (building_id) {
        const buildingExists = await this.buildingService.findOne(building_id);
        if (!buildingExists) {
          throw new NotFoundException('Building not found');
        }
      }

      const existsBuild: any = await this.locationRepository.findOne({
        where: { id },
      });
      if (
        floor === existsBuild.floor &&
        room === existsBuild.room &&
        showcase === existsBuild.showcase &&
        polka === existsBuild.polka
      ) {
        throw new ConflictException('Location already exists');
      }
      //for info create
      const { data }: any = await this.categoryService.findOne(
        existsBuild.category_id,
      );
      const building = await this.buildingService.findOne(
        existsBuild.building_id,
      );
     
      const newMove = data.moved + 1;
      const newStatus = CategoryStatus.Moved;
      const info = await this.infoservice.create({
        category_id: existsBuild.category_id,
        reasonForTransfer,
        name: infoName,
        description,
        home: [],
      });

      const historyItem = {
        moved: newMove,
        status: newStatus,
        updatedAt: data.updatedAt,
        history: [existsBuild],
      };
      await this.categoryService.update(existsBuild.category_id, historyItem);

      // First check if location exists
      await this.findOne(id);

      // Transform DTO for update to match entity structure if needed
      const updateData: any = {
        floor: updateLocationDto.floor,
        room: updateLocationDto.room,
        showcase: updateLocationDto.showcase,
        polka: updateLocationDto.polka,
        building_id: updateLocationDto.building_id,
        category_id:updateLocationDto.category_id
      };

      // Handle category_id -> category transformation
      if (updateData.category_id !== undefined) {
        updateData.category = { id: updateData.category_id };
        delete updateData.category_id;
      }

      // Handle building_id -> building transformation
      if (updateData.building_id !== undefined) {
        updateData.building = { id: updateData.building_id };
        delete updateData.building_id;
      }

      // Update the location
      await this.locationRepository.update(id, updateData);

      // Return updated location
      const updatedLocation = await this.locationRepository.findOne({
        where: { id },
        relations: ['category', 'building'],
      });

      // Check if update was successful
      if (!updatedLocation) {
        throw new NotFoundException('Location not found after update');
      }

      return succesMessage({ updatedLocation, info:info!.data });
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      // First check if location exists
      await this.findOne(id);

      // Delete the location
      await this.locationRepository.delete(id);

      return succesMessage({ message: 'Location deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
