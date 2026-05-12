import pytest
from app.services.license_service import LicenseService


class TestLicenseService:
    def test_generate_license(self):
        service = LicenseService()
        license_key = service.generate_license()

        assert license_key.startswith("LIC-")
        assert len(license_key) == 20

    def test_generate_license_unique(self):
        service = LicenseService()
        licenses = [service.generate_license() for _ in range(100)]

        assert len(set(licenses)) == 100
