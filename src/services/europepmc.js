const EUROPE_PMC_URL =
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search'

export async function searchEuropePMC(query) {
    const url =
        `${EUROPE_PMC_URL}?query=${encodeURIComponent(query)}` +
        '&format=json' +
        '&pageSize=5'

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Europe PMC request failed')
    }

    const data = await response.json()

    if (!data.resultList?.result) {
        return []
    }

    return data.resultList.result.map((paper) => ({
        title: paper.title || 'Title not available',
        authors: paper.authorString || 'Authors not available',
        journal: paper.journalTitle || 'Journal not available',
        year: paper.pubYear || 'Year not available',
        pmid: paper.pmid || null,
        doi: paper.doi || null,
    }))
}