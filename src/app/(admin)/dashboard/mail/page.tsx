import MailPage from "@/components/dashboard/mail/MailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail | Dashboard | Knowlet",
  description: "Compose and send emails to Knowlet users.",
};

function page() {
  return <MailPage />;
}

export default page;
