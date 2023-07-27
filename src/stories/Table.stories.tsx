import React from 'react';
import { Story, Meta } from '@storybook/react';
import Table from '../Components/Table/Table';

export default {
  title: 'Table',
  component: Table,
} as Meta;

const Template: Story = (args) => <Table {...args} />;

export const Default = Template.bind({});
