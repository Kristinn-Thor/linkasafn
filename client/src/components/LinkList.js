import React, { useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from '../queries';
import { LINKS_PER_PAGE } from "../constants";
import { useHistory } from 'react-router';
import { getQueryVariables } from "../helperFunctions";

const LinkList = () => {
  const history = useHistory();
  const [found, setFound] = useState(false)

  const pageIndexParams = history.location.pathname.split('/');
  let page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  if (page < 1) page = 1;
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  // Náum í linkana með því að senda gql fyrirspurn á serverinn
  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(page),
    pollInterval: 30000,
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setFound(false);
      } else setFound(true);
    }
  });

  // Ef við skilgreinum ekki fetchMore fallið þá veit Apollo Clientinn ekki hvaða
  // niðurstöðu á að birta úr cache-inu þegar búið er að ná í alla linkana,
  // heldur birtir okkur niðurstöðuna úr síðustu fyrirspurn.
  fetchMore({
    variables: getQueryVariables(page)
  })

  return (
    <>
      {loading && <p>Sæki gögn...</p>}
      {error && <h2>Villa við að sækja gögn :(</h2>}
      { data && (
        <>
          {data.feed.links.map(
            (link, index) => (
              <Link key={link.id} link={link} index={index + pageIndex} page={page} />
            )
          )}
          <div className="pageNav" >
            <div className={`previousPage pageScroll ${page === 1 ? "hidden" : ""}`}
              onClick={() => {
                if (page > 1) {
                  history.push(`/new/${page - 1}`);
                }
              }}
            >
              Til baka
            </div>
            <div className={`nextPage pageScroll ${page <= data.feed.count / LINKS_PER_PAGE ? "" : "hidden"}`}
              onClick={() => {
                if (page <= data.feed.count / LINKS_PER_PAGE) {
                  const nextPage = page + 1;
                  history.push(`/new/${nextPage}`);
                }
              }}
            >
              Næsta síða
            </div>
          </div>
          {!found && <h2>Ekkert fannst :/</h2>}
        </>
      )}
    </>
  );
};

export default LinkList;