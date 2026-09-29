import type { SVGProps } from "react";
import type { ProjectIcon } from "./config";

type IconName = ProjectIcon | "wallet" | "wrench" | "cloud";

const paths: Record<IconName, JSX.Element> = {
  rocket: (
    <path
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Zm12-9-4.5 4.5M21 3c0 6-3.5 9.5-9 12-3-1.5-5.5-4-7-7C7.5 3 11 0 17 0c2 0 4 0 4 3Zm-5 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
      transform="translate(1.5 1.5) scale(0.83)"
    />
  ),
  briefcase: (
    <path
      d="M3 8h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm3-5h12a1 1 0 0 1 1 1v4H5V4a1 1 0 0 1 1-1Zm5 9v3m-9 1h22"
      transform="translate(0 1)"
    />
  ),
  server: (
    <path
      d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm0 11h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm3 3.5h2m8 0h2M7 6.5h2"
      transform="translate(0 0.5)"
    />
  ),
  wallet: (
    <path
      d="M3 7h15a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0V5a2 2 0 0 1 2-2h11m-2 4v4m-9 3h6m9.5-3.5h-3a1.5 1.5 0 0 0 0 3h3a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5Z"
      transform="translate(0.5 1)"
    />
  ),
  wrench: (
    <path
      d="M14.7 6.3a4 4 0 1 0 5 5L21 21H3l7.7-7.7a4 4 0 0 1 4-9.7Z"
      transform="translate(0 0.5) scale(0.92)"
    />
  ),
  cloud: (
    <path
      d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19h11Z"
      transform="translate(0.5 1.5)"
    />
  ),
};

export function Icon({
  name,
  ...props
}: { name: IconName } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
