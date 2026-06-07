"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ProfilePhotoSection from "./ProfilePhotoSection";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";

export default function CompleteProfileForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    picture: "",
    username: "",
    age: "",
    stream: "",
    standard: "",
    favouriteSubject: "",
  });

  useEffect(() => {
    setForm({
      picture: user?.picture || "/demo_pp.png",
      username: user?.username || "",
      age: user?.age || "",
      stream: user?.stream || "",
      standard: user?.standered || "",
      favouriteSubject: user?.fv_subject || "",
    });
  }, [user]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="space-y-6">
      <ProfilePhotoSection
        picture={form.picture}
        onChange={(picture) => updateField("picture", picture)}
      />

      <PersonalInfoSection
        username={form.username}
        age={form.age}
        onChange={updateField}
      />

      <AcademicInfoSection
        stream={form.stream}
        standard={form.standard}
        favouriteSubject={form.favouriteSubject}
        onChange={updateField}
      />

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Complete Profile
      </button>
    </form>
  );
}
