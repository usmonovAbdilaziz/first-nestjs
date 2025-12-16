import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { handleError, succesMessage } from 'src/utils/response';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History) private historyRepository: Repository<History>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto) {
    try {
      console.log('ishladi');
      
      const newHistory = this.historyRepository.create(createHistoryDto);
      await this.historyRepository.save(newHistory);
      return succesMessage(newHistory, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const histories = await this.historyRepository.find();
      return succesMessage(histories, 200);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const history = await this.historyRepository.findOne({ where: { id } });
      if (!history) {
        throw new NotFoundException(`History with ID ${id} not found`);
      }
      return succesMessage(history, 200);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateHistoryDto: UpdateHistoryDto) {
    try {
      const history = await this.historyRepository.findOne({ where: { id } });
      if (!history) {
        throw new NotFoundException(`History with ID ${id} not found`);
      }

      Object.assign(history, updateHistoryDto);
      await this.historyRepository.save(history);
      return succesMessage(history, 200);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const history = await this.historyRepository.findOne({ where: { id } });
      if (!history) {
        throw new NotFoundException(`History with ID ${id} not found`);
      }

      await this.historyRepository.remove(history);
      return succesMessage(
        { message: `History with ID ${id} successfully deleted` },
        200,
      );
    } catch (error) {
      handleError(error);
    }
  }
}
