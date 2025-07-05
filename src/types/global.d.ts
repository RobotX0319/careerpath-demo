declare module "*.json" {
  const value: any;
  export default value;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };
}

declare module "next/link" {
  import { ReactNode } from "react";
  interface LinkProps {
    href: string;
    children: ReactNode;
    className?: string;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
}