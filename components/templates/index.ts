// components/templates/index.ts
// Single place that maps a template id to its render component.
// Add one line here when you ship a new template.
import type { TemplateRenderProps } from "@/lib/types";
import { CreatorProfile } from "./creator-profile";
import { MemeCoinLauncher } from "./meme-coin-launcher";
import { NftCollectionHub } from "./nft-collection-hub";
import { TokenDashboard } from "./token-dashboard";

export const TEMPLATE_COMPONENTS: Record<
  string,
  (props: TemplateRenderProps) => JSX.Element
> = {
  "creator-profile": CreatorProfile,
  "meme-coin-launcher": MemeCoinLauncher,
  "nft-collection-hub": NftCollectionHub,
  "token-dashboard": TokenDashboard,
};
