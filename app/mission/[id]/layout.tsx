import { MissionProvider } from "@/contexts/mission-context";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function MissionPageLayout({ children, params }: Props) {
  const { id } = await params;

  return <MissionProvider missionId={id}>{children}</MissionProvider>;
}
