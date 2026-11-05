import { z } from 'zod'
import { MaritalStatus } from '@/domain/catechizings/enums/marital-status'
import {
  RegistrationSegment,
  SEGMENTS_WITH_EUCHARIST,
} from '../enums/registration'
import { RegistrationData, RegistrationParent } from '../entities/registration'

// O formulário é público: tudo que chega é validado aqui, com limites de
// tamanho, e nada vai para o banco sem passar por este schema

export const SHIRT_SIZES = [
  '2',
  '4',
  '6',
  '8',
  '10',
  '12',
  '14',
  '16',
  'PP',
  'P',
  'M',
  'G',
  'GG',
  'XG',
] as const

// Estados civis que a ficha oferece
export const REGISTRATION_MARITAL_STATUSES = [
  MaritalStatus.SOLTEIRO,
  MaritalStatus.NAMORANDO,
  MaritalStatus.NOIVO,
  MaritalStatus.CASADO_CIVIL,
  MaritalStatus.CASADO_RELIGIOSO,
] as const

// Caracteres de controle e de direção de texto (usados para disfarçar conteúdo)
const INVISIBLE_CHARS =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f​-‏‪-‮⁦-⁩]/g
const PERSON_NAME = /^\p{L}[\p{L}\s'.-]*$/u

const text = (max: number) =>
  z
    .string()
    .max(max * 2)
    .transform(value =>
      value.replace(INVISIBLE_CHARS, '').replace(/\s+/g, ' ').trim()
    )
    .pipe(z.string().max(max, `Máximo de ${max} caracteres`))

const requiredText = (max: number) =>
  text(max).pipe(z.string().min(1, 'Campo obrigatório'))

const personName = (max = 100) =>
  requiredText(max).pipe(
    z.string().min(2, 'Nome muito curto').regex(PERSON_NAME, 'Use apenas letras')
  )

const optionalPersonName = () =>
  text(100).pipe(
    z
      .string()
      .refine(value => !value || PERSON_NAME.test(value), 'Use apenas letras')
  )

// Telefone com DDD (10 ou 11 dígitos), guardado como o resto do sistema:
// (61) 99999-9999
function maskPhone(digits: string) {
  const areaCode = digits.slice(0, 2)
  const number = digits.slice(2)
  const splitAt = number.length > 8 ? 5 : 4

  return `(${areaCode}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`
}

const phone = () =>
  z
    .string()
    .max(30)
    .transform(value => value.replace(/\D/g, ''))
    .refine(
      digits => digits.length === 10 || digits.length === 11,
      'Telefone inválido. Use DDD + número'
    )
    .transform(maskPhone)

const optionalPhone = () =>
  z
    .string()
    .max(30)
    .transform(value => value.replace(/\D/g, ''))
    .refine(
      digits => !digits || digits.length === 10 || digits.length === 11,
      'Telefone inválido. Use DDD + número'
    )
    .transform(digits => (digits ? maskPhone(digits) : ''))

const birthday = () =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine(value => {
      const date = new Date(`${value}T00:00:00.000Z`)
      // Um dia de folga por causa do fuso (a data vem do horário de Brasília)
      const limit = Date.now() + 24 * 60 * 60 * 1000
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().startsWith(value) &&
        value >= '1900-01-01' &&
        date.getTime() <= limit
      )
    }, 'Data de nascimento inválida')
    .transform(value => new Date(`${value}T00:00:00.000Z`))

function normalizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const schema = z.object({
  segment: z.nativeEnum(RegistrationSegment),
  name: personName(),
  birthday: birthday(),
  address: requiredText(200).pipe(z.string().min(5, 'Endereço muito curto')),

  // Celular (WhatsApp) para avisos: do responsável ou, nos adultos, do próprio
  contactPhone: phone(),

  // Só menores de idade
  guardianName: optionalPersonName().optional(),
  guardianKinship: text(30).optional(),
  motherName: optionalPersonName().optional(),
  motherPhone: optionalPhone().optional(),
  fatherName: optionalPersonName().optional(),
  fatherPhone: optionalPhone().optional(),

  personWithSpecialNeeds: z.boolean(),
  specialNeedsDescription: text(300).optional(),
  foodRestriction: text(200).optional(),
  releasedToGoAwayAlone: z.boolean(),
  pickupAuthorizedBy: text(150).optional(),

  hasReceivedBaptism: z.boolean(),
  hasReceivedEucharist: z.boolean(),
  shirtSize: z.enum(SHIRT_SIZES),

  // Só adultos
  maritalStatus: z.enum(REGISTRATION_MARITAL_STATUSES).optional(),
  livesWithPartner: z.boolean().optional(),

  // Concordância com o termo de compromisso: sem ela a inscrição não é aceita
  acceptedTerms: z.literal(true, {
    errorMap: () => ({
      message: 'É preciso concordar com o termo de compromisso',
    }),
  }),
})

