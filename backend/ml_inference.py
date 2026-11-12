"""Neural-network career predictions with a safe fallback.

predict_top_careers() returns None when the model is unavailable, so the
caller can fall back to the rule-based recommender.
"""
import logging
import os
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
log = logging.getLogger(__name__)

MODEL_PATH = Path(__file__).resolve().parent / "ml" / "career_model.keras"
_model = None
_tried = False


def _load():
    global _model, _tried
    if _tried:
        return _model
    _tried = True
    if not MODEL_PATH.exists():
        log.warning("Model file not found at %s; using rule-based fallback", MODEL_PATH)
        return None
    try:
        import tensorflow as tf
        _model = tf.keras.models.load_model(MODEL_PATH)
        log.info("Loaded career model from %s", MODEL_PATH)
    except Exception as e:
        log.warning("Could not load model (%s); using rule-based fallback", type(e).__name__)
    return _model


def predict_top_careers(education, skills, interests, top_n=3):
    model = _load()
    if model is None:
        return None
    try:
        import numpy as np
        from ml.features import CAREER_LABELS, encode_profile

        x = encode_profile(education, list(skills), list(interests))[None, :]
        probs = model.predict(x, verbose=0)[0]
        best = np.argsort(probs)[::-1][:top_n]
        return [{"career": CAREER_LABELS[i], "confidence": round(float(probs[i]), 3)} for i in best]
    except Exception as e:
        log.warning("Model prediction failed (%s); using rule-based fallback", type(e).__name__)
        return None



def recommend_careers_smart(education, skills, interests, top_n=3):
    """Neural network first, rule-based fallback. Same output shape as recommend_careers."""
    from career_data import CAREERS
    from recommender import recommend_careers

    preds = predict_top_careers(education, skills, interests, top_n)
    if preds is None:
        return recommend_careers(skills, interests, top_n)

    results = []
    for p in preds:
        title = p["career"]
        req = CAREERS[title]
        hits = [s for s in req["skills"] if s in skills]
        pct = round(p["confidence"] * 100)
        reason = f"Neural network match ({pct}% confidence)"
        if hits:
            reason += " based on your skills in " + ", ".join(hits)
        results.append({
            "title": title,
            "match": pct,
            "reason": reason + ".",
            "missing_skills": [s for s in req["skills"] if s not in skills],
        })
    return results