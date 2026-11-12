import random
import sys
from pathlib import Path

import pandas as pd

# Reuse the backend's career definitions
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
from career_data import CAREERS, SKILLS, INTERESTS, EDUCATION

random.seed(42)
ROWS_PER_CAREER = 400


def sample_items(options, required, p_required, p_other):
    return [o for o in options if random.random() < (p_required if o in required else p_other)]


rows = []
for career, req in CAREERS.items():
    for _ in range(ROWS_PER_CAREER):
        skills = sample_items(SKILLS, req["skills"], 0.75, 0.15) or [random.choice(SKILLS)]
        interests = sample_items(INTERESTS, req["interests"], 0.60, 0.15) or [random.choice(INTERESTS)]
        rows.append({
            "education": random.choice(EDUCATION),
            "skills": "|".join(skills),
            "interests": "|".join(interests),
            "career": career,
        })

df = pd.DataFrame(rows).sample(frac=1, random_state=42)

out = Path(__file__).parent / "data" / "synthetic_profiles.csv"
out.parent.mkdir(exist_ok=True)
df.to_csv(out, index=False)
print(f"Saved {len(df)} rows to {out}")
print(df["career"].value_counts())