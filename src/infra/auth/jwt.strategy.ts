import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserPayload } from './token.dto'
import { validate } from 'class-validator'
import { EnvDTO } from '../env/env'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<EnvDTO, true>) {
    const secret = config.get('JWT_SECRET', { infer: true })
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      algorithms: ['HS256'],
    })
  }

  async validate(payload: UserPayload) {
    return validate(payload)
  }
}
