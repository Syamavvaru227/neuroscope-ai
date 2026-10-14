from typing import List
from models import EvidenceCitation

CURATED_EVIDENCE_STORE: List[EvidenceCitation] = [
    EvidenceCitation(
        id="EVID-GRAUS-2016",
        title="A clinical approach to diagnosis of autoimmune encephalitis",
        authors="Graus F, Titulaer MJ, Balu R, Benseler S, Bien CG, Cellucci T, et al.",
        journal="The Lancet Neurology",
        year=2016,
        doi="10.1016/S1474-4422(15)00401-9",
        pmid="26906964",
        url="https://doi.org/10.1016/S1474-4422(15)00401-9",
        excerpt=(
            "Graus and colleagues present a clinical approach and criteria for classifying autoimmune encephalitis syndromes. "
            "The criteria combine clinical course, supporting investigations, and consideration of alternative causes; they are intended for clinical evaluation, not autonomous diagnosis."
        ),
        relevance_tag="Diagnostic Criteria / Possible & Probable AE",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-DALMAU-2019",
        title="An update on anti-NMDA receptor encephalitis for neurologists and psychiatrists: mechanisms and models",
        authors="Dalmau J, Armangué T, Planagumà J, Radosevic M, Mannara F, Leypoldt F, et al.",
        journal="The Lancet Neurology",
        year=2019,
        doi="10.1016/S1474-4422(19)30244-3",
        pmid="31326280",
        url="https://doi.org/10.1016/S1474-4422(19)30244-3",
        excerpt=(
            "Anti-NMDA receptor encephalitis typically presents with a multistage clinical progression: viral-like prodrome, followed by "
            "severe psychiatric symptoms (psychosis, paranoia, mania, anxiety), catatonia, speech reduction, seizures, movement disorders (especially orofacial-lingual dyskinesias), "
            "and autonomic instability or hypoventilation. CSF is more sensitive and specific than serum for antibody detection (close to 100% vs ~85%). "
            "In women aged 18–45, associated ovarian teratoma is found in 40–50% of cases and warrants prompt pelvic imaging."
        ),
        relevance_tag="Anti-NMDAR Encephalitis / Clinical Presentation & Teratoma Screening",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-TITULAER-2013",
        title="Treatment and prognostic factors for long-term outcome in patients with anti-NMDA receptor encephalitis: an observational cohort study",
        authors="Titulaer MJ, McCracken L, Gabilondo I, Armangué T, Glaser C, Iizuka T, et al.",
        journal="The Lancet Neurology",
        year=2013,
        doi="10.1016/S1474-4422(12)70310-1",
        pmid="23290630",
        url="https://doi.org/10.1016/S1474-4422(12)70310-1",
        excerpt=(
            "This observational cohort study included 577 patients with anti-NMDA receptor encephalitis and examined treatment and prognostic factors. "
            "Its group-level findings do not determine an individual patient's diagnosis, prognosis, or treatment."
        ),
        relevance_tag="Prognosis / Treatment Timing & Escalation",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-SCHMITZ-2012",
        title="Extreme delta brush: a unique EEG pattern in adults with anti-NMDA receptor encephalitis",
        authors="Schmitt SE, Pargeon K, Frechette ES, Hirsch LJ, Dalmau J, Friedman D.",
        journal="Neurology",
        year=2012,
        doi="10.1212/WNL.0b013e3182698cd8",
        pmid="22933737",
        url="https://doi.org/10.1212/WNL.0b013e3182698cd8",
        excerpt=(
            "In this series of 23 adults monitored with continuous EEG, the authors described extreme delta brush in 7 patients (30.4%). "
            "The study is descriptive and the EEG finding must be interpreted in clinical context."
        ),
        relevance_tag="EEG Biomarker / Extreme Delta Brush",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-IRANI-2011",
        title="Faciobrachial dystonic seizures precede Lgi1 antibody limbic encephalitis",
        authors="Irani SR, Michell AW, Lang B, Leite MI, Jacob S, Vincent A, et al.",
        journal="Annals of Neurology",
        year=2011,
        doi="10.1002/ana.22307",
        pmid="21416487",
        url="https://doi.org/10.1002/ana.22307",
        excerpt=(
            "This study describes frequent, brief dystonic seizures predominantly affecting the arm and ipsilateral face in patients associated with LGI1 antibodies; "
            "the events can precede limbic encephalitis. The reference is not an individual diagnostic rule."
        ),
        relevance_tag="LGI1 Encephalitis / Faciobrachial Dystonic Seizures",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-VENKATESAN-2013",
        title="Case definitions, diagnostic algorithms, and priorities in encephalitis: consensus statement of the International Encephalitis Consortium",
        authors="Venkatesan A, Tunkel AR, Bloch KC, Lauring AS, Sejvar J, Bitnun A, et al.",
        journal="Clinical Infectious Diseases",
        year=2013,
        doi="10.1093/cid/cit458",
        pmid="23861361",
        url="https://doi.org/10.1093/cid/cit458",
        excerpt=(
            "Encephalitis case definition requires altered mental status lasting ≥24 hours with no alternative cause identified, plus ≥2 minor criteria for possible encephalitis "
            "or ≥3 for probable/confirmed: documented fever ≥38°C within 72h, seizures, new focal neurological deficits, CSF pleocytosis ≥5 WBC/mm³, neuroimaging suggestive of encephalitis, "
            "or electroencephalography consistent with encephalitis. HSV PCR is urgent in all suspected cases."
        ),
        relevance_tag="International Consensus / Infectious vs Non-infectious Case Definition",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-ELLUL-2018",
        title="Acute encephalitis - diagnosis and management",
        authors="Ellul MA, Solomon T.",
        journal="Clinical Medicine (London)",
        year=2018,
        doi="10.7861/clinmedicine.18-2-155",
        pmid="29626021",
        url="https://doi.org/10.7861/clinmedicine.18-2-155",
        excerpt=(
            "This clinical review describes the assessment of suspected acute encephalitis, including the role of cerebrospinal fluid examination, imaging, and EEG. "
            "Interpretation and management depend on the full clinical context and qualified clinician review."
        ),
        relevance_tag="Acute Management / Acyclovir & Infectious Rule-Out",
        verified_peer_reviewed=True
    ),
    EvidenceCitation(
        id="EVID-LEE-2022",
        title="Seronegative autoimmune encephalitis: clinical characteristics and factors associated with outcomes",
        authors="Lee WJ, Lee HS, Kim DY, et al.",
        journal="Brain",
        year=2022,
        doi="10.1093/brain/awac166",
        pmid="35512357",
        url="https://doi.org/10.1093/brain/awac166",
        excerpt=(
            "This cohort study describes clinical features and outcomes in 147 patients classified as having seronegative autoimmune encephalitis. "
            "The authors report variation across subtypes and associations between a proposed clinical score and 2-year outcomes; the findings are observational and do not establish an individual patient's diagnosis or prognosis."
        ),
        relevance_tag="Seronegative Autoimmune Encephalitis / Observational Outcomes",
        verified_peer_reviewed=True
    )
]

def get_all_evidence() -> List[EvidenceCitation]:
    return CURATED_EVIDENCE_STORE

def search_evidence(query: str) -> List[EvidenceCitation]:
    q = query.lower()
    return [
        item for item in CURATED_EVIDENCE_STORE
        if q in item.title.lower() or q in item.excerpt.lower() or q in item.relevance_tag.lower() or q in item.authors.lower()
    ]
