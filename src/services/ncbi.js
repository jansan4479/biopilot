const SEARCH_URL =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'

const SUMMARY_URL =
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'

export async function searchNCBI(query) {
    // Step 1: Search NCBI Gene database
    const searchUrl = `${SEARCH_URL}?db=gene&term=${encodeURIComponent(
        query
    )}&retmode=json`

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
        throw new Error('NCBI search request failed')
    }

    const searchData = await searchResponse.json()

    const ids = searchData.esearchresult.idlist

    // No records found
    if (ids.length === 0) {
        return {
            ids: [],
            records: [],
        }
    }

    // Step 2: Get details for the first matching gene
    const summaryUrl = `${SUMMARY_URL}?db=gene&id=${ids[0]}&retmode=json`

    const summaryResponse = await fetch(summaryUrl)

    if (!summaryResponse.ok) {
        throw new Error('NCBI gene details request failed')
    }

    const summaryData = await summaryResponse.json()

    const record = summaryData.result[ids[0]]

    return {
        ids,
        records: [
            {
                geneId: ids[0],
                name: record.name || 'Not available',
                description: record.description || 'Not available',
                organism: record.organism?.scientificname || 'Not available',
                chromosome: record.chromosome || 'Not available',
                mapLocation: record.maplocation || 'Not available',
            },
        ],
    }
}