class RiskManager:

    def __init__(
        self,
        max_position_size: float = 0.01,
        max_leverage: int = 3,
    ):
        self.max_position_size = max_position_size
        self.max_leverage = max_leverage

    def validate(
        self,
        position_size: float,
        leverage: int,
    ) -> bool:

        if position_size > self.max_position_size:
            return False

        if leverage > self.max_leverage:
            return False

        return True