export function findResearchGaps(query, literature, gene, protein) {
    const gaps = []
    const questions = []

    // No literature found
    if (!literature || literature.length === 0) {
        gaps.push(
            'Limited literature was retrieved for this investigation. A broader literature search may be useful.'
        )

        questions.push(
            `What biological mechanisms related to ${query} remain under-investigated?`
        )
    } else {
        // Basic evidence observation
        gaps.push(
            `BioPilot retrieved ${literature.length} literature record(s), but this initial search does not establish whether the topic is fully studied.`
        )

        questions.push(
            `What unresolved biological questions remain regarding ${query}?`
        )

        questions.push(
            `Which experimental or computational approaches could further investigate ${query}?`
        )
    }

    // Gene-level research question
    if (gene) {
        questions.push(
            `How could the function or biological role of ${gene} be investigated computationally?`
        )
    }

    // Protein-level research question
    if (protein) {
        questions.push(
            `What structural or sequence-level properties of ${protein} could be analyzed further?`
        )
    }

    return {
        gaps,
        questions,
    }
}