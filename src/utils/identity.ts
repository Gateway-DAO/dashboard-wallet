import { Maybe, Organization, User } from '@/services/protocol-v3/types';

export type Identity = {
  did: string;
  username?: Maybe<string>;
  image?: Maybe<string>;
};

export const getIdentity = ({
  organization,
  user,
}: {
  organization?: Maybe<Organization>;
  user: User;
}): Identity => ({
  did: organization?.did ?? user.did,
  username: organization?.orgname ?? user.username,
  image: organization?.image,
});
