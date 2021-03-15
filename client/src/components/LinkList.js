import React from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../queries';
import { LINKS_PER_PAGE } from "../constants";
import { useHistory } from 'react-router';
import { getQueryVariables } from "../helperFunctions";

const LinkList = () => {
  const history = useHistory();

  const isNewPage = history.location.pathname.includes('new');
  const pageIndexParams = history.location.pathname.split('/');
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  // Náum í linkana með því að senda gql fyrirspurn á serverinn
  const { client, data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
    pollInterval: 2000,
    onCompleted: () => { console.info(client.cache.data); }
  });

  // Ef við skilgreinum ekki fetchMore fallið þá veit Apollo Clientinn ekki hvaða
  // niðurstöðu á að birta úr cache-inu þegar búið er að ná í alla linkana,
  // heldur birtir okkur niðurstöðuna úr síðustu fyrirspurn.
  fetchMore({
    variables: getQueryVariables(isNewPage, page)
  })

  return (
    <>
      {loading && <p>Sæki gögn...</p>}
      {error && <p>{error.message}</p>}
      { data && (
        <>
          {console.info(data)}
          {data.feed.links.map(
            (link, index) => (
              <Link key={link.id} link={link} index={index + pageIndex} isNewPage={isNewPage} page={page} />
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