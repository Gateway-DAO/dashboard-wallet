import type { Meta, StoryObj } from '@storybook/react';

import ModalHeader from './modal-header';

const meta: Meta<typeof ModalHeader> = {
  title: 'Components/Modals/Modal Title',
  component: ModalHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModalHeader>;

export const Playground: Story = {
  args: {
    onClose: () => console.log('Closed'),
  },
};
