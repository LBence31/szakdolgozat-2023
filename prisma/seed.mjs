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

  const defaultPlaylist = await prisma.playlist.upsert({
    where: {
      id: "5msih5DfnVPNG34KySmM5j",
    },
    update: {},
    create: {
      id: "5msih5DfnVPNG34KySmM5j",
      name: "Choke of the day",
      userId: spotifyUser.id,
    },
  });
  console.log(spotifyUser, defaultPlaylist);
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
