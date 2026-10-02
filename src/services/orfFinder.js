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

export function getReverseComplement(sequence) {
    const cleanSequence = sequence
        .toUpperCase()
        .replace(/\s+/g, '')

    if (!/^[ATGC]+$/.test(cleanSequence)) {
        return null
    }

    const complement = {
        A: 'T',
        T: 'A',
        G: 'C',
        C: 'G',
    }

    return cleanSequence
        .split('')
        .reverse()
        .map((base) => complement[base])
        .join('')
}

export function findORFs(sequence) {
    const cleanSequence = sequence
        .toUpperCase()
        .replace(/\s+/g, '')

    if (!/^[ATGC]+$/.test(cleanSequence)) {
        return {
            success: false,
            message:
                'ORF analysis requires a DNA sequence containing only A, T, G and C.',
            frames: [],
            orfs: [],
            reverseComplement: null,
        }
    }

    const frames = []

    for (let frame = 0; frame < 3; frame++) {
        let protein = ''

        for (
            let position = frame;
            position + 2 < cleanSequence.length;
            position += 3
        ) {
            const codon = cleanSequence.substring(
                position,
                position + 3
            )

            protein += CODON_TABLE[codon] || 'X'
        }

        frames.push({
            frame: `+${frame + 1}`,
            protein,
        })
    }

    const reverseComplement =
        getReverseComplement(cleanSequence)

    for (let frame = 0; frame < 3; frame++) {
        let protein = ''

        for (
            let position = frame;
            position + 2 < reverseComplement.length;
            position += 3
        ) {
            const codon =
                reverseComplement.substring(
                    position,
                    position + 3
                )

            protein += CODON_TABLE[codon] || 'X'
        }

        frames.push({
            frame: `-${frame + 1}`,
            protein,
        })
    }

    const orfs = []

    frames.forEach((frameResult) => {
        const protein = frameResult.protein

        let startIndex = -1

        for (let i = 0; i < protein.length; i++) {
            if (
                protein[i] === 'M' &&
                startIndex === -1
            ) {
                startIndex = i
            }

            if (
                protein[i] === '*' &&
                startIndex !== -1
            ) {
                const orfProtein =
                    protein.substring(
                        startIndex,
                        i
                    )

                if (orfProtein.length > 0) {
                    orfs.push({
                        frame: frameResult.frame,
                        start: startIndex * 3 + 1,
                        end: i * 3 + 3,
                        protein: orfProtein,
                        length: orfProtein.length,
                    })
                }

                startIndex = -1
            }
        }
    })

    return {
        success: true,
        dna: cleanSequence,
        length: cleanSequence.length,
        reverseComplement,
        frames,
        orfs,
    }
}