from dataclasses import dataclass


@dataclass
class Signal:
    action: str
    confidence: float
    reason: str


def generate_signal(
    funding_rate: float,
    oi_change: float,
) -> Signal:

    # Very simple example.
    # NOT a real trading strategy.

    if funding_rate > 0.001 and oi_change > 0:
        return Signal(
            action="SHORT_BIAS",
            confidence=0.65,
            reason="Positive funding + rising OI",
        )

    if funding_rate < -0.001 and oi_change > 0:
        return Signal(
            action="LONG_BIAS",
            confidence=0.65,
            reason="Negative funding + rising OI",
        )

    return Signal(
        action="NEUTRAL",
        confidence=0.50,
        reason="No strong signal",
    )