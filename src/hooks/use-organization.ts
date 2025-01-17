import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import routes from '@/constants/routes';
import { Organization, OrganizationRole } from '@/services/protocol-v3/types';
import { getOrg } from '@/utils/currentOrg';
import { PartialDeep } from 'type-fest';

type UseOrganizationTruthyResponse = {
  isOrg: true;
  pathnameOrg: string;
  canEdit: boolean;
  role: OrganizationRole;
  organization: PartialDeep<Organization>;
};

type UseOrganizationFalsyResponse = {
  [key in keyof Omit<UseOrganizationTruthyResponse, 'isOrg'>]: undefined;
} & {
  isOrg: false;
};

/**
 * Hook to get the organization from the session, based on the current URL.
 *
 * @returns {Object} The organization object.
 * @returns {boolean} The isOrg boolean.
 * @returns {string} The pathnameOrg string.
 */
export default function useOrganization():
  | UseOrganizationTruthyResponse
  | UseOrganizationFalsyResponse {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isOrg = pathname?.includes(routes.dashboard.org.root);
  const pathnameOrg = isOrg ? pathname?.split('/')[3] : undefined;
  const { access, organization } = getOrg(session, pathnameOrg ?? null);

  const canEdit =
    access?.role === OrganizationRole.Admin ||
    access?.role === OrganizationRole.Owner;

  if (isOrg && pathnameOrg && access && organization) {
    return {
      isOrg,
      pathnameOrg,
      organization,
      canEdit,
      role: access?.role,
    };
  }

  return {
    isOrg: false,
    pathnameOrg: undefined,
    organization: undefined,
    canEdit: undefined,
    role: undefined,
  };
}
