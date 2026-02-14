# Assessment Authoring Tool -- Demo Implementation

## Overview

This project is a demo-ready implementation of an Assessment Authoring
Engine designed for institutional evaluation use cases.

The focus of this implementation is:

-   Multi-type question authoring
-   Purpose-driven metadata enforcement (Formative vs Summative)
-   Simulated AI-assisted content generation
-   Clean and extensible database architecture
-   Structured state management for complex nested form data

This is an authoring-focused system, not a student delivery platform.

------------------------------------------------------------------------

## Core Features Implemented

### Multi-Type Authoring Flow

The system currently supports:

#### MCQ

-   Question stem
-   Multiple distractors
-   Correct answer selection
-   Option-specific feedback (mandatory in formative mode)

#### Ordering

-   List of items
-   Reordering logic supported
-   Correct order stored structurally

Each question type shares common metadata while maintaining its own
type-specific data structure.

------------------------------------------------------------------------

## Purpose-Driven Logic & Conditional Metadata

### Formative Mode

When enabled: - Option-specific feedback becomes mandatory - Every
distractor must include feedback - Real-time validation prevents
submission if feedback is missing

This ensures high-quality practice and remediation support.

### Summative Mode

When enabled: - Learning Objective becomes mandatory - Bloom's Taxonomy
Level becomes mandatory - Validation errors are shown in real-time

This enforces alignment with institutional evaluation standards.

------------------------------------------------------------------------

## Database & Architecture Design

### Design Goals

-   Avoid duplication across question types
-   Support polymorphic question storage
-   Separate shared metadata from type-specific payload
-   Enable future extensibility

### Conceptual Polymorphic Structure

Question: - id - type ("MCQ" \| "ORDERING") - stem - mode ("FORMATIVE"
\| "SUMMATIVE") - metadata (difficulty, bloomLevel, learningObjective) -
payload (JSON for type-specific data)

### Example Payload Structures

MCQ Payload: - options: text, feedback, isCorrect

Ordering Payload: - items list - correctOrder array

### Architectural Rationale

-   Keeps shared logic centralized
-   Prevents schema duplication
-   Allows easy addition of new question types
-   Simplifies validation and rendering logic
-   Supports future AI augmentation and version control

------------------------------------------------------------------------

## GenAI Assistance Flow

### Current Implementation (Simulated)

Flow: 1. Author enters a topic 2. Clicks "AI Generate" 3. System
auto-populates: - Question stem - Options - Suggested metadata

This is mocked for demo purposes.

### Human-in-the-Loop Strategy (Production Vision)

If connected to a real LLM:

-   AI generates draft content
-   Content marked as "AI Draft"
-   Author must review and approve before saving
-   Track AI-generated vs edited final version
-   Validation ensures metadata completeness before publishing

This ensures quality control and academic integrity.

------------------------------------------------------------------------

## State Management Strategy

The system handles:

-   Nested form structures
-   Conditional required fields
-   Mode-dependent validation
-   Type-based UI rendering

Design principles:

-   Centralized state per question
-   Dynamic validation triggered by mode toggle
-   Separation of metadata from type-specific payload
-   Predictable rendering based on question type

------------------------------------------------------------------------

## Future-Proofing: Version Control Strategy

Proposed extension:

Question: - id - currentVersionId

QuestionVersion: - id - questionId - versionNumber - stem - metadata -
payload - createdAt - createdBy

Benefits:

-   Full revision history
-   Rollback capability
-   AI vs Human edit tracking
-   Institutional audit compliance
-   Parallel draft editing support

------------------------------------------------------------------------

## Scope Clarification

This demo focuses on:

-   Authoring experience
-   Metadata enforcement
-   Validation logic
-   Schema robustness

Intentionally excluded:

-   Authentication
-   Student attempt tracking
-   Analytics
-   Deployment-level security

------------------------------------------------------------------------

## Conclusion

This implementation demonstrates:

-   Structured architectural thinking
-   Robust polymorphic schema design
-   Conditional metadata enforcement
-   AI-assisted authoring workflow
-   Extensibility for institutional-scale systems

The system is designed not just to function, but to evolve.
