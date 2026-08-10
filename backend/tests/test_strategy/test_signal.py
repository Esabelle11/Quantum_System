from app.strategy import signal


def test_signal_module_exists():

    assert signal is not None


# If your signal.py has a class such as:
# SignalGenerator
# then we can make this a proper behavioral test.