
import { Rating, Submission } from "../types";

export interface PlayerStats {
  totalScore: number;
  submissionCount: number;
  avgRating: number;
  favouriteCount: number; // Number of 5 star ratings received
}

/**
 * Formula: 
 * (Average Rating of all submissions) * (Number of Submissions) * 10
 * + (Community Favorite Bonus: 5 points per 5-star rating received)
 */
export const calculatePlayerScore = (
  userId: string,
  allSubmissions: Submission[],
  allRatings: Rating[]
): PlayerStats => {
  
  const userSubmissions = allSubmissions.filter(s => s.user_id === userId);
  const submissionCount = userSubmissions.length;
  
  if (submissionCount === 0) {
    return { totalScore: 0, submissionCount: 0, avgRating: 0, favouriteCount: 0 };
  }

  let totalRatingValue = 0;
  let ratingCount = 0;
  let fiveStarCount = 0;

  userSubmissions.forEach(sub => {
    const subRatings = allRatings.filter(r => r.submission_id === sub.id);
    if (subRatings.length > 0) {
      const subTotal = subRatings.reduce((acc, curr) => {
        if (curr.score === 5) fiveStarCount++;
        return acc + curr.score;
      }, 0);
      totalRatingValue += (subTotal / subRatings.length); // Add the average of this submission
      ratingCount++; // We count based on submissions that have ratings
    }
  });

  // If a submission has no ratings yet, it contributes 0 to the sum but counts towards N
  // This prevents spamming empty links. You need ratings to get points.
  
  const avgRating = ratingCount > 0 ? (totalRatingValue / ratingCount) : 0;

  // Base Score: Avg * Count * 10
  // Example: Avg 4.0 * 2 submissions * 10 = 80 points
  const baseScore = avgRating * submissionCount * 10;

  // Bonus: 5 points per 5-star rating
  const bonusScore = fiveStarCount * 5;

  return {
    totalScore: Math.round(baseScore + bonusScore),
    submissionCount,
    avgRating: parseFloat(avgRating.toFixed(1)),
    favouriteCount: fiveStarCount
  };
};
