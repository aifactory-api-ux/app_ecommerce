import uuid
import hashlib
from datetime import datetime


class LicenseService:
    def generate_license(self) -> str:
        raw = f"{uuid.uuid4()}-{datetime.utcnow().isoformat()}"
        return f"LIC-{hashlib.sha256(raw.encode()).hexdigest()[:16].upper()}"
