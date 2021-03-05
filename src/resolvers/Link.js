function postedBy(parent, args, context) {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy()
}

function votes(parent, args, context) {
  context.prisma.link.findUnique({ where: { id: parent.is } }).votes();
}

module.exports = {
  postedBy,
  votes
}