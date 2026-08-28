import json
import os
import tempfile

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from pypdf import PdfReader
from docx import Document

from app.database.database import get_db
from app.models.resume import Resume
from app.services.resume_analyzer import analyze_resume


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Analysis"]
)


# =========================
# Extract PDF Text
# =========================

def extract_pdf_text(file_path: str):

    reader = PdfReader(file_path)

    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text() or ""

        if page_text.strip():
            text_parts.append(page_text)

    return "\n".join(text_parts)


# =========================
# Extract DOCX Text
# =========================

def extract_docx_text(file_path: str):

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs)


# =========================
# Upload & Analyze Resume
# =========================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filename = file.filename or ""

    extension = os.path.splitext(
        filename
    )[1].lower()


    # =========================
    # Validate File
    # =========================

    allowed_extensions = {
        ".pdf",
        ".docx"
    }

    if extension not in allowed_extensions:

        return {
            "success": False,
            "message": "Only PDF and DOCX files are supported"
        }


    temp_path = None


    try:

        # =========================
        # Read Uploaded File
        # =========================

        file_content = await file.read()

        if not file_content:

            return {
                "success": False,
                "message": "Uploaded file is empty"
            }


        # =========================
        # Create Temporary File
        # =========================

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_file.write(file_content)

            temp_path = temp_file.name


        # =========================
        # Extract Resume Text
        # =========================

        if extension == ".pdf":

            extracted_text = extract_pdf_text(
                temp_path
            )

        else:

            extracted_text = extract_docx_text(
                temp_path
            )


        # =========================
        # Validate Extracted Text
        # =========================

        if not extracted_text.strip():

            return {
                "success": False,
                "message": "Could not extract text from resume"
            }


        # =========================
        # AI Resume Analysis
        # =========================

        analysis = analyze_resume(
            extracted_text
        )


        # =========================
        # Save Resume
        # =========================

        resume = Resume(

            # Temporary user connection.
            # JWT integration can be added next.
            user_id=1,

            filename=filename,

            file_type=extension,

            extracted_text=extracted_text,

            skills=json.dumps(
                analysis.get(
                    "skills",
                    []
                )
            ),

            experience=analysis.get(
                "experience",
                "Not detected"
            ),

            education=json.dumps(
                analysis.get(
                    "education",
                    []
                )
            ),

            certifications=json.dumps(
                analysis.get(
                    "certifications",
                    []
                )
            ),

            skill_gaps=json.dumps(
                analysis.get(
                    "skill_gaps",
                    []
                )
            )
        )


        db.add(resume)

        db.commit()

        db.refresh(resume)


        # =========================
        # Response
        # =========================

        return {

            "success": True,

            "message": "Resume analyzed successfully",

            "data": {

                "id": resume.id,

                "filename": resume.filename,

                "file_type": resume.file_type,

                "analysis": analysis
            }
        }


    except Exception as e:

        db.rollback()

        print(
            "Resume analysis error:",
            str(e)
        )

        return {

            "success": False,

            "message": "Resume analysis failed",

            "error": str(e)
        }


    finally:

        # =========================
        # Cleanup Temporary File
        # =========================

        if temp_path and os.path.exists(
            temp_path
        ):

            try:

                os.remove(temp_path)

            except Exception:

                pass