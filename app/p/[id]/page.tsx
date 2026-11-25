import PublicCampaign from "./public-campaign";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicCampaign id={id} />;
}
