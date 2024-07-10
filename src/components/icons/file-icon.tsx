import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export default function FileIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 144 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path fill="#C7BCD4" d="M137.957 60.047l-54-54v54h54z" />
      <path
        fill="#fff"
        d="M0 0h72c9.941 0 18 8.059 18 18v36h36c9.941 0 18 8.059 18 18v108H0V0z"
      />
    </SvgIcon>
  );
}
