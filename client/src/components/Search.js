import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import Link from './Link';
import { FEED_SEARCH_QUERY } from '../queries';

const Search = () => {
  const [results, setResults] = useState({ queryDone: false, found: false });
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY, {
    onCompleted: () => {
      if (data.feed.links.length < 1) {
        setResults({ queryDone: true, found: false });
      } else setResults({ queryDone: true, found: true });
    }
  });

  return (
    <>
      <div>
        Search
      <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() => executeSearch({
            variables: { type: 'search-feed', filter: searchFilter }
          })
          }
        >
          Ok
        </button>
      </div>
      <div className="link-search">
        {data &&
          data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
      </div>
      {results.queryDone && !results.found && <h2>Ekkert fannst :/</h2>}
    </>
  );
};

export default Search;