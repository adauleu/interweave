import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface HashtagProps extends Partial<LinkProps> {
  children: ChildrenNode;
  encodeHashtag?: boolean;
  hashtag: string;
  hashtagUrl?: string | ((hashtag: string) => string);
  preserveHash?: boolean;
}

export default function Hashtag({
  children,
  encodeHashtag = false,
  hashtag,
  hashtagUrl = '{{hashtag}}',
  preserveHash = false,
  ...props
}: HashtagProps) {
  let tag = hashtag;

  // Prepare the hashtag
  if (!preserveHash && tag.charAt(0) === '#') {
    tag = tag.slice(1);
  }

  if (encodeHashtag) {
    tag = encodeURIComponent(tag);
  }

  // Determine the URL
  let url = hashtagUrl || '{{hashtag}}';

  if (typeof url === 'function') {
    url = url(tag);
  } else {
    url = url.replace('{{hashtag}}', tag);
  }

  return (
    <Link {...props} href={url}>
      {children}
    </Link>
  );
}