type SubmitRegistrationInput = z.infer<typeof schema>

function buildParents(data: SubmitRegistrationInput): RegistrationParent[] {
  if (data.segment === RegistrationSegment.ADULTOS) {
    // O próprio inscrito é o contato do grupo de WhatsApp
    return [{ name: data.name, phone: data.contactPhone, kinship: 'Próprio(a)' }]
  }

  const parents: RegistrationParent[] = [
    {
      name: data.guardianName!,
      phone: data.contactPhone,
      kinship: data.guardianKinship!,
    },
  ]
  const others = [
    { name: data.motherName, phone: data.motherPhone, kinship: 'Mãe' },
    { name: data.fatherName, phone: data.fatherPhone, kinship: 'Pai' },
  ]

  const digits = (value: string) => value.replace(/\D/g, '')

  for (const other of others) {
    // Mesma pessoa se o nome é igual (sem acento/maiúscula) ou o celular é o mesmo
    const alreadyListed = parents.some(
      parent =>
        normalizeName(parent.name) === normalizeName(other.name ?? '') ||
        (digits(other.phone ?? '') !== '' &&
          digits(parent.phone) === digits(other.phone ?? ''))
    )
    if (other.name && !alreadyListed) {
      parents.push({
        name: other.name,
        phone: other.phone ?? '',
        kinship: other.kinship,
      })
    }
  }

  return parents
}

export const submitRegistrationSchema = schema
  .superRefine((data, context) => {
    const isAdult = data.segment === RegistrationSegment.ADULTOS
    const require = (path: string, ok: unknown, message = 'Campo obrigatório') => {
      if (!ok) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [path], message })
      }
    }

    if (isAdult) {
      require('maritalStatus', data.maritalStatus)
      require('livesWithPartner', data.livesWithPartner !== undefined)
    } else {
      require('guardianName', data.guardianName)
      require('guardianKinship', data.guardianKinship)
      require(
        'pickupAuthorizedBy',
        data.releasedToGoAwayAlone || data.pickupAuthorizedBy,
        'Informe quem pode buscar'
      )
    }
    require(
      'specialNeedsDescription',
      !data.personWithSpecialNeeds || data.specialNeedsDescription,
      'Informe qual'
    )
  })
  .transform((data): RegistrationData => {
    const isAdult = data.segment === RegistrationSegment.ADULTOS
    const canHaveEucharist = SEGMENTS_WITH_EUCHARIST.includes(data.segment)

    return {
      segment: data.segment,
      name: data.name,
      birthday: data.birthday,
      address: data.address,
      personWithSpecialNeeds: data.personWithSpecialNeeds,
      specialNeedsDescription: data.personWithSpecialNeeds
        ? data.specialNeedsDescription || null
        : null,
      foodRestriction: data.foodRestriction || null,
      // Adulto vai embora sozinho
      releasedToGoAwayAlone: isAdult ? true : data.releasedToGoAwayAlone,
      pickupAuthorizedBy:
        !isAdult && !data.releasedToGoAwayAlone
          ? data.pickupAuthorizedBy || null
          : null,
      shirtSize: data.shirtSize,
      hasReceivedBaptism: data.hasReceivedBaptism,
      // Pré-Eucaristia e Eucaristia ainda não receberam a 1ª Eucaristia
      hasReceivedEucharist: canHaveEucharist ? data.hasReceivedEucharist : false,
      hasReceivedMarriage:
        isAdult && data.maritalStatus === MaritalStatus.CASADO_RELIGIOSO,
      maritalStatus: isAdult ? (data.maritalStatus ?? null) : null,
      livesWithPartner: isAdult ? (data.livesWithPartner ?? null) : null,
      parents: buildParents(data),
    }
  })
