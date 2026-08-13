#!/usr/bin/env python3
"""Kiểm tra tính toàn vẹn dataset Quỹ đất 2026. Chỉ dùng Python standard library."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
FILES = [
    DATA / "assets-received.json",
    DATA / "assets-surveyed.json",
    DATA / "assets-not-contacted.json",
]
META = DATA / "meta.json"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def fail(message: str) -> None:
    raise SystemExit(f"ERROR: {message}")


def main() -> None:
    meta = load_json(META)
    groups = [load_json(path) for path in FILES]
    assets = [item for group in groups for item in group]

    expected = meta["canonical_counts"]
    if len(assets) != expected["total"]:
        fail(f"Expected {expected['total']} assets, got {len(assets)}")

    ids = [a.get("asset_id") for a in assets]
    if len(ids) != len(set(ids)):
        dup = [k for k, v in Counter(ids).items() if v > 1]
        fail(f"Duplicate asset_id: {dup}")

    expected_ids = [f"CSND-2026-{i:03d}" for i in range(1, expected["total"] + 1)]
    if sorted(ids) != expected_ids:
        missing = sorted(set(expected_ids) - set(ids))
        extra = sorted(set(ids) - set(expected_ids))
        fail(f"ID sequence mismatch; missing={missing}, extra={extra}")

    counts = Counter(a.get("status") for a in assets)
    for status in ("received", "surveyed_not_received", "not_contacted"):
        if counts[status] != expected[status]:
            fail(f"Status {status}: expected {expected[status]}, got {counts[status]}")

    for a in assets:
        for field in ("land_area_m2", "building_area_m2", "original_value_vnd", "residual_value_vnd"):
            value = a.get(field)
            if value is not None and (not isinstance(value, (int, float)) or value < 0):
                fail(f"{a['asset_id']} invalid {field}={value!r}")
        if not isinstance(a.get("plans", []), list):
            fail(f"{a['asset_id']} plans must be a list")
        if not isinstance(a.get("quality_flags", []), list):
            fail(f"{a['asset_id']} quality_flags must be a list")
        for plan in a.get("plans", []):
            if plan.get("mode") not in {"short_term_lease", "investment_call"}:
                fail(f"{a['asset_id']} invalid plan mode {plan.get('mode')}")
            if plan.get("appendix") not in {4, 5}:
                fail(f"{a['asset_id']} invalid appendix {plan.get('appendix')}")
            if plan.get("plan_area_m2") is not None and plan["plan_area_m2"] < 0:
                fail(f"{a['asset_id']} negative plan area")

    lease = sum(any(p.get("mode") == "short_term_lease" for p in a.get("plans", [])) for a in assets)
    invest = sum(any(p.get("mode") == "investment_call" for p in a.get("plans", [])) for a in assets)
    if lease != 9:
        fail(f"Appendix 4 assets: expected 9, got {lease}")
    if invest != 5:
        fail(f"Appendix 5 assets: expected 5, got {invest}")

    print(
        "OK: 62 tài sản; trạng thái 8/25/29; "
        "Phụ lục 4 = 9; Phụ lục 5 = 5; ID duy nhất; số liệu không âm."
    )


if __name__ == "__main__":
    main()
