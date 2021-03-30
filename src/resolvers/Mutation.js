const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { getUserId, validatePassword } = require('../utils');

const Mutation = {
  signup:
    async function signup(parent, args, context, info) {
      // --- Validation & Sanitization --- //
      if (args.name === '' ||
        !(validator.isAlpha(args.name) && validator.isLength(args.name, { min: 2, max: 50 })))
        throw new Error('Notandanafn ógilt');

      if (args.email === '' || !validator.isEmail(args.email)) throw new Error('Netfang ógilt');
      const email = validator.normalizeEmail(args.email);

      if (args.password === '' || !validatePassword(args.password)) throw new Error('Lykilorð ógilt');
      // __________________________________//
      const exists = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (exists) throw new Error('Notandi þegar skráður');
      const password = await bcrypt.hash(args.password, 10);
      const user = await context.prisma.user.create({ data: { ...args, email, password } });
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
      // --- Validation --- //
      if (!validator.isURL(args.url)) throw new Error('Linkur þarf að vera URL');
      let validURL = args.url.replace('http://', '');
      validURL = validURL.replace('https://', '');
      validURL = validURL.replace('www.', '');
      // ______________________
      const newLink = await context.prisma.link.create({
        data: {
          url: validURL,
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