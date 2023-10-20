'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useToggle } from '@react-hookz/web';

import { MenuOutlined } from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';

import GTWMenuItem, { GTWMenuItemSettings } from './menu-item/menu-item';

type Props = {
  menuItems: GTWMenuItemSettings[];
  secondMenuItems?: GTWMenuItemSettings[];
};

/**
 * List all menu items of the mobile user dashboard
 */
export default function MenuBottomListItems({
  menuItems,
  secondMenuItems,
}: Props) {
  const activePath = usePathname();
  const [isHamburgerVisible, toggleHamburgerVisible] = useToggle();

  const bottomBarMenu = useMemo(
    () => menuItems.filter((item) => !item.hamburger),
    [menuItems]
  );
  const hamburgerMenu = useMemo(
    () => menuItems.filter((item) => item.hamburger),
    [menuItems]
  );

  const secondHamburguerMenu = useMemo(
    () => secondMenuItems?.filter((item) => item.hamburger),
    [secondMenuItems]
  );

  const onClose = () => toggleHamburgerVisible(false);

  return (
    <>
      <BottomNavigation
        value={activePath}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: {
            xs: 'flex',
            lg: 'none',
          },
          zIndex: 10,
        }}
      >
        {bottomBarMenu.map(
          ({ icon: Icon, activeIcon: ActiveIcon, activeHrefs, ...item }) => {
            const isActive = activeHrefs.some((path) =>
              activePath.includes(path)
            );
            return (
              <BottomNavigationAction
                key={item.name}
                component={Link}
                href={item.href}
                label={item.name}
                value={item.href}
                aria-label={item.name}
                icon={isActive && ActiveIcon ? <ActiveIcon /> : <Icon />}
                onClick={onClose}
              />
            );
          }
        )}
        <BottomNavigationAction
          label="More items"
          aria-label="More items"
          icon={<MenuOutlined />}
          onClick={toggleHamburgerVisible}
        />
      </BottomNavigation>
      <Drawer
        anchor="bottom"
        open={isHamburgerVisible}
        onClose={onClose}
        sx={{
          '&, .MuiDrawer-paper, .MuiModal-backdrop': { bottom: 56 },
          '.MuiDrawer-paper': {
            borderRadius: '24px 24px 0 0',
            boxShadow: 'none',
            borderBottom: 1,
            borderBottomColor: 'divider',
            py: 4,
          },
        }}
      >
        {hamburgerMenu.map(({ activeHrefs, ...item }) => (
          <GTWMenuItem
            key={item.name}
            active={activeHrefs.some((path) => activePath.includes(path))}
            onClick={onClose}
            sx={{ mb: 1 }}
            {...item}
          />
        ))}

        {secondMenuItems && secondHamburguerMenu && (
          <Stack mt={5}>
            <Typography variant="caption" px={4} mb={1}>
              Developers
            </Typography>
            {secondHamburguerMenu?.map(({ activeHrefs, ...item }) => (
              <GTWMenuItem
                key={item.name}
                active={activeHrefs.some((path) => activePath.includes(path))}
                onClick={onClose}
                sx={{ mb: 1 }}
                {...item}
              />
            ))}
          </Stack>
        )}
      </Drawer>
    </>
  );
}

{
  /* {hamburgerMenu.map(
          ({ icon: Icon, activeIcon: ActiveIcon, activeHrefs, ...item }) => {
            const isActive = activeHrefs.some((path) =>
              activePath.includes(path)
            );
            return (
              <BottomNavigationAction
                key={item.name}
                component={Link}
                href={item.href}
                label={item.name}
                value={item.href}
                aria-label={item.name}
                icon={isActive && ActiveIcon ? <ActiveIcon /> : <Icon />}
                onClick={onClose}
              />
            );
          }
        )} */
}
