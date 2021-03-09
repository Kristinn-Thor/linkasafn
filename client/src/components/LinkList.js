import React, { useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../queries';
import { LINKS_PER_PAGE } from "../constants";
import { useHistory } from 'react-router';
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../subscriptions";


/*############################ Hjálparföll #############################*/
// Fall sem sér um að réttar breytur fylgi sql fyrirspurninni út frá því
// hvort við erum á síðunnni sem sýnir okkur nýjustu linka (/new/:page)
// eða top 10 vinsælustu linkana (/top)
const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const take = isNewPage ? LINKS_PER_PAGE : 10;
  const orderBy = { createdAt: 'desc' };
  return { take, skip, orderBy };
};

// Fall sem skilar okkur linkum sem eru raðaðir eftir vinsældum
// ef við erum ekki á /new vefslóð. Ef ekki fáum við gögnin í 
// þeirri röð sem fyrirspurnin í gagnagrunnin skilaði okkur.
const getLinksToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice(); // Afrit af linkunum
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};
/*######################################################################*/

const LinkList = () => {
  const history = useHistory();

  const [errorState, setError] = useState({
    error: false,
    message: 'Villa við að sækja gögn'
  });

  const isNewPage = history.location.pathname.includes('new');
  const pageIndexParams = history.location.pathname.split('/');
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  // Náum í linkana með því að senda gql fyrirspurn á serverinn
  const { data, loading, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
    onError: (error) => {
      setError({ ...errorState, error: true });
    }
  });

  // Gerumst "áskrifendur" á því þegar nýir linkar verða til
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });

  // Fylgjumst með fjölda atkvæða á rauntíma
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

  return (
    <>
      {loading && <p>Sæki gögn...</p>}
      {errorState.error && <p>{errorState.message}</p>}
      { data && (
        <>
          {getLinksToRender(isNewPage, data).map(
            (link, index) => (
              <Link key={link.id} link={link} index={index + pageIndex} />
            )
          )}
          {isNewPage && (
            <div className="pageNav" >
              <div className={`previousPage pageScroll ${page === 1 ? "hidden" : ""}`}
                onClick={() => {
                  if (page > 1) {
                    history.push(`/new/${page - 1}`);
                  }
                }}
              >
                Previous
            </div>
              <div className={`nextPage pageScroll ${page <= data.feed.count / LINKS_PER_PAGE ? "" : "hidden"}`}
                onClick={() => {
                  if (page <= data.feed.count / LINKS_PER_PAGE) {
                    const nextPage = page + 1;
                    history.push(`/new/${nextPage}`);
                  }
                }}
              >
                Next
            </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LinkList;