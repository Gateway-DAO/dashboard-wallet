import { Chain } from '@/services/protocol/types';

export const common = {
  general: {
    gateway: 'Gateway',
    received: 'Received',
    issued: 'Issued',
    status: 'Status',
    created_at: 'Created at',
    created_by: 'Created by',
    updated_at: 'Updated at',
    sent: 'Sent',
    wallet: 'Wallet',
    other_accounts: 'Other accounts',
    email: 'Email',
    avatar: 'Avatar',
    username: 'Username',
    name: 'Name',
    success_copy_message: 'Copied to clipboard',
    optional: 'Optional',
    alert_important: 'This is extremely important',
    success: 'Success',
    developers: 'Developers',
    overview: 'Overview',
    show_more: 'Show more',
    tags: 'Tags',
    sort_by: 'Sort by',
    claim: 'Claim',
    cancel: 'Cancel',
    details: 'Details',
    review: 'Review',
    sandbox: 'Sandbox',
    mainnet: 'MainNet',
    testnet: 'TestNet',
  },
  chain: {
    EVM: 'Ethereum',
    SOL: 'Solana',
  } as Record<Chain, string>,
  actions: {
    accept: 'Accept',
    reject: 'Reject',
    save: 'Save',
    cancel: 'Cancel',
    check_data_proof: 'Check shared data',
    share_now: 'Share now',
    share_a_copy: 'Share',
    revoke_access: 'Revoke access',
    hide_activity: 'Hide Activity',
    show_activity: 'See Activity',
    learn_more: 'Learn more',
    check_now: 'Check now',
    copy: 'Copy',
    copy_url: 'Copy URL',
    connect_now: 'Connect now',
    back_to_home: 'Back to home',
    close: 'Close',
    show: 'Show',
    hide: 'Hide',
    more_info: 'More info',
    less_info: 'Less info',
    connect: 'Connect',
    disconnect: 'Disconnect',
    crop: 'Crop',
    revoke: 'Revoke',
    suspend: 'Suspend',
    make_valid: 'Make valid',
    create_id: 'Create ID',
    continue: 'Continue',
    verify: 'Verify',
    view_more: 'View more',
    code_send_again: 'Send code again',
    load_more: 'Load more',
    view_pda: 'View PDA',
    view_proof: 'View Proof',
    subscribe: 'Subscribe',
    clear_filters: 'Clear filters',
    edit: 'Edit',
    add: 'Add',
    add_row: 'Add row',
    issue_now: 'Issue now',
    done: 'Done',
    try_again: 'Try again',
  },
  socials: {
    twitter: 'Twitter',
    google: 'Google',
    github: 'Github',
    discord: 'Discord',
  },
  newsletter: {
    title: 'Subscribe to our newsletter',
    subtitle: 'Receive news about developments and updates.',
    label: 'Email',
  },
  identifier: {
    type: 'Account type',
    value: 'Address',
    types: {
      username: 'Username',
      email: 'Email',
      did: 'DID',
      evm_wallet: 'EVM Wallet',
      solana_wallet: 'Solana Wallet',
    },
  },
};
