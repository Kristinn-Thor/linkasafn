import React from 'react';
import { useAuthToken } from './AuthToken';
import { timeDifferenceForDate } from "../utils";
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../mutations';
import { FEED_QUERY, FEED_QUERY_TOP } from "../queries";
import { getQueryVariables, readLinksAndUpdateQuery } from "../helperFunctions";

const Link = ({ link, page, index }) => {
  const [authToken, ,] = useAuthToken();

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    onError: (error) => console.info(error.message),
    update(cache, { data: { vote } }) {
      // Uppfærum cache-ið fyrir báðar fyrirspurnir 
      const feedQueryAll = {
        query: FEED_QUERY_TOP,
        variables: { type: 'top-feed', skip: 0, take: 20, orderBy: { votesCount: 'desc' } }
      };
      const feedQuery = {
        query: FEED_QUERY,
        variables: getQueryVariables(page, 'main-feed')
      };
      readLinksAndUpdateQuery(feedQueryAll, cache, link, vote);
      readLinksAndUpdateQuery(feedQuery, cache, link, vote);
    }
  });

  return (
    <>
      <div className="links">
        <div className="links-index">
          <span> {index + 1}. </span>
          {authToken && (
            <div className="links-vote" onClick={vote}>
              ▲
            </div>
          )}
        </div>
        <div className="links-content">
          <div className="links-text">
            {link.description} ({link.url})
      </div>
          {authToken && (
            <div className="links-info">
              {link.votes.length} votes | by {link.postedBy.name} {timeDifferenceForDate(link.createdAt)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Link;