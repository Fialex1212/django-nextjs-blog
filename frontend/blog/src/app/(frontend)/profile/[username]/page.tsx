// app/(frontend)/profile/[username]/page.tsx (Server Component)
import ProfileByUsername from "@/components/Profile/ProfileByUsername";

export default async function ProfilePageByUsername({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfileByUsername username={username} />;
}