const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');

const Mutation = {
  signup:
    async function signup(parent, args, context, info) {
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
        throw new Error('No such user found');
      };
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
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
        throw new Error('You have to log in first');
      };
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: userId } }
        }
      });
      // ATH erum að nota polling í stað subscrptions context.pubsub.publish("NEW_LINK", newLink);
      return newLink;
    },
  // ####################### TODO -> Uppfæra mutation resolverana fyrir SQlite gagnagrunninn ################
  updateLink:
    async function updateLink(parent, args, context, info) {
      const index = links.findIndex(link => link.id === id);
      if (description !== undefined) links[index].description = description;
      if (url !== undefined) links[index].url = url;
      return links[index];
    },
  // ####################### TODO -> Uppfæra mutation resolverana fyrir SQlite gagnagrunninn ################
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
        throw new Error(`Already voted for link: ${args.linkId}`);
      }
      // Búum til nýtt atkvæði með tengsli milli notanda og links
      const newVote = context.prisma.vote.create({
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: Number(args.linkId) } }
        }
      });
      // Látum "áskrifendur" vita að linkurinn fékk nýtt atkvæði
      // ATH erum að nota polling í stað subscrptions context.pubsub.publish("NEW_VOTE", newVote);

      return newVote;
    }
}

module.exports = Mutation;