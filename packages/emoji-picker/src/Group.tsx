import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import { GROUP_KEY_COMMONLY_USED } from './constants';
import { CommonMode, GroupKey } from './types';
import Context from './Context';

export interface GroupProps {
  active: boolean;
  children: React.ReactNode;
  commonMode: CommonMode;
  group: GroupKey;
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Group({ active, children, commonMode, group, onSelect }: GroupProps) {
  const { classNames, messages } = useContext(Context);
  const key = camelCase(group === GROUP_KEY_COMMONLY_USED ? commonMode : group);
  const className = [classNames.group];

  if (active) {
    className.push(classNames.groupActive);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSelect(group, event);
  };

  return (
    <button
      className={className.join(' ')}
      title={messages[key]}
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
