# NutriTrack AI Integration Specification

Version: 1.0.0
Last Updated: 2024-12-03

## Overview

NutriTrack uses LLMs to power three core features:
1. Text-to-Food Parser
2. Photo-to-Food Analyzer  
3. Fix-It Corrections

This document specifies prompts, data flows, evaluation criteria, and operational requirements.

---

## 1. Text-to-Food Parser

### Purpose
Convert natural language food descriptions into structured nutrition data.

### Input
```json
{
  "text": "chipotle bowl with chicken, rice, black beans, and guac",
  "context": {
    "time": "12:30 PM",
    "recentFoods": ["eggs and toast", "protein shake"],
    "frequentFoods": ["chipotle bowl", "salmon and rice"]
  }
}
```

### Output
```json
{
  "name": "Chipotle Chicken Bowl",
  "confidence": 0.92,
  "calories": 755,
  "protein": 52,
  "carbs": 65,
  "fat": 32,
  "items": [
    { "name": "Chicken", "calories": 180, "protein": 32, "carbs": 0, "fat": 7 },
    { "name": "White rice", "calories": 210, "protein": 4, "carbs": 40, "fat": 4 },
    { "name": "Black beans", "calories": 130, "protein": 8, "carbs": 22, "fat": 1 },
    { "name": "Guacamole", "calories": 235, "protein": 3, "carbs": 8, "fat": 22 }
  ],
  "assumptions": [
    "Standard Chipotle portion sizes",
    "White rice (not brown or cauliflower)"
  ],
  "alternatives": [
    { "change": "Brown rice instead", "calorieDelta": -10 },
    { "change": "Double chicken", "calorieDelta": +180 }
  ]
}
```

### System Prompt

```
You are a nutrition analyst for a calorie tracking app. Your job is to parse food descriptions into structured nutrition data.

RULES:
1. Always provide your best estimate. Never refuse to estimate.
2. Use standard portion sizes when not specified:
   - "eggs" = 2 eggs
   - "toast" = 2 slices
   - "chicken breast" = 6 oz
   - "rice" = 1 cup cooked
3. Prefer restaurant-specific data when brand is mentioned
4. List assumptions when making portion estimates
5. Provide 2-3 alternatives with calorie deltas
6. Confidence score 0-1 based on specificity of input

OUTPUT FORMAT:
Return valid JSON matching this schema:
{
  "name": "string",
  "confidence": number,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "items": [{"name": "string", "calories": number, "protein": number, "carbs": number, "fat": number}],
  "assumptions": ["string"],
  "alternatives": [{"change": "string", "calorieDelta": number}]
}
```

### User Prompt Template

```
Parse this food description into nutrition data:

"{user_input}"

Context:
- Time: {current_time}
- Recent foods: {recent_foods}
- Frequently logged: {frequent_foods}

Return JSON only.
```

### Retrieval Layer (RAG)

Before calling the LLM, search these sources in order:
1. **User custom foods** (exact match on name)
2. **User history** (fuzzy match, use their portion preferences)
3. **Restaurant official data** (brand detection triggers lookup)
4. **USDA FoodData Central** (generic foods)
5. **Nutritionix API** (fallback for packaged foods)

If high-confidence match found in steps 1-3, skip LLM entirely.

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Calorie accuracy | ±15% | vs ground truth |
| Macro accuracy | ±20% per macro | vs ground truth |
| Item identification | 90% | correct items detected |
| Parse success | 98% | valid JSON returned |
| Latency p50 | <1.5s | end-to-end |
| Fix-it rate | <20% | user corrections needed |

---

## 2. Photo-to-Food Analyzer

### Pipeline

```
Image → Preprocessing → Vision Model → Item Detection → Portion Estimation → Nutrition Lookup
```

### Preprocessing
- Resize to 1024x1024 max
- Auto-rotate based on EXIF
- Reject if blur score > threshold
- Reject if too dark (mean brightness < 30)

### Vision Prompt

```
Analyze this food photo. For each distinct food item visible:

1. Identify the food item
2. Estimate the portion size (use common references: deck of cards = 3oz meat, tennis ball = 1 cup, etc.)
3. Note preparation method if visible (grilled, fried, etc.)

Format your response as JSON:
{
  "items": [
    {
      "name": "food name",
      "portion": "estimated amount",
      "preparation": "cooking method or null",
      "confidence": 0-1
    }
  ],
  "notes": "any relevant observations"
}
```

