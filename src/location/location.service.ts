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
import { ItemObjectsService } from 'src/item-objects/item-objects.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private readonly buildingService: BuildingService,
    private readonly itemsService: ItemObjectsService,
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

  async update(id: number, dto: UpdateLocationDto) {
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
        itemObject_id,
      } = dto;

      // ✅ Required fields check
      if (!infoName || !description || !reasonForTransfer) {
        throw new ConflictException(
          'infoName, description va reasonForTransfer hammasi bo‘lishi shart',
        );
      }
      if (!building_id || !category_id || !itemObject_id) {
        throw new NotFoundException(
          'building_id, category_id yoki itemObject_id topilmadi',
        );
      }

      // ✅ Fetch all necessary entities
      const categoryResult = await this.categoryService.findOne(category_id);
      const buildingResult = await this.buildingService.findOne(building_id);
      const itemResult = await this.itemsService.findOne(itemObject_id);
      const location = await this.locationRepository.findOne({ where: { id } });

      // Extract data from the wrapped responses
      const category = categoryResult?.data as any;
      const building = buildingResult?.data as any;
      const item = itemResult?.data as any;

      if (!category) throw new NotFoundException('Category not found');
      if (!building) throw new NotFoundException('Building not found');
      if (!item) throw new NotFoundException('Item not found');
      if (!location) throw new NotFoundException('Location not found');

      // ✅ Check if location data is unchanged
      if (
        location.floor === floor &&
        location.room === room &&
        location.showcase === showcase &&
        location.polka === polka
      ) {
        throw new ConflictException('Location already exists');
      }

      // ✅ Prepare old data for history/info
      // Store only essential data to prevent recursive nesting
      const oldCategory = {
        id: category.id,
        name: category.name,
        statusType: category.statusType,
        categoryNumber: category.categoryNumber,
      };

      const oldLocation = {
        id: location.id,
        floor: location.floor,
        room: location.room,
        showcase: location.showcase,
        polka: location.polka,
      };

      const oldBuilding = {
        id: building.id,
        name: building.name,
      };

      // ✅ Create info record
      // Store simplified data to prevent recursive nesting
      const info = await this.infoservice.create({
        category_id,
        reasonForTransfer,
        name: infoName,
        description,
        home: [
          {
            data: {
              type: 'category',
              id: oldCategory.id,
              name: oldCategory.name,
            },
          },
          {
            data: {
              type: 'location',
              id: oldLocation.id,
              floor: oldLocation.floor,
              room: oldLocation.room,
              showcase: oldLocation.showcase,
              polka: oldLocation.polka,
            },
          },
          {
            data: {
              type: 'building',
              id: oldBuilding.id,
              name: oldBuilding.name,
            },
          },
        ],
      });

      // ✅ Update category history
      // First, get the current category to retrieve existing history
      const currentCategoryResult =
        await this.categoryService.findOne(category_id);
      if (!currentCategoryResult) {
        throw new NotFoundException('Category not found');
      }
      const currentCategory = currentCategoryResult.data;
      const existingHistory = (currentCategory as any).history || [];

      // Create new history entry
      // Store simplified data to prevent recursive nesting
      const newHistoryEntry = {
        oldData: {
          category: {
            id: oldCategory.id,
            name: oldCategory.name,
          },
          location: {
            id: oldLocation.id,
            floor: oldLocation.floor,
            room: oldLocation.room,
            showcase: oldLocation.showcase,
            polka: oldLocation.polka,
          },
          building: {
            id: oldBuilding.id,
            name: oldBuilding.name,
          },
        },
        newData: {
          floor: dto.floor,
          room: dto.room,
          showcase: dto.showcase,
          polka: dto.polka,
        },
        timestamp: new Date(),
      };
      const updateItems = { ...existingHistory, newHistoryEntry };
      // Update category with new history
      await this.categoryService.update(category_id, {
        history: updateItems,
      } as any);
      // ✅ Update item status
      await this.itemsService.update(itemObject_id, {
        statusCategory: CategoryStatus.Moved,
        moved: (item.moved || 0) + 1,
      });

      // ✅ Prepare data for location update
      const updateData: any = {
        floor,
        room,
        showcase,
        polka,
        category: { id: category_id },
        building: { id: building_id },
      };

      // ✅ Update location
      await this.locationRepository.update(id, updateData);

      const updatedLocation = await this.locationRepository.findOne({
        where: { id },
        relations: ['category', 'building'],
      });

      if (!updatedLocation)
        throw new NotFoundException('Location not found after update');

      return succesMessage({ data: updatedLocation, info: info?.data });
    } catch (error) {
      handleError(error);
    }

    // ✅ Helper function for picking fields
    function pick(obj: any, keys: string[]) {
      return keys.reduce((acc, key) => {
        if (obj && obj[key] !== undefined) acc[key] = obj[key];
        return acc;
      }, {} as any);
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
