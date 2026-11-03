import { AuthenticateCatechistRequestDto } from '@/domain/catechists/dtos/request/authenticate-catechist.dto'
import { CreateCatechistRequestDto } from '@/domain/catechists/dtos/request/create-catechist.dto'
import { TransferCatechistRequestDto } from '@/domain/catechists/dtos/request/transfer-catechist.dto'
import { UpdateCatechistPasswordRequestDto } from '@/domain/catechists/dtos/request/update-catechist-password.dto'
import { UpdateCatechistRequestDto } from '@/domain/catechists/dtos/request/update-catechist.dto'
import { Role } from '@/domain/catechists/enums/role'
import { AuthenticateCatechistUseCase } from '@/domain/catechists/use-cases/authenticate-catechist.use-case'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { DeleteCatechistUseCase } from '@/domain/catechists/use-cases/delete-catechist.use-case'
import { FetchAllCatechistsUseCase } from '@/domain/catechists/use-cases/fetch-all-catechists.use-case'
import { FetchCatechistByIdUseCase } from '@/domain/catechists/use-cases/fetch-catechist-by-id.use-case'
import { TransferCatechistUseCase } from '@/domain/catechists/use-cases/transfer-catechist.use-case'
import { UpdatePasswordUseCase } from '@/domain/catechists/use-cases/update-catechist-password.use-case'
import { UpdateCatechistUseCase } from '@/domain/catechists/use-cases/update-catechist.use-case'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Public } from '@/infra/auth/public'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { CatechistPresenter } from '../presenters/catechist.presenter'

@Controller('/catechists')
export class CatechistController {
  constructor(
    private createCatechist: CreateCatechistUseCase,
    private authenticateCatechist: AuthenticateCatechistUseCase,
    private deleteCatechist: DeleteCatechistUseCase,
    private fetchAllCatechists: FetchAllCatechistsUseCase,
    private fetchCatechistById: FetchCatechistByIdUseCase,
    private updateCatechist: UpdateCatechistUseCase,
    private updatePassword: UpdatePasswordUseCase,
    private transferCatechist: TransferCatechistUseCase
  ) {}

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(@Body() createCatechistRequestDto: CreateCatechistRequestDto) {
    const result = await this.createCatechist.execute(createCatechistRequestDto)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return CatechistPresenter.toHTTP(result.value.catechist)
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

  @Get()
  async fetchAll() {
    const response = await this.fetchAllCatechists.execute()

    return response.value?.catechists.map(CatechistPresenter.toHTTP)
  }

  @Get('/me')
  async profile(@CurrentUser() user: UserPayload) {
    const response = await this.fetchCatechistById.execute(user.sub)

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return CatechistPresenter.toHTTP(response.value.catechist)
  }

  @Patch('/me/password')
  @HttpCode(204)
  async changePassword(
    @CurrentUser() user: UserPayload,
    @Body() updateCatechistPasswordRequestDto: UpdateCatechistPasswordRequestDto
  ) {
    const response = await this.updatePassword.execute(
      user.sub,
      updateCatechistPasswordRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }

  @Patch('/transfer')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async transfer(
    @Body() transferCatechistRequestDto: TransferCatechistRequestDto
  ) {
    const response = await this.transferCatechist.execute(
      transferCatechistRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }

  @Get('/:id')
  async fetchById(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.fetchCatechistById.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return CatechistPresenter.toHTTP(response.value.catechist)
  }

  @Put()
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async update(@Body() updateCatechistRequestDto: UpdateCatechistRequestDto) {
    const response = await this.updateCatechist.execute(
      updateCatechistRequestDto
    )

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case DuplicatedError:
          throw new ConflictException(error.message)
        default:
          throw new NotFoundException(error.message)
      }
    }
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteCatechist.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }
}
