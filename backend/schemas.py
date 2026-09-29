from pydantic import BaseModel
from typing import List


class RequirementRequest(BaseModel):
    requirement: str


class FunctionalRequirement(BaseModel):
    id: str
    description: str
    priority: str


class DatabaseEntity(BaseModel):
    name: str
    fields: List[str]
    description: str


class APIEndpoint(BaseModel):
    method: str
    path: str
    description: str


class TestCase(BaseModel):
    scenario: str
    expected_result: str


class ArchitectureResponse(BaseModel):
    summary: str

    functional_requirements: List[FunctionalRequirement]

    non_functional_requirements: List[str]

    users_roles: List[str]

    architecture: str

    database_entities: List[DatabaseEntity]

    api_endpoints: List[APIEndpoint]

    security_considerations: List[str]

    test_cases: List[TestCase]

    ambiguities: List[str]

    assumptions: List[str]