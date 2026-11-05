import { Injectable } from '@nestjs/common'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import {
  NewRegistration,
  Registration,
  RegistrationSettings,
} from '../entities/registration'
import { RegistrationStatus } from '../enums/registration'

@Injectable()
export abstract class RegistrationRepository {
  // Fechado até a coordenação abrir; por padrão, todas as etapas recebem
  abstract getSettings(): Promise<RegistrationSettings>
  // Muda só o que vier (abrir/fechar e/ou as etapas)
  abstract updateSettings(
    changes: Partial<RegistrationSettings>
  ): Promise<RegistrationSettings>
  abstract create(registration: NewRegistration): Promise<void>
  abstract findById(id: string): Promise<Registration | null>
  abstract findMany(status?: RegistrationStatus): Promise<Registration[]>
  abstract findByCatechizing(
    catechizingId: string
  ): Promise<Registration | null>
  // Já existe inscrição pendente ou aprovada com este nome e nascimento
  abstract existsActive(name: string, birthday: Date): Promise<boolean>
  // Cria o catequizando e marca a inscrição como aprovada, na mesma transação.
  // Retorna false se ela deixou de estar pendente (aprovada por outra pessoa)
  abstract approve(params: {
    registrationId: string
    reviewerId: string
    catechizing: Catechizing
  }): Promise<boolean>
  // Retorna false se ela deixou de estar pendente
  abstract reject(params: {
    registrationId: string
    reviewerId: string
    reason: string
  }): Promise<boolean>
}
