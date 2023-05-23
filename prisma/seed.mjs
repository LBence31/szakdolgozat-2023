import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const spotifyUser = await prisma.user.upsert({
    where: {
      email: "spotify@spotify.com",
    },
    update: {},
    create: {
      name: "Spotify",
      email: "spotify@spotify.com",
    },
  });
  console.log(spotifyUser);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
