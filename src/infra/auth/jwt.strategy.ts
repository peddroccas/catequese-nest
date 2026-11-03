import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { tokenSchema, UserPayload } from './token.dto'
import { EnvDTO } from '../env/env'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<EnvDTO, true>,
    private catechistRepository: CatechistRepository
  ) {
    const secret = config.get('JWT_SECRET', { infer: true })
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      algorithms: ['HS256'],
    })
  }

  async validate(payload: UserPayload) {
    const user = tokenSchema.parse(payload)

    // Tokens de catequistas arquivados ou excluídos deixam de valer na hora
    const catechist = await this.catechistRepository.findById(user.sub)
    if (!catechist || catechist.archivedAt) {
      throw new UnauthorizedException()
    }

    return user
  }
}
