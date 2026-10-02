const CODON_TABLE = {
    TTT: 'F',
    TTC: 'F',
    TTA: 'L',
    TTG: 'L',

    TCT: 'S',
    TCC: 'S',
    TCA: 'S',
    TCG: 'S',

    TAT: 'Y',
    TAC: 'Y',
    TAA: '*',
    TAG: '*',

    TGT: 'C',
    TGC: 'C',
    TGA: '*',
    TGG: 'W',

    CTT: 'L',
    CTC: 'L',
    CTA: 'L',
    CTG: 'L',

    CCT: 'P',
    CCC: 'P',
    CCA: 'P',
    CCG: 'P',

    CAT: 'H',
    CAC: 'H',
    CAA: 'Q',
    CAG: 'Q',

    CGT: 'R',
    CGC: 'R',
    CGA: 'R',
    CGG: 'R',

    ATT: 'I',
    ATC: 'I',
    ATA: 'I',
    ATG: 'M',

    ACT: 'T',
    ACC: 'T',
    ACA: 'T',
    ACG: 'T',

    AAT: 'N',
    AAC: 'N',
    AAA: 'K',
    AAG: 'K',

    AGT: 'S',
    AGC: 'S',
    AGA: 'R',
    AGG: 'R',

    GTT: 'V',
    GTC: 'V',
    GTA: 'V',
    GTG: 'V',

    GCT: 'A',
    GCC: 'A',
    GCA: 'A',
    GCG: 'A',

    GAT: 'D',
    GAC: 'D',
    GAA: 'E',
    GAG: 'E',

    GGT: 'G',
    GGC: 'G',
    GGA: 'G',
    GGG: 'G',
}

export function translateDNA(sequence) {
    const cleanSequence = sequence
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/>/g, '')

    if (!cleanSequence) {
        return null
    }

    if (!/^[ATGC]+$/.test(cleanSequence)) {
        return {
            success: false,
            protein: '',
            message:
                'Translation requires a DNA sequence containing only A, T, G and C.',
        }
    }

    let protein = ''

    for (
        let position = 0;
        position + 2 < cleanSequence.length;
        position += 3
    ) {
        const codon = cleanSequence.substring(
            position,
            position + 3
        )

        const aminoAcid = CODON_TABLE[codon]

        protein += aminoAcid || 'X'
    }

    return {
        success: true,
        dna: cleanSequence,
        protein,
        dnaLength: cleanSequence.length,
        proteinLength: protein.length,
    }
}