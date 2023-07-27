import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux'; 
import Table from './Table';
import {store} from '../../store'; 

export default {
  title: 'Table',
  component: Table,
} as Meta;

const Template: Story = (args) => (
  <Provider store={store}>
    <Table {...args} />
  </Provider>
);

export const Default = Template.bind({});
