import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeaveReviewForm } from "@/components/reviews/LeaveReviewForm";
import { getReviewInviteByToken } from "@/lib/actions/reviews";

export const metadata: Metadata = {
  title: "Leave a review",
  robots: { index: false, follow: false },
};

export default async function LeaveReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getReviewInviteByToken(token);

  if (!invite) notFound();

  return (
    <LeaveReviewForm
      token={invite.token}
      businessName={invite.businessName}
      templateId={invite.templateId}
      salonSlug={invite.salonSlug}
      alreadySubmitted={invite.alreadySubmitted}
    />
  );
}
