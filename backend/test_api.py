"""Fast, isolated API contract tests using only fictional demonstration data."""
import os
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

import main
from demo_cases import DEMO_CASES


class ApiContractTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app, raise_server_exceptions=False)

    def test_health_reports_service_status(self):
        response = self.client.get("/api/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")
        self.assertEqual(response.json()["service"], "NEUROSCOPE AI Clinical Core")

    def test_demo_case_analysis_returns_review_contract(self):
        case = DEMO_CASES["SYNTH-NEURO-702"].model_dump(mode="json")

        with patch.dict(os.environ, {"GROQ_API_KEY": ""}):
            response = self.client.post("/api/analyze", json=case)

        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertEqual(result["case_id"], case["id"])
        self.assertTrue(result["engine_source"])
        self.assertTrue(result["citations"])
        self.assertTrue(result["uncertainty_statement"])

    def test_invalid_analysis_input_returns_validation_error(self):
        response = self.client.post("/api/analyze", json={"age": "not-an-integer"})

        self.assertEqual(response.status_code, 422)

    def test_unknown_case_returns_not_found(self):
        response = self.client.get("/api/cases/NO-SUCH-SYNTHETIC-CASE")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Clinical case not found")

    def test_unexpected_analysis_error_returns_server_error(self):
        case = DEMO_CASES["SYNTH-NEURO-702"].model_dump(mode="json")

        with patch.object(main, "generate_clinical_synthesis", side_effect=RuntimeError("test failure")):
            response = self.client.post("/api/analyze", json=case)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()["detail"], "Internal Server Error")


if __name__ == "__main__":
    unittest.main()
