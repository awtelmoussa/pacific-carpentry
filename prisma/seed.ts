import { PrismaClient, Category as PrismaCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PRODUCTS, PROJECTS } from '../lib/data';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapCategory(catId: string): PrismaCategory {
  switch (catId) {
    case 'dining-tables':
      return PrismaCategory.DINING_TABLES;
    case 'chairs':
      return PrismaCategory.CHAIRS;
    case 'cabinets':
      return PrismaCategory.CABINETS;
    case 'doors':
      return PrismaCategory.DOORS;
    case 'shelving':
      return PrismaCategory.SHELVING;
    default:
      return PrismaCategory.DINING_TABLES;
  }
}

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productColor.deleteMany({});
  await prisma.productSize.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('Seeding products...');
  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        slug: p.id,
        category: mapCategory(p.cat),
        nameEn: p.name.en,
        nameAr: p.name.ar,
        taglineEn: p.tagline.en,
        taglineAr: p.tagline.ar,
        descEn: p.desc.en,
        descAr: p.desc.ar,
        images: [],
        featured: p.id === 'oakline-dining-table' || p.id === 'monterey-sideboard',
        colors: {
          create: p.colors.map((c, i) => ({
            nameEn: c.en,
            nameAr: c.ar,
            hex: c.hex,
            sortOrder: i,
          })),
        },
        sizes: {
          create: p.sizes.map((s, i) => ({
            labelEn: s.en,
            labelAr: s.ar,
            price: s.price,
            sortOrder: i,
          })),
        },
      },
    });
    console.log(`Created product: ${product.nameEn}`);
  }

  console.log('Seeding portfolio projects...');
  for (const proj of PROJECTS) {
    const project = await prisma.project.create({
      data: {
        slug: proj.id,
        titleEn: proj.en,
        titleAr: proj.ar,
        catEn: proj.cat.en,
        catAr: proj.cat.ar,
        year: proj.year,
        images: proj.images || [],
      },
    });
    console.log(`Created project: ${project.titleEn}`);
  }

  console.log('Seeding initial mock contact messages...');
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+971 58 111 2222',
        subject: 'Custom Walnut dining table quote',
        body: 'Hello, I saw your Oakline dining table. Would it be possible to order it in American Black Walnut with custom dimensions (280cm)? I would like to know the lead time and price estimate for shipping to Abu Dhabi.',
        read: false,
      },
      {
        name: 'Zayed Al-Maktoum',
        email: 'zayed@maktoum.ae',
        phone: null,
        subject: 'Bespoke Office Desk fitout',
        body: 'We are setting up a boutique workspace in DIFC and would like a quote for 4 custom live-edge executive desks with integrated cable management. Let us know when we can visit your workshop in Al Quoz.',
        read: true,
      }
    ]
  });

  console.log('Seeding initial mock orders...');
  const order1 = await prisma.order.create({
    data: {
      number: 'PC-842913',
      status: 'IN_PRODUCTION',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+971 50 123 4567',
      address: 'Villa 14, Street 2, Al Barari, Dubai',
      locale: 'en',
      subtotal: 5400,
      shipping: 0,
      total: 5400,
      items: {
        create: [
          {
            productId: 'oakline-dining-table',
            nameEn: 'Oakline Dining Table',
            nameAr: 'طاولة طعام أوكلاين',
            color: 'Natural Oak',
            size: '6-Seat · 220cm',
            price: 5400,
            qty: 1,
          }
        ]
      }
    }
  });
  console.log(`Created order: ${order1.number}`);

  const order2 = await prisma.order.create({
    data: {
      number: 'PC-293812',
      status: 'PAID',
      fullName: 'Tariq Al-Mansoor',
      email: 't.mansoor@example.ae',
      phone: '+971 55 987 6543',
      address: 'Penthouse B, Marina Gate 2, Dubai Marina, Dubai',
      locale: 'ar',
      subtotal: 1840,
      shipping: 0,
      total: 1840,
      items: {
        create: [
          {
            productId: 'lattice-dining-chair',
            nameEn: 'Lattice Dining Chair',
            nameAr: 'كرسي طعام لاتيس',
            color: 'Walnut',
            size: 'Armchair',
            price: 920,
            qty: 2,
          }
        ]
      }
    }
  });
  console.log(`Created order: ${order2.number}`);

  console.log('Seeding admin users...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@pacific.ae',
      name: 'Admin',
      passwordHash,
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
