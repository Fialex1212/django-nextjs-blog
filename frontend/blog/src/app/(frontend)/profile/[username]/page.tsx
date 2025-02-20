import ProfileByUsername from "@/components/Profile/ProfileByUsername";

export default function ProfilePageByUsername({
  params,
}: {
  params: { username: string };
}) {
  return <ProfileByUsername username={params.username} />;
}
