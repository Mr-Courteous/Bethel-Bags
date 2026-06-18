import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@BethelEmpire2025", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bethelempire.com" },
    update: {},
    create: {
      name: "Bethel Empire Admin",
      email: "admin@bethelempire.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "handbags" },
      update: {},
      create: { name: "Handbags", slug: "handbags", description: "Premium handcrafted handbags" },
    }),
    prisma.category.upsert({
      where: { slug: "tote-bags" },
      update: {},
      create: { name: "Tote Bags", slug: "tote-bags", description: "Spacious and stylish tote bags" },
    }),
    prisma.category.upsert({
      where: { slug: "clutch-bags" },
      update: {},
      create: { name: "Clutch Bags", slug: "clutch-bags", description: "Elegant clutch bags for every occasion" },
    }),
    prisma.category.upsert({
      where: { slug: "backpacks" },
      update: {},
      create: { name: "Backpacks", slug: "backpacks", description: "Fashionable and functional backpacks" },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "imperial-leather-handbag" },
      update: {},
      create: {
        name: "Imperial Leather Handbag",
        slug: "imperial-leather-handbag",
        description: "A premium handcrafted leather handbag with gold-tone hardware. Perfect for everyday elegance.",
        price: 45000,
        comparePrice: 55000,
        images: ["/placeholder-bag-1.jpg"],
        stock: 15,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "empire-signature-tote" },
      update: {},
      create: {
        name: "Empire Signature Tote",
        slug: "empire-signature-tote",
        description: "Spacious, structured tote with interior pockets and gold accent zipper.",
        price: 32000,
        images: ["/placeholder-bag-2.jpg"],
        stock: 20,
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "gold-evening-clutch" },
      update: {},
      create: {
        name: "Gold Evening Clutch",
        slug: "gold-evening-clutch",
        description: "Stunning gold-toned clutch bag for special occasions and evening events.",
        price: 18500,
        comparePrice: 22000,
        images: ["/placeholder-bag-3.jpg"],
        stock: 12,
        featured: true,
        categoryId: categories[2].id,
      },
    }),
  ]);
  console.log("✅ Products created:", products.length);

  // Sample course
  await prisma.course.upsert({
    where: { slug: "beginner-bag-making" },
    update: {},
    create: {
      title: "Beginner Bag Making Masterclass",
      slug: "beginner-bag-making",
      description: "Learn the art of bag making from scratch. This comprehensive course covers materials, cutting, stitching, and finishing techniques.",
      price: 25000,
      duration: "4 Weeks",
      level: "Beginner",
      published: true,
    },
  });
  console.log("✅ Sample course created");

  // Sample testimonials
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { authorName: "Chiamaka Obi", content: "Bethel Empire bags are absolutely stunning! I get compliments everywhere I go. The quality is unmatched.", rating: 5, source: "CUSTOMER", approved: true },
      { authorName: "Fatima Yusuf", content: "I took the bag-making course and it completely changed my life. Now I make and sell my own bags!", rating: 5, source: "TRAINEE", approved: true },
      { authorName: "Ngozi Adeyemi", content: "Fast delivery and the bag was exactly as described. Will definitely shop again!", rating: 5, source: "CUSTOMER", approved: true },
    ],
  });
  console.log("✅ Testimonials created");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email:    admin@bethelempire.com");
  console.log("   Password: Admin@BethelEmpire2025");
}

main().catch(console.error).finally(() => prisma.$disconnect());
