import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("test", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "RaPereira",
      password,
      role: "ADMIN",
    },
  });
  console.log({ user });

//   const seedEmployees = () => {
//     Promise.all(
//       employeeData.map(async (employeeItem) => {
//         const { name, number } = employeeItem;
//         const response = await prisma.employee.upsert({
//           name: name
//           number: number || "default number",
//         });
//         return response;
//       })
//     );
//   };

//   seedEmployees();
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
