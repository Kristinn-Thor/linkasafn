const Query = {
  info: () => 'This is the API of Hackernews Clone',
  feed:
    async function feed(parent, args, context, info) {
      // Athugum hvort einhver stengur var gefinn með "feed" fyrirspurninni
      // Ef svo er athugum við hvort hann komi fyrir í urlinu eða lýsingunni á linknum
      // Annars skilum við öllum linkum
      const where = args.filter ?
        { OR: [{ description: { contains: args.filter } }, { url: { contains: args.filter } }] }
        : {};

      const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,  // 'pagination' -> skip=hversu marga linka við sleppum
        take: args.take,   // 'pagination' -> take=hversu marga linka við viljum birta
        orderBy: args.orderBy
      });

      const count = await context.prisma.link.count({ where });

      const feed = {
        links,
        count
      }

      return feed
    },
  link: async function link(parent, args, context) {
    const link = await context.prisma.link.findUnique({
      where: {
        id: parseInt(args.id, 10)
      }
    });
    return link;
  },
  users: async (parent, args, context) => {
    return context.prisma.user.findMany();
  }
}

module.exports = Query;