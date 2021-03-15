import { LINKS_PER_PAGE } from "./constants";

// Fall sem sér um að réttar breytur fylgi sql fyrirspurninni út frá því
// hvort við erum á síðunnni sem sýnir okkur nýjustu linka (/new/:page)
// eða top 10 vinsælustu linkana (/top)
export const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const take = isNewPage ? LINKS_PER_PAGE : 10;
  const orderBy = { createdAt: 'desc' };
  return { take, skip, orderBy };
};

// Fall sem skilar okkur linkum sem eru raðaðir eftir vinsældum
// ef við erum ekki á /new vefslóð. Ef ekki fáum við gögnin í 
// þeirri röð sem fyrirspurnin í gagnagrunnin skilaði okkur.
export const getLinksToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice(); // Afrit af linkunum
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};