import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles.decorator'
import { Role } from '@/domain/catechists/enums/role'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Recupera as roles requeridas do decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // Se não houver roles requeridas, qualquer um pode acessar
    if (!requiredRoles) {
      return true
    }

    // Acessa o usuário da requisição
    const { user } = context.switchToHttp().getRequest()

    // Log para verificar a estrutura de user

    // Se o usuário ou a role não estiverem definidos, negue o acesso
    if (!user || !user.role) {
      return false
    }

    // Verifica se a role do usuário está nas roles requeridas
    return requiredRoles.includes(user.role)
  }
}
