const AMINO_ACID_WEIGHTS = {
  A: 89.09,
  C: 121.15,
  D: 133.1,
  E: 147.13,
  F: 165.19,
  G: 75.07,
  H: 155.16,
  I: 131.17,
  K: 146.19,
  L: 131.17,
  M: 149.21,
  N: 132.12,
  P: 115.13,
  Q: 146.15,
  R: 174.2,
  S: 105.09,
  T: 119.12,
  V: 117.15,
  W: 204.23,
  Y: 181.19,
}

export function analyzeSequence(sequence) {
  const fastaLines = sequence
    .trim()
    .split(/\r?\n/)

  let sequenceName = null
  let sequenceLines = fastaLines

  // Detect FASTA header
  if (fastaLines[0]?.startsWith('>')) {
    sequenceName = fastaLines[0]
      .substring(1)
      .trim()

    sequenceLines = fastaLines.slice(1)
  }

  const cleanSequence = sequenceLines
    .join('')
    .toUpperCase()
    .replace(/\s+/g, '')

  if (cleanSequence.length === 0) {
    return null
  }

  const dnaPattern = /^[ATGC]+$/
  const isDNA = dnaPattern.test(cleanSequence)

  if (isDNA) {
    const length = cleanSequence.length

    const aCount = countCharacter(cleanSequence, 'A')
    const tCount = countCharacter(cleanSequence, 'T')
    const gCount = countCharacter(cleanSequence, 'G')
    const cCount = countCharacter(cleanSequence, 'C')

    const gcPercentage =
      ((gCount + cCount) / length) * 100

    return {
      name: sequenceName,
      type: 'DNA',
      sequence: cleanSequence,
      length,
      composition: {
        A: aCount,
        T: tCount,
        G: gCount,
        C: cCount,
      },
      percentages: {
        A: ((aCount / length) * 100).toFixed(2),
        T: ((tCount / length) * 100).toFixed(2),
        G: ((gCount / length) * 100).toFixed(2),
        C: ((cCount / length) * 100).toFixed(2),
      },
      gcPercentage: gcPercentage.toFixed(2),
      molecularWeight: null,
    }
  }

  const proteinPattern =
    /^[ACDEFGHIKLMNPQRSTVWY]+$/

  const isProtein = proteinPattern.test(cleanSequence)

  if (isProtein) {
    const length = cleanSequence.length

    const composition =
      calculateProteinComposition(cleanSequence)

    const percentages =
      calculateProteinPercentages(
        composition,
        length
      )

    const molecularWeight =
      calculateMolecularWeight(cleanSequence)

    return {
      name: sequenceName,
      type: 'Protein',
      sequence: cleanSequence,
      length,
      composition,
      percentages,
      gcPercentage: null,
      molecularWeight: molecularWeight.toFixed(2),
    }
  }

  return {
    name: sequenceName,
    type: 'Unknown',
    sequence: cleanSequence,
    length: cleanSequence.length,
    composition: {},
    percentages: {},
    gcPercentage: null,
    molecularWeight: null,
  }
}

function countCharacter(sequence, character) {
  return [...sequence].filter(
    (letter) => letter === character
  ).length
}

function calculateProteinComposition(sequence) {
  const aminoAcids = Object.keys(AMINO_ACID_WEIGHTS)

  const composition = {}

  aminoAcids.forEach((aminoAcid) => {
    composition[aminoAcid] = countCharacter(
      sequence,
      aminoAcid
    )
  })

  return composition
}

function calculateProteinPercentages(
  composition,
  length
) {
  const percentages = {}

  Object.entries(composition).forEach(
    ([aminoAcid, count]) => {
      percentages[aminoAcid] =
        ((count / length) * 100).toFixed(2)
  })

  return percentages
}

function calculateMolecularWeight(sequence) {
  let totalWeight = 0

  for (const aminoAcid of sequence) {
    totalWeight += AMINO_ACID_WEIGHTS[aminoAcid]
  }

  const waterLoss =
    18.015 * (sequence.length - 1)

  return totalWeight - waterLoss
}