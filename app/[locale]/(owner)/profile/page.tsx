import { getUserData } from "@/server/auth";
import { getTranslations } from "next-intl/server";
import ProfileForm from "./components/ProfileForm";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const userData = await getUserData();

  if (!userData.data) {
    return (
      <div className="flex-1 p-8">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        </div>
      </div>
      <div className="max-w-4xl">
        <ProfileForm initialData={userData.data} />
      </div>
    </div>
  );
}
