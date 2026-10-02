import { useState } from 'react'
import { searchNCBI } from './services/ncbi'
import { searchUniProt } from './services/uniprot'
import { searchEuropePMC } from './services/europepmc'
import { findResearchGaps } from './services/researchGap'
import { analyzeSequence } from './services/sequenceAnalysis'
import { translateDNA } from './services/translation'
import {
  findORFs,
  getReverseComplement,
} from './services/orfFinder'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [analyzedQuery, setAnalyzedQuery] =
    useState('')

  const [ncbiResult, setNcbiResult] =
    useState(null)
  const [uniprotResult, setUniprotResult] =
    useState(null)
  const [literatureResult, setLiteratureResult] =
    useState([])
  const [researchGapResult, setResearchGapResult] =
    useState(null)

  const [sequenceInput, setSequenceInput] =
    useState('')
  const [sequenceResult, setSequenceResult] =
    useState(null)
  const [translationResult, setTranslationResult] =
    useState(null)
  const [orfResult, setOrfResult] =
    useState(null)
  const [reverseComplement, setReverseComplement] =
    useState('')

  const [loading, setLoading] =
    useState(false)
  const [error, setError] =
    useState('')

  async function handleAnalyze() {
    if (!query.trim()) {
      setError(
        'Please enter a biological question, gene, protein, or disease.'
      )
      return
    }

    setLoading(true)
    setError('')
    setAnalyzedQuery(query)

    try {
      const [
        ncbi,
        uniprot,
        literature,
      ] = await Promise.all([
        searchNCBI(query),
        searchUniProt(query),
        searchEuropePMC(query),
      ])

      setNcbiResult(ncbi)
      setUniprotResult(uniprot)
      setLiteratureResult(literature)

      const gene =
        ncbi?.records?.[0]?.name || null

      const protein =
        uniprot?.proteinName || null

      const gaps = findResearchGaps(
        query,
        literature,
        gene,
        protein
      )

      setResearchGapResult(gaps)
    } catch (err) {
      setError(
        err.message ||
        'Something went wrong while analyzing the query.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSequenceAnalysis() {
    if (!sequenceInput.trim()) {
      setSequenceResult(null)
      setTranslationResult(null)
      setOrfResult(null)
      setReverseComplement('')
      return
    }

    const result =
      analyzeSequence(sequenceInput)

    setSequenceResult(result)
    setTranslationResult(null)
    setOrfResult(null)
    setReverseComplement('')
  }

  function handleTranslation() {
    if (!sequenceResult) {
      return
    }

    if (sequenceResult.type !== 'DNA') {
      setTranslationResult({
        success: false,
        protein: '',
        message:
          'DNA → protein translation is available only for DNA sequences.',
      })
      return
    }

    const result = translateDNA(
      sequenceResult.sequence
    )

    setTranslationResult(result)
  }

  function handleORFAnalysis() {
    if (!sequenceResult) {
      return
    }

    if (sequenceResult.type !== 'DNA') {
      setOrfResult({
        success: false,
        frames: [],
        orfs: [],
        message:
          'ORF analysis is available only for DNA sequences.',
      })
      return
    }

    const result = findORFs(
      sequenceResult.sequence
    )

    setOrfResult(result)
  }

  function handleReverseComplement() {
    if (!sequenceResult) {
      return
    }

    if (sequenceResult.type !== 'DNA') {
      setReverseComplement('')
      return
    }

    const result = getReverseComplement(
      sequenceResult.sequence
    )

    setReverseComplement(result)
  }

  function handleExample(example) {
    setQuery(example)
    setAnalyzedQuery('')
    setNcbiResult(null)
    setUniprotResult(null)
    setLiteratureResult([])
    setResearchGapResult(null)
    setError('')
  }

  const record =
    ncbiResult?.records?.[0]

  const hasEvidence =
    record ||
    uniprotResult ||
    literatureResult.length > 0

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">
            B
          </div>

          <div>
            <h1>BioPilot</h1>
            <p>
              AI Bioinformatics Research Workspace
            </p>
          </div>
        </div>

        <div className="header-tag">
          Research Workspace
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <p className="eyebrow">
            BIOINFORMATICS RESEARCH WORKSPACE
          </p>

          <h2>
            Start with a question.
            <br />
            Follow the evidence.
          </h2>

          <p className="hero-text">
            Explore genes, proteins, sequences and
            scientific literature using live biological
            databases.
          </p>

          <div className="search-box">
            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAnalyze()
                }
              }}
              placeholder="Try TP53, insulin, cystic fibrosis..."
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading
                ? 'Analyzing...'
                : 'Analyze'}
            </button>
          </div>

          <div className="examples">
            <span>
              Try an example:
            </span>

            <button
              onClick={() =>
                handleExample('TP53')
              }
            >
              TP53
            </button>

            <button
              onClick={() =>
                handleExample('Insulin')
              }
            >
              Insulin
            </button>

            <button
              onClick={() =>
                handleExample(
                  'Cystic fibrosis'
                )
              }
            >
              Cystic fibrosis
            </button>
          </div>
        </section>

        {error && (
          <section className="error-box">
            <strong>Error:</strong>{' '}
            {error}
          </section>
        )}

        {analyzedQuery && (
          <section className="section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  INVESTIGATION
                </p>

                <h3>
                  Evidence Brief
                </h3>
              </div>

              <span className="query-label">
                {analyzedQuery}
              </span>
            </div>

            {!hasEvidence &&
              !loading && (
                <div className="empty-state">
                  No evidence was retrieved
                  for this investigation.
                </div>
              )}

            {record && (
              <div className="evidence-card">
                <div className="card-header">
                  <div>
                    <p className="source-name">
                      NCBI GENE
                    </p>

                    <h4>
                      Gene Information
                    </h4>
                  </div>

                  <span className="source-badge">
                    NCBI
                  </span>
                </div>

                <div className="data-grid">
                  <div>
                    <span>
                      Gene ID
                    </span>

                    <strong>
                      {record.geneId}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Gene Name
                    </span>

                    <strong>
                      {record.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Organism
                    </span>

                    <strong>
                      {record.organism}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Chromosome
                    </span>

                    <strong>
                      {record.chromosome}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      {record.mapLocation}
                    </strong>
                  </div>
                </div>

                <div className="description">
                  <span>
                    Description
                  </span>

                  <p>
                    {record.description}
                  </p>
                </div>

                <a
                  href={`https://www.ncbi.nlm.nih.gov/gene/${record.geneId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View NCBI record →
                </a>
              </div>
            )}

            {uniprotResult && (
              <div className="evidence-card">
                <div className="card-header">
                  <div>
                    <p className="source-name">
                      UNIPROT
                    </p>

                    <h4>
                      Protein Information
                    </h4>
                  </div>

                  <span className="source-badge">
                    UniProt
                  </span>
                </div>

                <div className="data-grid">
                  <div>
                    <span>
                      Accession
                    </span>

                    <strong>
                      {
                        uniprotResult.accession
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Protein
                    </span>

                    <strong>
                      {
                        uniprotResult.proteinName
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Gene
                    </span>

                    <strong>
                      {uniprotResult.gene}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Organism
                    </span>

                    <strong>
                      {
                        uniprotResult.organism
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Length
                    </span>

                    <strong>
                      {
                        uniprotResult.length
                      }{' '}
                      aa
                    </strong>
                  </div>
                </div>

                <a
                  href={`https://www.uniprot.org/uniprotkb/${uniprotResult.accession}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View UniProt record →
                </a>
              </div>
            )}

            <div className="evidence-card">
              <div className="card-header">
                <div>
                  <p className="source-name">
                    EUROPE PMC
                  </p>

                  <h4>
                    Literature Evidence
                  </h4>
                </div>

                <span className="source-badge">
                  {
                    literatureResult.length
                  }{' '}
                  papers
                </span>
              </div>

              {literatureResult.length ===
                0 ? (
                <p className="muted">
                  No literature records
                  were retrieved.
                </p>
              ) : (
                <div className="literature-list">
                  {literatureResult.map(
                    (
                      paper,
                      index
                    ) => (
                      <div
                        className="paper"
                        key={
                          paper.pmid ||
                          index
                        }
                      >
                        <h5>
                          {
                            paper.title
                          }
                        </h5>

                        <p>
                          {
                            paper.authors
                          }
                        </p>

                        <span>
                          {
                            paper.journal
                          }{' '}
                          ·{' '}
                          {paper.year}
                        </span>

                        {paper.pmid && (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View paper →
                          </a>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {researchGapResult && (
              <div className="evidence-card research-gap-card">
                <div className="card-header">
                  <div>
                    <p className="source-name">
                      BIOPILOT ANALYSIS
                    </p>

                    <h4>
                      Research Gap Finder
                    </h4>
                  </div>

                  <span className="source-badge">
                    Exploratory
                  </span>
                </div>

                <div className="gap-section">
                  <h5>
                    Evidence Gaps
                  </h5>

                  {researchGapResult.gaps.map(
                    (
                      gap,
                      index
                    ) => (
                      <p key={index}>
                        • {gap}
                      </p>
                    )
                  )}
                </div>

                <div className="gap-section">
                  <h5>
                    Potential Research Questions
                  </h5>

                  {researchGapResult.questions.map(
                    (
                      question,
                      index
                    ) => (
                      <p key={index}>
                        • {question}
                      </p>
                    )
                  )}
                </div>

                <div className="integrity-note">
                  BioPilot does not claim
                  that these are confirmed
                  research gaps. They are
                  exploratory questions
                  generated from the
                  retrieved evidence and
                  available biological
                  information.
                </div>
              </div>
            )}
          </section>
        )}

        <section className="section sequence-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                SEQUENCE ANALYSIS
              </p>

              <h3>
                Analyze a Biological
                Sequence
              </h3>
            </div>
          </div>

          <div className="sequence-card">
            <p className="sequence-help">
              Paste a DNA or protein sequence
              below. BioPilot also supports
              FASTA format.
            </p>

            <textarea
              value={sequenceInput}
              onChange={(event) =>
                setSequenceInput(
                  event.target.value
                )
              }
              placeholder={
                '>TP53_HUMAN\nMEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDD'
              }
              rows="8"
            />

            <button
              className="sequence-button"
              onClick={
                handleSequenceAnalysis
              }
            >
              Analyze Sequence
            </button>

            {sequenceResult && (
              <div className="sequence-result">
                <div className="sequence-result-header">
                  <div>
                    <p className="source-name">
                      ANALYSIS RESULT
                    </p>

                    <h4>
                      {
                        sequenceResult.type
                      }{' '}
                      Sequence
                    </h4>

                    {sequenceResult.name && (
                      <p className="sequence-name">
                        {
                          sequenceResult.name
                        }
                      </p>
                    )}
                  </div>

                  <span className="source-badge">
                    {
                      sequenceResult.length
                    }{' '}
                    residues
                  </span>
                </div>

                <div className="data-grid">
                  <div>
                    <span>
                      Sequence Type
                    </span>

                    <strong>
                      {
                        sequenceResult.type
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Length
                    </span>

                    <strong>
                      {
                        sequenceResult.length
                      }
                    </strong>
                  </div>

                  {sequenceResult.gcPercentage !==
                    null && (
                      <div>
                        <span>
                          GC Content
                        </span>

                        <strong>
                          {
                            sequenceResult.gcPercentage
                          }
                          %
                        </strong>
                      </div>
                    )}

                  {sequenceResult.molecularWeight !==
                    null && (
                      <div>
                        <span>
                          Molecular Weight
                        </span>

                        <strong>
                          {
                            sequenceResult.molecularWeight
                          }{' '}
                          Da
                        </strong>
                      </div>
                    )}
                </div>

                {sequenceResult.type !==
                  'Unknown' && (
                    <div className="composition">
                      <h5>
                        Composition
                      </h5>

                      <div className="composition-grid">
                        {Object.entries(
                          sequenceResult.composition
                        ).map(
                          ([
                            symbol,
                            count,
                          ]) => (
                            <div
                              key={symbol}
                            >
                              <span>
                                {symbol}
                              </span>

                              <strong>
                                {count}
                              </strong>

                              {sequenceResult
                                .percentages?.[
                                symbol
                              ] && (
                                  <small>
                                    {
                                      sequenceResult
                                        .percentages[
                                      symbol
                                      ]
                                    }
                                    %
                                  </small>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {sequenceResult.type ===
                  'DNA' && (
                    <>
                      <div className="translation-box">
                        <div className="card-header">
                          <div>
                            <p className="source-name">
                              REVERSE COMPLEMENT
                            </p>

                            <h4>
                              DNA Reverse
                              Complement
                            </h4>
                          </div>

                          <span className="source-badge">
                            DNA
                          </span>
                        </div>

                        <p className="sequence-help">
                          Generate the reverse
                          complement of the
                          analyzed DNA sequence.
                        </p>

                        <button
                          className="sequence-button"
                          onClick={
                            handleReverseComplement
                          }
                        >
                          Generate Reverse
                          Complement
                        </button>

                        {reverseComplement && (
                          <div className="sequence-output">
                            <span>
                              Reverse Complement
                            </span>

                            <code>
                              {
                                reverseComplement
                              }
                            </code>
                          </div>
                        )}
                      </div>

                      <div className="translation-box">
                        <div className="card-header">
                          <div>
                            <p className="source-name">
                              TRANSLATION
                            </p>

                            <h4>
                              DNA → Protein
                            </h4>
                          </div>

                          <span className="source-badge">
                            Frame +1
                          </span>
                        </div>

                        <p className="sequence-help">
                          Translate the DNA
                          sequence using the
                          standard genetic code.
                        </p>

                        <button
                          className="sequence-button"
                          onClick={
                            handleTranslation
                          }
                        >
                          Translate DNA
                        </button>

                        {translationResult && (
                          <div className="translation-result">
                            {!translationResult.success ? (
                              <p className="sequence-warning">
                                {
                                  translationResult.message
                                }
                              </p>
                            ) : (
                              <>
                                <div className="data-grid">
                                  <div>
                                    <span>
                                      DNA Length
                                    </span>

                                    <strong>
                                      {
                                        translationResult.dnaLength
                                      }
                                    </strong>
                                  </div>

                                  <div>
                                    <span>
                                      Protein
                                      Length
                                    </span>

                                    <strong>
                                      {
                                        translationResult.proteinLength
                                      }{' '}
                                      aa
                                    </strong>
                                  </div>
                                </div>

                                <div className="sequence-output">
                                  <span>
                                    Translated
                                    Protein
                                  </span>

                                  <code>
                                    {
                                      translationResult.protein
                                    }
                                  </code>
                                </div>

                                <p className="sequence-help">
                                  <strong>
                                    *
                                  </strong>{' '}
                                  represents a
                                  stop codon.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="translation-box">
                        <div className="card-header">
                          <div>
                            <p className="source-name">
                              ORF ANALYSIS
                            </p>

                            <h4>
                              Six-Frame
                              Translation &
                              ORF Finder
                            </h4>
                          </div>

                          <span className="source-badge">
                            6 Frames
                          </span>
                        </div>

                        <p className="sequence-help">
                          Search all three
                          forward and three
                          reverse-complement
                          reading frames for
                          open reading frames.
                        </p>

                        <button
                          className="sequence-button"
                          onClick={
                            handleORFAnalysis
                          }
                        >
                          Find ORFs
                        </button>

                        {orfResult && (
                          <div className="orf-result">
                            {!orfResult.success ? (
                              <p className="sequence-warning">
                                {
                                  orfResult.message
                                }
                              </p>
                            ) : (
                              <>
                                <div className="sequence-output">
                                  <span>
                                    Reverse
                                    Complement
                                  </span>

                                  <code>
                                    {
                                      orfResult.reverseComplement
                                    }
                                  </code>
                                </div>

                                <div className="frame-list">
                                  <h5>
                                    Six Reading
                                    Frames
                                  </h5>

                                  {orfResult.frames.map(
                                    (
                                      frame
                                    ) => (
                                      <div
                                        className="frame-item"
                                        key={
                                          frame.frame
                                        }
                                      >
                                        <strong>
                                          Frame{' '}
                                          {
                                            frame.frame
                                          }
                                        </strong>

                                        <code>
                                          {
                                            frame.protein
                                          }
                                        </code>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="orf-list">
                                  <h5>
                                    Detected ORFs
                                  </h5>

                                  {orfResult.orfs
                                    .length ===
                                    0 ? (
                                    <p className="muted">
                                      No complete
                                      ORF beginning
                                      with a start
                                      codon and
                                      ending at a
                                      stop codon
                                      was detected.
                                    </p>
                                  ) : (
                                    orfResult.orfs.map(
                                      (
                                        orf,
                                        index
                                      ) => (
                                        <div
                                          className="orf-item"
                                          key={
                                            index
                                          }
                                        >
                                          <div>
                                            <span>
                                              Frame
                                            </span>

                                            <strong>
                                              {
                                                orf.frame
                                              }
                                            </strong>
                                          </div>

                                          <div>
                                            <span>
                                              Start
                                            </span>

                                            <strong>
                                              {
                                                orf.start
                                              }
                                            </strong>
                                          </div>

                                          <div>
                                            <span>
                                              End
                                            </span>

                                            <strong>
                                              {
                                                orf.end
                                              }
                                            </strong>
                                          </div>

                                          <div>
                                            <span>
                                              Protein
                                              Length
                                            </span>

                                            <strong>
                                              {
                                                orf.length
                                              }{' '}
                                              aa
                                            </strong>
                                          </div>

                                          <div className="orf-protein">
                                            <span>
                                              Predicted
                                              Protein
                                            </span>

                                            <code>
                                              {
                                                orf.protein
                                              }
                                            </code>
                                          </div>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                {sequenceResult.type ===
                  'Unknown' && (
                    <p className="sequence-warning">
                      The sequence contains
                      characters that BioPilot
                      cannot currently classify
                      as a standard DNA or protein
                      sequence.
                    </p>
                  )}
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <p>
            BioPilot is a research and educational
            workspace. Retrieved database
            information and computational analysis
            should be independently verified.
          </p>
          <p>Built by Janhavi Birari</p>
        </footer>
      </main>
    </div>
  )
}

export default App