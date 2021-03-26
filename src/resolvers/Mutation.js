const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');

const Mutation = {
  signup:
    async function signup(parent, args, context, info) {
      if (args.name === '') throw new Error('Notandanafn ógilt');
      if (args.email === '') throw new Error('Netfang ógilt');
      if (args.password === '') throw new Error('Lykilorð ógilt');
      const exists = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (exists) throw new Error('Notandi þegar skráður');
      const password = await bcrypt.hash(args.password, 10);
      const user = await context.prisma.user.create({ data: { ...args, password } });
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      return {
        token,
        user
      };
    },
  login:
    async function login(parent, args, context, info) {
      const user = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (!user) {
        throw new Error('Notandanafn eða lykilorð vitlaust');
      };
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Notandanafn eða lykilorð vitlaust');
      };
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      return {
        token,
        user
      }
    },
  post:
    async function post(parent, args, context, info) {
      const { userId } = context;
      if (!userId) {
        throw new Error('Þú verður á skrá þig inn fyrst');
      };
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: userId } },
          votesCount: 0
        }
      });
      // ATH erum að nota polling í stað subscrptions context.pubsub.publish("NEW_LINK", newLink);
      return newLink;
    },
  // ####################### TODO -> Uppfæra mutation resolverana fyrir pg gagnagrunninn ################
  updateLink:
    async function updateLink(parent, args, context, info) {
      const index = links.findIndex(link => link.id === id);
      if (description !== undefined) links[index].description = description;
      if (url !== undefined) links[index].url = url;
      return links[index];
    },
  // ####################### TODO -> Uppfæra mutation resolverana fyrir pg gagnagrunninn ################
  deleteLink:
    async function deleteLink(parent, args, context, info) {
      const index = links.findIndex(link => link.id === id);
      const link = links[index];
      links = links.filter(link => link.id !== id);
      return link;
    },
  vote:
    async function vote(parent, args, context, info) {
      // Er notandi innskráður?
      const userId = getUserId(context);
      if (!userId) {
        throw new Error('Þú verður á skrá þig inn fyrst');
      };
      // Hefur notandi veitt þessum link atkvæði áður?
      const vote = await context.prisma.vote.findUnique({
        where: {
          linkId_userId: {
            linkId: Number(args.linkId),
            userId: userId
          }
        }
      });
      // Notandi getur ekki veitt link fleiri en eitt atkvæði
      if (Boolean(vote)) {
        throw new Error(`Búið að greiða þessum link atkvæði: ${args.linkId}`);
      }
      // Búum til nýtt atkvæði með tengsli milli notanda og links
      const newVote = context.prisma.vote.create({
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: Number(args.linkId) } }
        }
      });
      //Uppfæra votesCount fyrir viðeigandi link
      await context.prisma.link.update({
        where: {
          id: Number(args.linkId)
        },
        data: {
          votesCount: { increment: 1 }
        }
      });
      return newVote;
    }
}

module.exports = Mutation;