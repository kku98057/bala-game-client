import { DEFAULT_METADATA } from "@/app/enum";
type Props = {
  desc?: string;
};
export default function defaultMetaDatas({ desc }: Props) {
  return {
    title: `${DEFAULT_METADATA.siteName} 
    }`,
    description: desc || DEFAULT_METADATA.defaultDescription,
    openGraph: {
      title: `${DEFAULT_METADATA.siteName}
      }`,
      description: desc || DEFAULT_METADATA.defaultDescription,
    },
  };
}
