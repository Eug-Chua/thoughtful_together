# Imagine Questions

Scenario-based "What if..." questions organized by **topic** and **depth**.

## Structure

Each JSON file contains questions for a specific topic, with questions at all three depth levels.

```json
{
  "id": number,
  "content": "What if...",
  "depth": "chill" | "deep" | "trust"
}
```

## Topics

### personality.json
Questions about self-discovery, identity, and how we see ourselves.

### wisdom.json
Questions about life lessons, beliefs, and philosophical insights.

### potential.json
Questions about the future, possibilities, and what we could become.

## Depth Levels

- **chill** (Casual) - Light, accessible scenarios
- **deep** - Thought-provoking, reflective scenarios
- **trust** - Vulnerable, intimate scenarios

## Adding Questions

1. Add new question objects to the appropriate topic file
2. Ensure each question has a unique `id` within its file
3. Set the `depth` to match the intensity level
4. All questions should start with "What if..."

## Current Question Count

| Topic | Casual | Deep | Trust | Total |
|-------|--------|------|-------|-------|
| Personality | 2 | 2 | 2 | 6 |
| Wisdom | 2 | 2 | 2 | 6 |
| Potential | 2 | 2 | 2 | 6 |
| **Total** | **6** | **6** | **6** | **18** |
