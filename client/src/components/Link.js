import React from 'react';
import { useAuthToken } from './AuthToken';
import { timeDifferenceForDate } from "../utils";
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../mutations';
import { FEED_QUERY } from "../queries";
import { getQueryVariables } from "../helperFunctions";

const Link = (props) => {
  const [authToken, ,] = useAuthToken();
  const { link } = props;
  const { page } = props;

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    onError: (error) => console.info(error),
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: getQueryVariables(page)
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: getQueryVariables(page)
      });
    }
  });

  return (
    <>
      <div className="links">
        <div className="links-index">
          <span> {props.index + 1}. </span>
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