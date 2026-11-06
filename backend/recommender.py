# PLACEHOLDER ranking based on overlap. Replaced by the TensorFlow model in Phase 4.
CAREERS = {
    "Data Analyst": {"skills": ["Python", "SQL", "Excel", "Data analysis"],
                     "interests": ["Business", "Finance", "Science", "Technology"]},
    "Software Developer": {"skills": ["Python", "JavaScript", "SQL"],
                           "interests": ["Technology", "Science"]},
    "Machine Learning Engineer": {"skills": ["Python", "Machine learning", "Data analysis"],
                                  "interests": ["Technology", "Science"]},
    "UX Designer": {"skills": ["Design", "Communication", "Writing"],
                    "interests": ["Art & design", "Technology", "Media"]},
    "Product Manager": {"skills": ["Communication", "Project management", "Data analysis"],
                        "interests": ["Business", "Technology"]},
    "Content Strategist": {"skills": ["Writing", "Communication", "Design"],
                           "interests": ["Media", "Education", "Business"]},
    "Financial Analyst": {"skills": ["Excel", "Data analysis", "SQL"],
                          "interests": ["Finance", "Business"]},
    "Health Data Specialist": {"skills": ["SQL", "Data analysis", "Excel"],
                               "interests": ["Healthcare", "Science"]},
}


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