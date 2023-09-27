import Link from 'next/link';
import { FC } from 'react';

import { CONTAINER_PX } from '@/theme/config/style-tokens';

import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  SvgIconProps,
  Typography,
} from '@mui/material';

type Props = {
  name: string;
  href: string;
  active?: boolean;
  icon: FC<SvgIconProps>;
  activeIcon?: FC<SvgIconProps>;
};

export type GTWMenuItemSettings = Props & {
  activeHrefs: string[];
};

export default function GTWMenuItem({
  icon: Icon,
  href,
  name,
  active,
  activeIcon: ActiveIcon,
  ...props
}: Props & ListItemButtonProps) {
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        component={Link}
        href={href}
        underline={'none'}
        {...props}
        sx={{
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          direction: 'row',
          gap: 2,
          pl: {
            xs: CONTAINER_PX.xs + 0.5,
            md: CONTAINER_PX.md + 0.5,
            lg: 3,
          },
          pr: 2.5,
          ':hover': {
            svg: {
              color: 'primary.main',
            },
            span: {
              color: 'black',
            },
          },
          ...(active && {
            color: 'black',
            svg: {
              color: 'primary.main',
            },
          }),
          ...props.sx,
        }}
      >
        {active && ActiveIcon ? (
          <ActiveIcon sx={{ fontSize: 32 }} />
        ) : (
          <Icon sx={{ fontSize: 32 }} />
        )}
        <Typography
          component={'span'}
          variant="subtitle1"
          sx={{ fontSize: '1rem' }}
        >
          {name}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}
