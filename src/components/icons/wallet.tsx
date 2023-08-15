import { SvgIcon, SvgIconProps } from '@mui/material';

export function WalletIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.33366 5.33301H26.667C28.147 5.33301 29.3337 6.51967 29.3337 7.99967V23.9997C29.3337 25.4797 28.147 26.6663 26.667 26.6663H5.33366C3.85366 26.6663 2.66699 25.4797 2.66699 23.9997L2.68033 7.99967C2.68033 6.51967 3.85366 5.33301 5.33366 5.33301ZM8.66699 9.33301C7.56242 9.33301 6.66699 10.2284 6.66699 11.333C6.66699 12.4376 7.56242 13.333 8.66699 13.333H16.667C17.7716 13.333 18.667 12.4376 18.667 11.333C18.667 10.2284 17.7716 9.33301 16.667 9.33301H8.66699Z"
        fill="#3C0482"
      />
    </SvgIcon>
  );
}
