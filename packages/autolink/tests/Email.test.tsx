import React from 'react';
import { render } from 'rut-dom';
import Email, { EmailProps } from '../src/Email';
import Link from '../src/Link';

describe('components/Email', () => {
  it('can pass props to Link', () => {
    const func = () => {};
    const { root } = render<EmailProps>(
      <Email
        email="user@domain.com"
        emailParts={{ host: '', username: '' }}
        onClick={func}
        newWindow
      >
        user@domain.com
      </Email>,
    );

    expect(root.findOne(Link)).toHaveProp('newWindow', true);
    expect(root.findOne(Link)).toHaveProp('onClick', func);
  });
});
