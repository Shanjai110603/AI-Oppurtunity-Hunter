export function estimatePrice(estimatedHours) {
    if (!estimatedHours || isNaN(estimatedHours)) {
        estimatedHours = 10; // default to 10 hours for unknown
    }

    const hours = parseFloat(estimatedHours);

    // Rates requested by user
    const beginnerRate = 10;
    const intermediateRate = 30;
    const expertRate = 80;

    return {
        estimated_build_hours: hours,
        pricing_beginner: `$${Math.round(hours * beginnerRate)}`,
        pricing_intermediate: `$${Math.round(hours * intermediateRate)}`,
        pricing_expert: `$${Math.round(hours * expertRate)}`
    };
}
