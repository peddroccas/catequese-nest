import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Type,
} from '@nestjs/common'

interface RateLimitOptions {
  // Tentativas por IP dentro da janela
  perIp: number
  // Tentativas de todos juntos: freia um ataque vindo de muitos IPs
  global: number
  windowMs: number
}

// Quantas chaves guardamos no máximo (um ataque com IPs forjados não enche a memória)
const MAX_TRACKED_KEYS = 5000

// Limitador em memória, por IP, para as rotas públicas. A janela é
// deslizante: só conta as tentativas dos últimos `windowMs`. Roda antes de
// ler o corpo da requisição, então um envio barrado nem chega a receber os
// arquivos. Cada instância do guard tem seus próprios contadores
export function createRateLimitGuard(options: RateLimitOptions): Type<CanActivate> {
  @Injectable()
  class RateLimitGuard implements CanActivate {
    private hits = new Map<string, number[]>()

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<{ ip?: string }>()
      const now = Date.now()

      this.prune(now)

      const ipAllowed = this.record(
        `ip:${request.ip ?? 'unknown'}`,
        now,
        options.perIp
      )
      const globalAllowed = this.record('global', now, options.global)

      if (!ipAllowed || !globalAllowed) {
        throw new HttpException(
          'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
          HttpStatus.TOO_MANY_REQUESTS
        )
      }

      return true
    }

    // Registra a tentativa; retorna false quando passou do limite
    private record(key: string, now: number, limit: number) {
      const recent = (this.hits.get(key) ?? []).filter(
        time => now - time < options.windowMs
      )
      recent.push(now)
      this.hits.set(key, recent)

      return recent.length <= limit
    }

    private prune(now: number) {
      if (this.hits.size < MAX_TRACKED_KEYS) {
        return
      }

      for (const [key, times] of this.hits) {
        if (now - times[times.length - 1] >= options.windowMs) {
          this.hits.delete(key)
        }
      }
      // Ainda cheio: descarta os mais antigos (nunca a chave global)
      for (const key of this.hits.keys()) {
        if (this.hits.size < MAX_TRACKED_KEYS) {
          break
        }
        if (key !== 'global') {
          this.hits.delete(key)
        }
      }
    }
  }

  return RateLimitGuard
}

const HOUR = 60 * 60 * 1000

// Envio da inscrição: famílias na mesma rede (salão da paróquia) dividem o
// IP, então o limite por IP é folgado; o global protege o armazenamento
export class SubmitRegistrationRateLimitGuard extends createRateLimitGuard({
  perIp: 10,
  global: 250,
  windowMs: HOUR,
}) {}

// Consulta de "inscrições abertas?": barata, mas também não fica aberta a flood
export class RegistrationStatusRateLimitGuard extends createRateLimitGuard({
  perIp: 120,
  global: 3000,
  windowMs: 10 * 60 * 1000,
}) {}
