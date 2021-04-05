import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import Link from './Link';
import { FEED_SEARCH_QUERY } from '../queries';
import Loader from './Loader';

const Search = () => {
  const [results, setResults] = useState({ queryDone: false, found: false });
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data, loading }] = useLazyQuery(FEED_SEARCH_QUERY, {
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setResults({ queryDone: true, found: false });
      } else setResults({ queryDone: true, found: true });
    }
  });

  if (loading) return <Loader />;

  return (
    <>
      <div className="search-box">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Sláðu inn leitarstreng"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <div className="search-bar-underline"></div>
        </div>
        <button
          className="button"
          onClick={() => executeSearch({
            variables: { type: 'search-feed', filter: searchFilter }
          })
          }
        >
          Hefja leit
        </button>
      </div>
      <div className="link-search">
        {data &&
          data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
      </div>
      {results.queryDone && !results.found && <h2 className="error-message">Ekkert fannst 💩</h2>}
    </>
  );
};

export default Search;