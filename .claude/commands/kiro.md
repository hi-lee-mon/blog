---
description: "spec-driven development"
model: claude-opus-4-1-20250805
---

Performs spec-driven development using Claude Code.

## What is spec-driven development

Spec-driven development is a development methodology consisting of the following 5 phases.

### 1. Preparation Phase

- The user communicates an overview of the task they want to execute to Claude Code
- In this phase, execute `mkdir -p ./.cckiro/specs`
- Create a directory with an appropriate spec name based on the task overview within `./.cckiro/specs`
  - For example, for a task like "create article component", create a directory named `./.cckiro/specs/create-article-component`
- Create the following files within this directory

### 2. Requirements Phase

- Claude Code creates a "requirements file" that the task should satisfy based on the task overview communicated by the user
- Claude Code presents the "requirements file" to the user and asks if there are any issues
- The user reviews the "requirements file" and provides feedback to Claude Code if there are any problems
- Repeat modifications to the "requirements file" until the user confirms there are no problems

### 3. Design Phase

- Claude Code creates a "design file" that describes a design satisfying the requirements listed in the "requirements file"
- Claude Code presents the "design file" to the user and asks if there are any issues
- The user reviews the "design file" and provides feedback to Claude Code if there are any problems
- Repeat modifications to the "design file" until the user confirms there are no problems

### 4. Implementation Planning Phase

- Claude Code creates an "implementation plan file" for implementing the design described in the "design file"
- Claude Code presents the "implementation plan file" to the user and asks if there are any issues
- The user reviews the "implementation plan file" and provides feedback to Claude Code if there are any problems
- Repeat modifications to the "implementation plan file" until the user confirms there are no problems

### 5. Implementation Phase

- Claude Code begins implementation based on the "implementation plan file"
- When implementing, please adhere to the content described in the "requirements file" and "design file"