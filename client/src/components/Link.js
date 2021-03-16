import React from 'react';
import { useAuthToken } from './AuthToken';
import { timeDifferenceForDate } from "../utils";
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../mutations';
import { FEED_QUERY, FEED_QUERY_ALL } from "../queries";
import { getQueryVariables } from "../helperFunctions";

const Link = ({ link, page, index, isTop }) => {
  const [authToken, ,] = useAuthToken();

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    onError: (error) => console.info(error),
    // TODO uppfæra viðeigandi linka út frá vefslóð
    update(cache, { data: { vote } }) {
      // Þurfum að uppfæra cache-ið út frá hvaða "query" við kölluðum á
      const whatToRead = (isTop) ? { query: FEED_QUERY_ALL } : { query: FEED_QUERY, variables: getQueryVariables(page) };

      const { feed } = cache.readQuery(whatToRead);
      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      const whatToWrite = (isTop) ? {
        query: FEED_QUERY_ALL,
        data: {
          feed: {
            links: updatedLinks
          }
        }
      } : {
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: getQueryVariables(page)
      };

      cache.writeQuery(whatToWrite);
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