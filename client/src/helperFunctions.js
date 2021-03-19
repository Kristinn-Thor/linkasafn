import { LINKS_PER_PAGE } from "./constants";

// Fall sem sér um að réttar breytur fylgi sql fyrirspurninni út frá því
// hvort við erum á síðunnni sem sýnir okkur nýjustu linka (/new/:page)
// eða top 10 vinsælustu linkana (/top)
export const getQueryVariables = (page, type) => {
  const skip = (page - 1) * LINKS_PER_PAGE;
  const take = LINKS_PER_PAGE;
  const orderBy = { createdAt: 'desc' };
  if (page) return { type, take, skip, orderBy };
  return {}
};

// Fall sem les cache-aða fyrirspurn af linkum, uppfærir atkvæðin
// fyrir linkana og skrifar uppfærða fyrirspurn aftur í cache-ið
export const readLinksAndUpdateQuery = (query, cache, link, vote) => {
  if (!cache.readQuery(query)) return; // Er fyrirspurnin til í cache-inu?
  const { feed } = cache.readQuery(query);
  const updatedLinks = feed.links.map((feedLink) => {
    if (feedLink.id === link.id) {
      return {
        ...feedLink,
        votes: [...feedLink.votes, vote]
      };
    }
    return feedLink;
  });
  const updatedQuery = {
    ...query,
    data: {
      feed: {
        links: updatedLinks
      }
    },
  }
  cache.writeQuery(updatedQuery);
};







