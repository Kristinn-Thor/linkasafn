import React from 'react';
import { useAuthToken } from './AuthToken';
import { timeDifferenceForDate } from "../utils";
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../mutations';
import { FEED_QUERY, FEED_QUERY_TOP } from "../queries";
import { getQueryVariables, readLinksAndUpdateQuery } from "../helperFunctions";
import { useHistory } from 'react-router';

const Link = ({ link, page, index }) => {
  const [authToken, ,] = useAuthToken();
  const history = useHistory();

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
    <div className="links">
      <div className="links-index">
        <span> {index + 1}. </span>
        <div className="links-vote" onClick={() => {
          if (authToken) {
            vote();
          } else {
            history.push('/login');
          }

        }}>
          ▲
          </div>
      </div>
      <div className="links-content">
        <div className="links-text">
          {link.description} - <a className="links-url" href={"https://" + link.url}>{link.url}</a>
        </div>
        <div className="links-info">
          {link.votes.length} atkvæði | {link.postedBy.name} setti inn link. {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;