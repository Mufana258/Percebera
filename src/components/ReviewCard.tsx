import type { Review } from "../data/types";
import { formatDate } from "../lib/format";
import { CheckCircleIcon } from "./Icons";
import { Stars } from "./Primitives";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <div className="review-card__top">
        <Stars value={review.rating} />
        <span className="review-card__date">{formatDate(review.date)}</span>
      </div>
      <p className="review-card__text">“{review.text}”</p>
      <div className="review-card__footer">
        <div>
          <strong>{review.authorName}</strong>
          <span>{review.offerTitle}</span>
        </div>
        {review.verified && (
          <span className="review-card__verified">
            <CheckCircleIcon size={13} />
            Troca verificada
          </span>
        )}
      </div>
    </article>
  );
}
