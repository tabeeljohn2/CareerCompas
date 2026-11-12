import numpy as np

from career_data import EDUCATION, SKILLS, INTERESTS, CAREERS

CAREER_LABELS = list(CAREERS.keys())
N_FEATURES = len(SKILLS) + len(INTERESTS) + len(EDUCATION)


def encode_profile(education, skills, interests):
    """Turn a profile into a vector of 0/1 values: skills, then interests, then education."""
    vec = np.zeros(N_FEATURES, dtype="float32")
    for i, s in enumerate(SKILLS):
        if s in skills:
            vec[i] = 1
    offset = len(SKILLS)
    for i, s in enumerate(INTERESTS):
        if s in interests:
            vec[offset + i] = 1
    offset += len(INTERESTS)
    if education in EDUCATION:
        vec[offset + EDUCATION.index(education)] = 1
    return vec
