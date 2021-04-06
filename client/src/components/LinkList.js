import React, { useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../queries';
import { LINKS_PER_PAGE } from "../constants";
import { useHistory } from 'react-router';
import { getQueryVariables } from "../helperFunctions";
import Loader from './Loader';

const LinkList = () => {
  const history = useHistory();
  const [found, setFound] = useState(false);

  const pageIndexParams = history.location.pathname.split('/');
  let page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  if (page < 1) page = 1;
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  // Náum í linkana með því að senda gql fyrirspurn á serverinn
  const { data, loading, error } = useQuery(FEED_QUERY, {
    fetchPolicy: 'network-only', // Ath. notum ekki cache fyrir main-feed, á eftir að finna lausn á TypePolicies villu
    variables: getQueryVariables(page, 'main-feed'),
    pollInterval: 30000,
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setFound(false);
      } else setFound(true);
    }
  });
  /* Ath. notum ekki cache fyrir main-feed, á eftir að finna lausn á TypePolicies villu
  fetchMore({
    variables: getQueryVariables(page, 'main-feed')
  });
  */
  if (loading) return <Loader />;

  return (
    <>
      {error && <h2 className="error-message">Villa við að sækja gögn :(</h2>}
      { data && (
        <>
          <div className="link-list">
            {data.feed.links.map(
              (link, index) => (
                <Link key={link.id} link={link} index={index + pageIndex} page={page} />
              )
            )}
          </div>
          <div className="pageNav" >
            <button className={`previousPage pageScroll ${page === 1 ? "hidden" : ""}`}
              onClick={() => {
                if (page > 1) {
                  history.push(`/new/${page - 1}`);
                }
              }}
            >
              Til baka
            </button>
            <button className={`nextPage pageScroll ${page < data.feed.count / LINKS_PER_PAGE ? "" : "hidden"}`}
              onClick={() => {
                if (page < data.feed.count / LINKS_PER_PAGE) {
                  history.push(`/new/${page + 1}`);
                }
              }}
            >
              Næsta síða
          </button>
          </div>

          {!found && <h2 className="error-message">Engir linkar fundust</h2>}
        </>

      )}
    </>
  );
};

export default LinkList;