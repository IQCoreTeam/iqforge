// components/templates/index.ts
// Single place that maps a template id to its render component.
import type { TemplateRenderProps } from "@/lib/types";
import { CreatorProfile } from "./creator-profile";
import { DigitalNomad } from "./digital-nomad";
import { SolanaMaximalist } from "./solana-maximalist";
import { StartupAbout } from "./startup-about";
import { AgencyShowcase } from "./agency-showcase";
import { MemeCoinLauncher } from "./meme-coin-launcher";
import { TokenDashboard } from "./token-dashboard";
import { StealthLaunch } from "./stealth-launch";
import { NftCollectionHub } from "./nft-collection-hub";
import { PfpGallery } from "./pfp-gallery";
import { GenerativeArtDrop } from "./generative-art-drop";
import { DaoPortal } from "./dao-portal";
import { CommunityHub } from "./community-hub";
import { DevPortfolio } from "./dev-portfolio";
import { CreatorResume } from "./creator-resume";
import { ProductLaunch } from "./product-launch";
import { ProtocolLanding } from "./protocol-landing";
import { OnchainJournal } from "./onchain-journal";

export const TEMPLATE_COMPONENTS: Record<
  string,
  (props: TemplateRenderProps) => JSX.Element
> = {
  "creator-profile": CreatorProfile,
  "digital-nomad": DigitalNomad,
  "solana-maximalist": SolanaMaximalist,
  "startup-about": StartupAbout,
  "agency-showcase": AgencyShowcase,
  "meme-coin-launcher": MemeCoinLauncher,
  "token-dashboard": TokenDashboard,
  "stealth-launch": StealthLaunch,
  "nft-collection-hub": NftCollectionHub,
  "pfp-gallery": PfpGallery,
  "generative-art-drop": GenerativeArtDrop,
  "dao-portal": DaoPortal,
  "community-hub": CommunityHub,
  "dev-portfolio": DevPortfolio,
  "creator-resume": CreatorResume,
  "product-launch": ProductLaunch,
  "protocol-landing": ProtocolLanding,
  "onchain-journal": OnchainJournal,
};
