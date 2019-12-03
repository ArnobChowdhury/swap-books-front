import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Interest from './Interest';
import {ButtonProps} from './Interest';

export const props: ButtonProps = {
  text: 'A task'
}

storiesOf('Interest Button', module)
  .add('default', () => <Interest {...props} />);