const UNIPROT_URL =
    'https://rest.uniprot.org/uniprotkb/search'

export async function searchUniProt(query) {
    const url =
        `${UNIPROT_URL}?query=${encodeURIComponent(query)}` +
        '&format=json' +
        '&size=1'

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('UniProt request failed')
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
        return null
    }

    const protein = data.results[0]

    return {
        accession: protein.primaryAccession || 'Not available',
        proteinName:
            protein.proteinDescription?.recommendedName?.fullName?.value ||
            'Not available',
        organism:
            protein.organism?.scientificName ||
            'Not available',
        length:
            protein.sequence?.length ||
            'Not available',
        gene:
            protein.genes?.[0]?.geneName?.value ||
            'Not available',
    }
}