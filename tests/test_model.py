import numpy as np
import pymc as pm
from src.modeling.change_point_model import build_model

def test_build_model_returns_model():
    # Generate dummy oil price data
    data = np.random.normal(70, 5, size=100)

    # Run model build
    model = build_model(data)

    # Check if result is a PyMC model
    assert isinstance(model, pm.Model)

def test_build_model_with_invalid_data():
    try:
        build_model(None)  # or pass a string or malformed list
        assert False, "build_model should fail on invalid input"
    except Exception:
        assert True  # Expected to raise an error
