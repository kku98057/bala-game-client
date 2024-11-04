import { DEFAULT_METADATA } from "@/app/enum";
type Props = {
  subTitle?: string;
  desc?: string;
};
export default function defaultMetaDatas({ subTitle, desc }: Props) {
  return {
    title: `${DEFAULT_METADATA.siteName} | ${
      subTitle || DEFAULT_METADATA.subTitle
    }`,
    description: desc || DEFAULT_METADATA.defaultDescription,
    openGraph: {
      title: `${DEFAULT_METADATA.siteName} | ${
        subTitle || DEFAULT_METADATA.subTitle
      }`,
      description: desc || DEFAULT_METADATA.defaultDescription,
    },
  };
}
