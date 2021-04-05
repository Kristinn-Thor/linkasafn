import React, { useState } from 'react';
import Link from './Link';
import { useQuery } from '@apollo/client';
import { FEED_QUERY_TOP } from '../queries';
import { useHistory } from 'react-router';
import Loader from './Loader';

const TopLinks = () => {
  const [found, setFound] = useState(false);
  const history = useHistory();
  const isTop = history.location.pathname.includes('top');

  const { data, loading, error } = useQuery(FEED_QUERY_TOP, {
    variables: {
      type: 'top-feed',
      skip: 0,
      take: 20,
      orderBy: { votesCount: 'desc' }
    },
    pollInterval: 30000, // Uppfærum síðuna á 30sek fresti til að fylgjast með breytingum
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setFound(false);
      } else setFound(true);
    }
  });

  if (loading) return <Loader />

  return (
    <>
      {error && <h2 className="error-message">Villa við að sækja gögn :(</h2>}
      { data && (
        <div className="top-links">
          {data.feed.links.map(
            (link, index) => (
              <Link key={link.id} link={link} index={index} isTop={isTop} />
            )
          )}
          {!found && <h2 className="error-message">Ekkert fannst 💩</h2>}
        </div>
      )}
    </>
  );
};

export default TopLinks;