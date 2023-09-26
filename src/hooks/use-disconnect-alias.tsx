import { useSession } from 'next-auth/react';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';

import routes from '@/constants/routes';
import { useToggle } from '@react-hookz/web';

export type AliasType =
  | 'email'
  | 'wallet'
  | 'Google'
  | 'Discord'
  | 'Github'
  | 'Twitter';

type Alias = {
  type: AliasType;
  address?: string;
};

export function useDisconnectAlias() {
  const { data: session } = useSession();
  const [openModalRight, setOpenModalRight] = useToggle(false);
  const [dataToDisconnect, setDataToDisconnect] = useState<Alias | null>(null);
  const router = useRouter();

  const openModal = () => {
    router.push(`#deactivate-gateway-id`, { scroll: false });
    setOpenModalRight(true);
  };

  const closeModal = () => {
    router.push(routes.dashboardUserSettings, { scroll: false });
    setOpenModalRight(false);
    setDataToDisconnect(null);
  };

  const deactivateGatewayId = () => {
    disconnectAlias({
      type: dataToDisconnect?.type as AliasType,
      address: dataToDisconnect?.address,
    });
    console.log('Gateway ID deactivated!');
    setDataToDisconnect(null);
  };

  const handleDisconnectAlias = ({ type, address }: Alias) => {
    if (session?.user?.authentications?.length === 1) {
      openModal();
      setDataToDisconnect({ type, address });
    } else {
      disconnectAlias({ type, address });
    }
  };

  const disconnectAlias = ({ type, address }: Alias) => {
    if (type === 'email') disconnectEmail(address as string);
    if (type === 'wallet') disconnectWallet(address as string);
    if (type === 'Discord') disconnectDiscord();
    if (type === 'Twitter') disconnectTwitter();
  };

  const disconnectEmail = (address: string) => {
    console.log('Email disconnected!', address);
  };

  const disconnectWallet = (address: string) => {
    console.log('Wallet disconnected!', address);
  };

  const disconnectDiscord = () => {
    console.log('Discord disconnected!');
  };

  const disconnectTwitter = () => {
    console.log('Twitter disconnected!');
  };

  return {
    handleDisconnectAlias,
    deactivateGatewayId,
    closeModal,
    openModalRight,
  };
}
