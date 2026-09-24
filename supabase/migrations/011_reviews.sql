-- Client reviews: pending invite rows (submitted_at null) become published
-- when the client submits via /leave-review/{submission_token}.
-- rating is nullable so a pending invite can exist before the client rates.

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  -- Nullable until the client submits (pending invite row).
  rating smallint CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  comment text,
  submission_token uuid NOT NULL DEFAULT gen_random_uuid(),
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Pending invites need a null rating before submission.
ALTER TABLE public.reviews ALTER COLUMN rating DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_submission_token
  ON public.reviews(submission_token);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_one_per_booking
  ON public.reviews(booking_id);

CREATE INDEX IF NOT EXISTS idx_reviews_business_submitted
  ON public.reviews(business_id, submitted_at DESC)
  WHERE submitted_at IS NOT NULL;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews readable by anyone (only submitted ones)" ON public.reviews;
CREATE POLICY "reviews readable by anyone (only submitted ones)"
  ON public.reviews FOR SELECT
  USING (submitted_at IS NOT NULL);

DROP POLICY IF EXISTS "owner can manage own reviews" ON public.reviews;
CREATE POLICY "owner can manage own reviews"
  ON public.reviews FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

GRANT ALL ON TABLE public.reviews TO postgres, service_role;
GRANT SELECT ON TABLE public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.reviews TO authenticated;

COMMENT ON TABLE public.reviews IS
  'Client reviews. submitted_at null = pending invite; set = published.';
