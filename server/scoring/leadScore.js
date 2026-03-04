export function calculateLeadScore(aiOpportunityScore, urgencyLevel, estimatedRevenueRange) {
    let score = aiOpportunityScore || 0;

    // Boost for high urgency
    if (urgencyLevel === 'high') score += 15;
    else if (urgencyLevel === 'medium') score += 5;

    // Boost for higher revenue indicates ability to pay
    if (estimatedRevenueRange && estimatedRevenueRange.includes('k')) {
        score += 10;
    }

    return Math.min(100, Math.max(0, score)); // clamp between 0 and 100
}
