import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AuthenticateCatechistRequestDto } from '@/domain/catechists/dtos/request/authenticate-catechist.dto'
import { CreateCatechistRequestDto } from '@/domain/catechists/dtos/request/create-catechist.dto'
import { UpdateCatechistPasswordRequestDto } from '@/domain/catechists/dtos/request/update-catechist-password.dto'
import { UpdateCatechistRequestDto } from '@/domain/catechists/dtos/request/update-catechist.dto'
import { Role } from '@/domain/catechists/enums/role'
import { AvatarStorage } from '@/domain/catechists/storage/avatar-storage'
import { ArchiveCatechistUseCase } from '@/domain/catechists/use-cases/archive-catechist.use-case'
import { AuthenticateCatechistUseCase } from '@/domain/catechists/use-cases/authenticate-catechist.use-case'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { DeleteCatechistUseCase } from '@/domain/catechists/use-cases/delete-catechist.use-case'
import { FetchAllCatechistsUseCase } from '@/domain/catechists/use-cases/fetch-all-catechists.use-case'
import { FetchArchivedCatechistsUseCase } from '@/domain/catechists/use-cases/fetch-archived-catechists.use-case'
import { FetchCatechistByIdUseCase } from '@/domain/catechists/use-cases/fetch-catechist-by-id.use-case'
import { ResetCatechistPasswordUseCase } from '@/domain/catechists/use-cases/reset-catechist-password.use-case'
import { RestoreCatechistUseCase } from '@/domain/catechists/use-cases/restore-catechist.use-case'
import { UpdateCatechistAvatarUseCase } from '@/domain/catechists/use-cases/update-catechist-avatar.use-case'
import { UpdatePasswordUseCase } from '@/domain/catechists/use-cases/update-catechist-password.use-case'
import { UpdateCatechistUseCase } from '@/domain/catechists/use-cases/update-catechist.use-case'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Public } from '@/infra/auth/public'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import {
  BadRequestException,
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
  ServiceUnavailableException,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CatechistPresenter } from '../presenters/catechist.presenter'

const MAX_AVATAR_SIZE = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface UploadedImage {
  buffer: Buffer
  mimetype: string
  size: number
}

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
    private resetCatechistPassword: ResetCatechistPasswordUseCase,
    private archiveCatechist: ArchiveCatechistUseCase,
    private restoreCatechist: RestoreCatechistUseCase,
    private fetchArchivedCatechists: FetchArchivedCatechistsUseCase,
    private updateCatechistAvatar: UpdateCatechistAvatarUseCase,
    private avatarStorage: AvatarStorage
  ) {}

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(@Body() createCatechistRequestDto: CreateCatechistRequestDto) {
    const result = await this.createCatechist.execute(createCatechistRequestDto)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DuplicatedError:
          throw new ConflictException(error.message)
        default:
          throw new NotFoundException('Turma não encontrada')
      }
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
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException(
            'A nova senha não pode ser a senha padrão'
          )
        default:
          throw new NotFoundException(error.message)
      }
    }
  }

  @Patch('/me/avatar')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_AVATAR_SIZE } })
  )
  async changeAvatar(
    @CurrentUser() user: UserPayload,
    @UploadedFile() file?: UploadedImage
  ) {
    this.ensureAvatarStorageEnabled()

    if (!file) {
      throw new BadRequestException('Envie uma imagem no campo "file"')
    }
    if (!AVATAR_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('A foto deve ser JPG, PNG ou WEBP')
    }

    const response = await this.updateCatechistAvatar.execute({
      catechistId: user.sub,
      file: { body: file.buffer, contentType: file.mimetype },
    })

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return response.value
  }

  @Delete('/me/avatar')
  @HttpCode(204)
  async removeAvatar(@CurrentUser() user: UserPayload) {
    this.ensureAvatarStorageEnabled()

    const response = await this.updateCatechistAvatar.execute({
      catechistId: user.sub,
      file: null,
    })

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }

  private ensureAvatarStorageEnabled() {
    if (!this.avatarStorage.isEnabled()) {
      throw new ServiceUnavailableException(
        'Upload de fotos não configurado no servidor'
      )
    }
  }

  @Patch('/:id/password/reset')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async resetPassword(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.resetCatechistPassword.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }

  @Get('/archived')
  @Roles([Role.COORDINATOR])
  async fetchArchived() {
    const response = await this.fetchArchivedCatechists.execute()

    return response.value?.catechists.map(CatechistPresenter.toHTTP)
  }

  @Patch('/:id/archive')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.archiveCatechist.execute(id, user.sub)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException(
            'Não é possível arquivar este catequista'
          )
        default:
          throw new NotFoundException()
      }
    }
  }

  @Patch('/:id/restore')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.restoreCatechist.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('O catequista não está arquivado')
        default:
          throw new NotFoundException()
      }
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
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('Arquive o catequista antes de excluir')
        default:
          throw new NotFoundException()
      }
    }
  }
}
