# BioPilot 🧬

### AI Bioinformatics Research Workspace

**From biological question to research insight.**

BioPilot is a web-based bioinformatics research workspace designed to help students and early researchers explore biological questions using publicly available scientific databases and computational sequence-analysis tools.

## 🌐 Live Demo

[Open BioPilot](https://biopilot-5wisjjy4s-bio-pilot1.vercel.app/)

## ✨ Features

### 🔬 Biological Evidence

BioPilot retrieves publicly available biological information from:

- NCBI Gene
- UniProt
- Europe PMC

Users can enter a gene, protein, disease, or research question and explore related biological records and literature.

### 🧬 Sequence Analysis

BioPilot supports:

- DNA sequence analysis
- Protein sequence analysis
- FASTA input
- Sequence length calculation
- Nucleotide composition
- GC percentage
- Amino-acid composition
- Approximate protein molecular weight

### 🧪 DNA Analysis Tools

For DNA sequences, BioPilot provides:

- DNA → protein translation
- Reverse complement
- Six-frame translation
- Basic ORF detection

### 💡 Research Exploration

BioPilot generates exploratory research questions based on the retrieved information.

These suggestions are intended to help users identify areas that may require further investigation.

## 🛠️ Technology Stack

- React
- Vite
- JavaScript
- HTML
- CSS
- REST APIs
- NCBI E-utilities
- UniProt REST API
- Europe PMC REST API
- Git
- GitHub
- Vercel

## 🧠 Scientific Integrity

BioPilot is designed to distinguish between:

- Retrieved biological information
- Computationally calculated results
- Rule-based analysis
- Exploratory research suggestions

The application does **not** claim that exploratory questions represent confirmed research gaps.

Users should verify important biological findings using the original scientific databases and literature.

## 🚀 Running Locally

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/biopilot.git