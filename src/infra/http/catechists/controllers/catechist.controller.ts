import { AuthenticateCatechistRequestDto } from '@/domain/catechists/dtos/request/authenticate-catechist.dto'
import { CreateCatechistRequestDto } from '@/domain/catechists/dtos/request/create-catechist.dto'
import { AuthenticateCatechistResponseDto } from '@/domain/catechists/dtos/response/authenticate-catechist.dto'
import { Role } from '@/domain/catechists/enums/role'
import { AuthenticateCatechistUseCase } from '@/domain/catechists/use-cases/authenticate-catechist.use-case'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { DeleteCatechistUseCase } from '@/domain/catechists/use-cases/delete-catechist.use-case'
import { Public } from '@/infra/auth/public'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/catechists')
export class CatechistController {
  constructor(
    private createCatechist: CreateCatechistUseCase,
    private authenticateCatechist: AuthenticateCatechistUseCase,
    private deleteCatechist: DeleteCatechistUseCase
  ) {}

  @Post()
  @Public()
  @HttpCode(201)
  async create(@Body() createCatechistRequestDto: CreateCatechistRequestDto) {
    const result = await this.createCatechist.execute(createCatechistRequestDto)

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }

  @Post('/auth')
  @Public()
  async authenticate(
    @Body() authenticateCatechistRequestDto: AuthenticateCatechistRequestDto
  ) {
    const response = await this.authenticateCatechist.execute(
      authenticateCatechistRequestDto
    )

    if (response.isLeft()) {
      throw new UnauthorizedException()
    }

    return response.value
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  async delete(@Param('id') id: string) {
    const response = await this.deleteCatechist.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }
}
