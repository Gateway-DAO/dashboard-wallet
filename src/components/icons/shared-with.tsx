import { SvgIcon, SvgIconProps } from '@mui/material';

export default function SharedWithIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.667 13.999c0-5.891 4.775-10.667 10.666-10.667h1.333c5.892 0 10.667 4.776 10.667 10.667v2h-2.666v-2a8 8 0 0 0-8-8h-1.334a8 8 0 0 0-8 8v14a1.333 1.333 0 1 1-2.667 0v-14Z"
      />
      <path
        fill="currentColor"
        d="M23.333 15.999v-2a6.667 6.667 0 0 0-6.666-6.667h-1.334a6.667 6.667 0 0 0-6.667 6.667v.666a1.333 1.333 0 0 0 2.667 0V14a4 4 0 0 1 4-4h1.333a4 4 0 0 1 4 4v2h2.667ZM11.333 19.999a3.333 3.333 0 0 0 3.333 3.333v2.667a6 6 0 0 1-6-6 1.333 1.333 0 1 1 2.667 0Z"
      />
      <path
        fill="currentColor"
        d="M12.666 14.678a3.346 3.346 0 1 1 6.692 0v1.32h-2.667v-1.32a.679.679 0 1 0-1.358 0v5.32a1.333 1.333 0 0 1-2.667 0v-5.32ZM25.333 28.904H18.68a1.333 1.333 0 0 1 0-2.667h6.653v-1.442a.774.774 0 0 1 1.322-.548l2.776 2.776a.774.774 0 0 1 0 1.095l-2.776 2.776a.774.774 0 0 1-1.322-.547v-1.443ZM21.69 24.24v-1.442h6.655a1.333 1.333 0 1 0 0-2.667H21.69v-1.443a.774.774 0 0 0-1.322-.547l-2.776 2.776a.774.774 0 0 0 0 1.095l2.776 2.776a.774.774 0 0 0 1.322-.548Z"
      />
    </SvgIcon>
  );
}
