import { CreateCatechistRequestDto } from '@/domain/catechists/dtos/request/create-catechist.dto'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { Public } from '@/infra/auth/public'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

@Controller('/catechists')
export class CatechistController {
  constructor(private createCatechist: CreateCatechistUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() createCatechistRequestDto: CreateCatechistRequestDto) {
    const result = await this.createCatechist.execute(createCatechistRequestDto)

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }
}
