import { PrismaClient, CompetitionType, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Sports ---
  const sportsData = [
    { name: 'Football', slug: 'football', isMain: true, order: 1 },
    { name: 'Athletics', slug: 'athletics', isMain: false, order: 2 },
    { name: 'Basketball', slug: 'basketball', isMain: false, order: 3 },
    { name: 'Boxing', slug: 'boxing', isMain: false, order: 4 },
    { name: 'Rugby', slug: 'rugby', isMain: false, order: 5 },
    { name: 'Cricket', slug: 'cricket', isMain: false, order: 6 },
  ];

  const sports: Record<string, any> = {};
  for (const s of sportsData) {
    const sport = await prisma.sport.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    sports[s.slug] = sport;
    console.log(`  ✅ Sport: ${sport.name}`);
  }

  // --- Competitions ---
  const competitionsData = [
    { name: 'Lango Super League', slug: 'lango-super-league', season: '2025/26', type: CompetitionType.LEAGUE, region: 'Lango', sportSlug: 'football' },
    { name: 'Lira District Cup', slug: 'lira-district-cup', season: '2025', type: CompetitionType.CUP, region: 'Lira', sportSlug: 'football' },
    { name: 'Lango Regional Athletics Championships', slug: 'lango-athletics-champs', season: '2025', type: CompetitionType.TOURNAMENT, region: 'Lango', sportSlug: 'athletics' },
  ];

  const competitions: Record<string, any> = {};
  for (const c of competitionsData) {
    const comp = await prisma.competition.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        season: c.season,
        type: c.type,
        region: c.region,
        sportId: sports[c.sportSlug].id,
        isActive: true,
      },
    });
    competitions[c.slug] = comp;
    console.log(`  ✅ Competition: ${comp.name}`);
  }

  // --- Teams ---
  const teamsData = [
    { name: 'Lira FC', slug: 'lira-fc', district: 'Lira' },
    { name: 'Gulu United', slug: 'gulu-united', district: 'Gulu' },
    { name: 'Kitgum SC', slug: 'kitgum-sc', district: 'Kitgum' },
    { name: 'Apach FC', slug: 'apach-fc', district: 'Apach' },
    { name: 'Lango Martyrs FC', slug: 'lango-martyrs-fc', district: 'Lango' },
  ];

  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, sportId: sports['football'].id },
    });
    console.log(`  ✅ Team: ${team.name}`);
  }

  // --- Admin User ---
  const passwordHash = await bcrypt.hash('Admin@2025', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pearlsport.it' },
    update: {},
    create: {
      name: 'Site Admin',
      email: 'admin@pearlsport.it',
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