### Nutrition Lookup
Vision output feeds into Text-to-Food pipeline with enhanced context:
```
"6oz grilled chicken breast, 1 cup white rice, 1/2 cup steamed broccoli"
```

### Target Metrics

| Metric | Target |
|--------|--------|
| Item detection recall | 85% |
| Item detection precision | 80% |
| Portion estimation | ±25% |
| Calorie accuracy | ±20% |
| Unusable image detection | 95% |
| Latency p50 | <3s |

---

## 3. Fix-It Corrections

### Purpose
Apply user corrections to existing entries without requiring full re-entry.

### Input
```json
{
  "original": {
    "name": "Chipotle Bowl",
    "calories": 755,
    "items": [...]
  },
  "correction": "actually 8oz chicken not 6oz, and no guac"
}
```

### System Prompt

```
You are updating a food entry based on user corrections.

ORIGINAL ENTRY:
{original_json}

USER CORRECTION:
"{correction_text}"

RULES:
1. Preserve all items not mentioned in correction
2. "remove X" = delete that item entirely
3. "add X" = append with standard portion
4. Quantity changes = proportionally adjust calories/macros
5. Recalculate totals after changes
6. Explain what you changed

OUTPUT FORMAT:
{
  "updated": { full updated entry },
  "changes": ["list of changes made"],
  "confidence": 0-1
}
```

### Target Metrics

| Metric | Target |
|--------|--------|
| Correct interpretation | 95% |
| Math accuracy | 100% |
| Idempotency | 100% |
| Undo support | 100% |

---

## Data Sources

### Priority Order
1. User custom foods (exact match)
2. User food history (with their portions)
3. Restaurant official data (top 50 US chains)
4. USDA FoodData Central (380,000+ foods)
5. Nutritionix API (fallback, $0.003/call)

### Restaurant Data
Maintain scraped/official data for:
- Chipotle
- McDonald's
- Starbucks
- Chick-fil-A
- Taco Bell
- Subway
- Wendy's
- Panera
- Panda Express
- (expand to top 50)

---

## Model Selection

| Feature | Model | Cost | Latency |
|---------|-------|------|---------|
| Text-to-Food | GPT-4o | ~$0.01/call | ~1.5s |
| Photo-to-Food | GPT-4V | ~$0.02/call | ~3s |
| Fix-It | GPT-4o-mini | ~$0.002/call | ~0.8s |

### Cost Projections

Per user (5 logs/day: 4 text, 1 photo, 0.5 fix-it):
- Daily: ~$0.06
- Monthly: ~$1.90

At scale (100K users):
- Monthly: ~$190K

Optimization target: <$1/user/month by month 6

---

## Failure Modes

| Failure | Detection | Fallback |
|---------|-----------|----------|
| Unparseable input | No valid JSON | Show helpful example |
| Low confidence (<0.7) | confidence field | Ask clarifying question |
| Vision unusable | Preprocessing check | "Retake photo" with reason |
| API timeout (>10s) | Timer | Retry once, then manual entry |
| Hallucinated values | Range check vs USDA | Cap to reasonable range, flag for review |

---

## Evaluation Dataset

### Text-to-Food (500 entries)
- 100 simple ("2 eggs")
- 100 compound ("eggs with toast and avocado")
- 100 restaurant ("chipotle bowl with...")
- 100 ambiguous ("some chicken")
- 100 edge cases (foreign foods, misspellings)

### Photo-to-Food (500 images)
- 200 controlled (weighed ingredients)
- 200 wild (real user photos)
- 100 failure set (blurry, dark, non-food)

### Ground Truth
- Simple/compound: USDA reference
- Restaurant: Official nutrition data
- Photos: Weighed by dietitian

---

## Prompt Versioning

Store prompts in version control:
```
prompts/
├── text-to-food/
│   ├── v1.0.0.txt
│   ├── v1.1.0.txt
│   └── current -> v1.1.0.txt
├── photo-to-food/
│   └── ...
└── fix-it/
    └── ...
```

A/B testing: 5% → 25% → 50% → 100% rollout
Auto-rollback on regression vs eval suite.

---

## Monitoring

### Metrics to Track
- Parse success rate
- Confidence distribution
- Fix-it rate (proxy for accuracy)
- Latency percentiles
- Cost per user
- User satisfaction (thumbs up/down)

### Alerts
- Parse success < 95%
- Fix-it rate > 25%
- Latency p95 > 5s
- Cost spike > 2x baseline

---

## Privacy

- Food descriptions not stored after processing (unless user opts in)
- Photos deleted after analysis
- No PII in prompts
- Aggregated data only for model improvement
