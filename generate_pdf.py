import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "ProjectMatch — Development Timeline & Milestones Documentation")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 36, footer_text)
        self.drawString(54, 36, "CONFIDENTIAL — FAST SRM / ProjectMatch AI Project")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, letter[0] - 54, 48)

        self.restoreState()

def build_pdf(filename="ProjectMatch_Timeline_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1E293B")   # Slate 800
    accent_color = colors.HexColor("#4F46E5")    # Indigo 600
    sub_color = colors.HexColor("#475569")       # Slate 600

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=accent_color,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=sub_color,
        spaceAfter=6
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=primary_color
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=primary_color
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold'
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#4F46E5")
    )

    story = []

    # Title & Metadata Block
    story.append(Paragraph("ProjectMatch 🚀", title_style))
    story.append(Paragraph("AI-Powered Constraint-Aware Team Formation Platform — Development Timeline Documentation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceAfter=15))

    # Executive Overview
    story.append(Paragraph("1. Project Executive Overview", h1_style))
    overview_text = (
        "<b>ProjectMatch</b> is a sophisticated multi-agent AI framework engineered to assemble optimal, constraint-aware project teams. "
        "Unlike naive skill matchers that rely solely on surface-level keyword similarity, ProjectMatch implements a 3-Layer Prompt-Reasoning Pipeline "
        "powered by <b>gemini-3.6-flash</b>. The pipeline extracts structured JSON from unstructured candidate self-reports, runs Chain-of-Thought (CoT) matching against "
        "project parameters, and subjects team compositions to an automated Layer 3 critique loop."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 10))

    # Project Specifications Table
    spec_data = [
        [Paragraph("Project Name", table_cell_bold), Paragraph("ProjectMatch (FAST SRM)", table_cell)],
        [Paragraph("Core Architecture", table_cell_bold), Paragraph("3-Layer Prompt-Reasoning Pipeline (Extraction → Selection → Validation)", table_cell)],
        [Paragraph("Primary AI Model", table_cell_bold), Paragraph("Google Gemini (gemini-3.6-flash) with Deterministic Fallbacks", table_cell)],
        [Paragraph("Backend Stack", table_cell_bold), Paragraph("FastAPI (Python), Motor (Async MongoDB), PyMongo", table_cell)],
        [Paragraph("Frontend Stack", table_cell_bold), Paragraph("React, Vite, TailwindCSS, Lucide Icons, Recharts", table_cell)],
        [Paragraph("Document Date", table_cell_bold), Paragraph(datetime.now().strftime("%B %d, %Y"), table_cell)],
    ]
    t_spec = Table(spec_data, colWidths=[1.5*inch, 5.0*inch])
    t_spec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_spec)
    story.append(Spacer(1, 15))

    # Detailed Project Timeline & Phases
    story.append(Paragraph("2. Comprehensive Development Timeline & Phase Roadmap", h1_style))
    story.append(Paragraph("The ProjectMatch platform was developed through structured phases, moving from architecture formulation to full-stack implementation, critique feedback loops, and evaluation benchmarking.", body_style))
    story.append(Spacer(1, 8))

    timeline_table_data = [
        [
            Paragraph("Phase / Milestone", table_header),
            Paragraph("Key Accomplishments & Deliverables", table_header),
            Paragraph("Core Stack / Modules", table_header),
            Paragraph("Status", table_header)
        ],
        [
            Paragraph("Phase 1: Architecture & PRD Definition", table_cell_bold),
            Paragraph("• Formulated 3-layer reasoning concepts<br/>• Drafted ProjectMatch PRD specifications<br/>• Designed multi-agent feedback loop strategy", table_cell),
            Paragraph("ProjectMatch_PRD.md<br/>System Architecture", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 2: Database Schema & Seeding", table_cell_bold),
            Paragraph("• Configured MongoDB models for Candidates, Projects, & Matches<br/>• Developed automated dataset seeder (`seed_data.py`)<br/>• Established async database connection via Motor", table_cell),
            Paragraph("FastAPI, MongoDB<br/>Motor, Pydantic", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 3: Layered AI Pipeline", table_cell_bold),
            Paragraph("• <b>Layer 1:</b> Profile extraction & skill confidence calibration<br/>• <b>Layer 2:</b> Constraint-aware CoT candidate selection<br/>• <b>Layer 3:</b> Self-critique & auto-revision cycle (max 2)<br/>• <b>Fallback:</b> Regex & heuristic matching engine", table_cell),
            Paragraph("Gemini 3.6 Flash<br/>`pipeline.py`<br/>Prompts Modules", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 4: FastAPI REST Layer", table_cell_bold),
            Paragraph("• Implemented candidate CRUD routes<br/>• Built project requirements management routes<br/>• Designed matching execution & live analytics APIs", table_cell),
            Paragraph("FastAPI<br/>Uvicorn, CORS", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 5: React Dashboard Frontend", table_cell_bold),
            Paragraph("• SPA shell with tabbed navigation<br/>• Interactive Candidate & Project management views<br/>• Real-time matching pipeline viewer & CoT display<br/>• Analytics view comparing baseline vs multi-agent", table_cell),
            Paragraph("React, Vite<br/>TailwindCSS<br/>Lucide Icons", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 6: Evaluation & Benchmarking", table_cell_bold),
            Paragraph("• Integrated timing benchmarks per pipeline layer<br/>• Built Naive Baseline prompt comparator<br/>• Added multi-agent revision telemetry tracking", table_cell),
            Paragraph("`naive_baseline.py`<br/>Analytics Dashboard", table_cell),
            Paragraph("Completed", badge_style)
        ],
        [
            Paragraph("Phase 7: Cloud Deployment Readiness", table_cell_bold),
            Paragraph("• Configured powershell setup scripts (`start_all.ps1`)<br/>• Prepared MongoDB Atlas & Cloud hosting workflow<br/>• Generated cloud deployment & PDF documentation", table_cell),
            Paragraph("Render / Vercel<br/>MongoDB Atlas<br/>ReportLab", table_cell),
            Paragraph("Completed", badge_style)
        ]
    ]

    t_timeline = Table(timeline_table_data, colWidths=[1.6*inch, 2.8*inch, 1.3*inch, 0.8*inch])
    t_timeline.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))

    story.append(t_timeline)
    story.append(Spacer(1, 15))

    # Architecture & Key Innovations Deep Dive
    story.append(Paragraph("3. Technical Architecture & Key Pipeline Features", h1_style))

    arch_points = [
        "<b>Layer 1 (Profile Normalization):</b> Takes unstructured self-descriptions and parses them into standardized skill sets with explicit confidence levels (low/medium/high) and flag uncertain fields.",
        "<b>Layer 2 (Constraint-Aware Matching):</b> Matches normalized candidates against target project rules (tech stack, role split, availability), generating an explicit Chain-of-Thought (CoT) selection summary.",
        "<b>Layer 3 (Critique & Revision Loop):</b> Evaluates proposed teams for critical risks (e.g. single point of failure, role imbalance, overload). Instructs Layer 2 to revise up to 2 times if flaws are detected.",
        "<b>Deterministic Fallback Mechanism:</b> Guarantees system reliability. If API rate limits or network issues occur, the pipeline gracefully seamlessly falls back to hardcoded regex and heuristic matching."
    ]

    for pt in arch_points:
        story.append(Paragraph(f"• {pt}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))
    story.append(Paragraph("4. Summary & Cloud Deployment Status", h1_style))
    summary_text = (
        "The ProjectMatch system is fully implemented, verified, and ready for production deployment. "
        "The backend can be deployed seamlessly to Render/Cloud Run using MongoDB Atlas, while the frontend can be hosted on static cloud edge networks such as Vercel or Netlify."
    )
    story.append(Paragraph(summary_text, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF build successful.")

if __name__ == "__main__":
    build_pdf()
