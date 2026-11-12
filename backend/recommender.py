# PLACEHOLDER ranking based on overlap. Replaced by the TensorFlow model in Phase 4C.
from career_data import CAREERS


def recommend_careers(skills: list[str], interests: list[str], top_n: int = 3) -> list[dict]:
    results = []
    for title, req in CAREERS.items():
        skill_hits = [s for s in req["skills"] if s in skills]
        interest_hits = [i for i in req["interests"] if i in interests]
        score = len(skill_hits) * 2 + min(len(interest_hits), 2)
        max_score = len(req["skills"]) * 2 + 2
        reason_parts = []
        if skill_hits:
            reason_parts.append("your skills in " + ", ".join(skill_hits))
        if interest_hits:
            reason_parts.append("your interest in " + ", ".join(interest_hits))
        reason = ("Matches " + " and ".join(reason_parts) + ".") if reason_parts \
            else "A broad option to explore based on your profile."
        results.append({
            "title": title,
            "match": round(score / max_score * 100),
            "reason": reason,
            "missing_skills": [s for s in req["skills"] if s not in skills],
        })
    results.sort(key=lambda c: (-c["match"], c["title"]))
    return results[:top_n]


def build_roadmap(top_career: dict) -> list[str]:
    title = top_career["title"]
    steps = [f"Learn the basics of {s}" for s in top_career["missing_skills"][:2]]
    steps += [
        f"Build a small portfolio project related to {title}",
        "Share your project on GitHub or LinkedIn",
        f"Apply for 3 internships or entry-level {title} roles",
    ]
    return steps