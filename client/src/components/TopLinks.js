import React, { useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY_ALL } from '../queries';
import { useHistory } from 'react-router';

const TopLinks = () => {
  const [found, setFound] = useState(false)
  const history = useHistory();

  const isTop = history.location.pathname.includes('top');

  // TODO raða linkum eftir lækum og birta aðeins þá
  const { data, loading, error } = useQuery(FEED_QUERY_ALL, {
    pollInterval: 30000, // Uppfærum síðuna á 30sek fresti til að fylgjast með breytingum
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setFound(false);
      } else setFound(true);
    }
  });

  return (
    <>
      {loading && <p>Sæki gögn...</p>}
      {error && <h2>Villa við að sækja gögn :(</h2>}
      { data && (
        <>
          {data.feed.links.map(
            (link, index) => (
              <Link key={link.id} link={link} index={index} isTop={isTop} />
            )
          )}
          {!found && <h2>Ekkert fannst :/</h2>}
        </>
      )}
    </>
  );
};

export default TopLinks;