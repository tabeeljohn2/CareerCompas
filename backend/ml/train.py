import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import random
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split

ML_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ML_DIR.parent
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(ML_DIR))

from features import CAREER_LABELS, N_FEATURES, encode_profile
from recommender import recommend_careers

SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

DATA_PATH = ML_DIR / "data" / "synthetic_profiles.csv"
MODEL_PATH = ML_DIR / "career_model.keras"


def split_list(value):
    if pd.isna(value):
        return []
    return [x for x in str(value).split("|") if x]


# ---------- Load and encode ----------
df = pd.read_csv(DATA_PATH)
label_to_idx = {c: i for i, c in enumerate(CAREER_LABELS)}

unknown = set(df["career"]) - set(label_to_idx)
assert not unknown, f"Careers in CSV but not in CAREERS: {unknown}"

df["skills_list"] = df["skills"].apply(split_list)
df["interests_list"] = df["interests"].apply(split_list)

X = np.stack([
    encode_profile(r.education, r.skills_list, r.interests_list)
    for r in df.itertuples()
])
y = df["career"].map(label_to_idx).to_numpy()
idx = np.arange(len(df))

# ---------- Split 70 / 15 / 15, stratified ----------
idx_train, idx_temp = train_test_split(
    idx, test_size=0.30, stratify=y, random_state=SEED
)
idx_val, idx_test = train_test_split(
    idx_temp, test_size=0.50, stratify=y[idx_temp], random_state=SEED
)

# ---------- Model: 64 -> 32 -> softmax ----------
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(N_FEATURES,)),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(len(CAREER_LABELS), activation="softmax"),
])
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=5, restore_best_weights=True
)
history = model.fit(
    X[idx_train], y[idx_train],
    validation_data=(X[idx_val], y[idx_val]),
    epochs=100,
    batch_size=32,
    callbacks=[early_stop],
    verbose=2,
)

# ---------- Neural network test metrics ----------
probs = model.predict(X[idx_test], verbose=0)
y_test = y[idx_test]
nn_top1 = float(np.mean(probs.argmax(axis=1) == y_test))
top3_idx = np.argsort(probs, axis=1)[:, -3:]
nn_top3 = float(np.mean([t in row for t, row in zip(y_test, top3_idx)]))


# ---------- Rule-based baseline on the SAME test rows ----------
def career_name(rec):
    for key in ("career", "title", "name"):
        if key in rec:
            return rec[key]
    raise KeyError(f"Cannot find the career name in recommender output keys: {list(rec.keys())}")


b1 = b3 = 0
for i in idx_test:
    row = df.iloc[i]
    recs = recommend_careers(row["skills_list"], row["interests_list"], top_n=3)
    names = [career_name(r) for r in recs]
    b1 += bool(names) and names[0] == row["career"]
    b3 += row["career"] in names[:3]
base_top1 = b1 / len(idx_test)
base_top3 = b3 / len(idx_test)

model.save(MODEL_PATH)

print()
print("=== TEST RESULTS ===")
print(f"Train / val / test rows : {len(idx_train)} / {len(idx_val)} / {len(idx_test)}")
print(f"Epochs run              : {len(history.history['loss'])}")
print(f"Neural network Top-1    : {nn_top1:.3f}")
print(f"Neural network Top-3    : {nn_top3:.3f}")
print(f"Rule-based     Top-1    : {base_top1:.3f}")
print(f"Rule-based     Top-3    : {base_top3:.3f}")
print(f"Top-3 gain over baseline: {nn_top3 - base_top3:+.3f}")
print("Model beats baseline on Top-3:", nn_top3 > base_top3)
print(f"Model saved to          : {MODEL_PATH}")
