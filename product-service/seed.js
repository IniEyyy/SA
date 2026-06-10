const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categoryNames = ["Coffee", "Tea", "Bakery"];
  const categoryIds = {};
  for (const name of categoryNames) {
    let category = await prisma.category.findFirst({ where: { name } });
    if (!category) {
      category = await prisma.category.create({ data: { name } });
    }
    categoryIds[name] = category.id;
  }

  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log("Categories ready. Products already seeded, skipping products.");
    return;
  }

  const products = [
    {
      name: "Classic Single Espresso",
      description:
        "A concentrated shot of coffee brewed under pressure through finely ground beans.",
      price: 4,
      stock: 100,
      category: "Coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Creamy House Cappuccino",
      description:
        "Double espresso prepared with hot milk and a thick layer of steamed milk foam.",
      price: 5,
      stock: 100,
      category: "Coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Smooth Vanilla Latte",
      description:
        "A milk coffee made of espresso and steamed milk with a thin layer of foam.",
      price: 5,
      stock: 100,
      category: "Coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Japanese Matcha Latte",
      description:
        "High quality Japanese green tea powder whisked with velvety steamed milk.",
      price: 6,
      stock: 100,
      category: "Tea",
      imageUrl:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Fresh Butter Croissant",
      description:
        "A buttery and flaky French pastry baked fresh every single morning.",
      price: 4,
      stock: 100,
      category: "Bakery",
      imageUrl:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Rich Chocolate Muffin",
      description:
        "An intensely rich chocolate muffin packed with decadent chocolate chips.",
      price: 4,
      stock: 100,
      category: "Bakery",
      imageUrl:
        "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600",
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
        categoryId: categoryIds[p.category],
      },
    });
  }

  console.log("Seeded categories and products successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
