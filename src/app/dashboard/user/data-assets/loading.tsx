
import PdaCardSkeleton from "@/components/pda-card/pda-card-skeleton";

import PDAsListContainer from "./components/pdas-list-container";

export default function DataAssetsLoadingPage() {
  return <PDAsListContainer>
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
    <PdaCardSkeleton />
  </PDAsListContainer>
}