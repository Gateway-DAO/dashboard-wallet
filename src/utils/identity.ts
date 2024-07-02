import { Maybe, Organization, User } from '@/services/protocol-v3/types';

export const getIdentity = ({
  organization,
  user,
}: {
  organization?: Maybe<Organization>;
  user: User;
}) => ({
  did: organization?.did ?? user.did,
  username: organization?.orgname ?? user.username,
});
