import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

// Cria o primeiro coordenador, já que só coordenadores podem cadastrar catequistas
const prisma = new PrismaClient()

async function seed() {
  const email = (
    process.env.SEED_EMAIL ?? 'coordenador@catequese.local'
  ).toLowerCase()

  const hasCoordinator = await prisma.catechist.findFirst({
    where: { role: 'COORDINATOR' },
  })

  if (hasCoordinator) {
    console.log('Já existe um coordenador cadastrado')
    return
  }

  await prisma.catechist.create({
    data: {
      name: 'Coordenador',
      nickname: 'Coordenador',
      role: 'COORDINATOR',
      birthday: new Date('2000-01-01'),
      phone: '',
      address: '',
      email,
      password_hash: await hash('123456', 6),
      hasReceivedBaptism: true,
      hasReceivedEucharist: true,
      hasReceivedConfirmation: true,
      hasReceivedMarriage: false,
    },
  })

  console.log(`Coordenador criado: ${email} (senha padrão 123456)`)
}

seed().finally(() => prisma.$disconnect())
